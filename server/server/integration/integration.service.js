const phantom = require('phantom');
const fs = require('fs');
const asyncHelper = require('../helpers/asyncHelper');
const Integration = require('./integration.model');
const status = require('./integration.status.enum');

const {wrap} = asyncHelper;

const baseStaticPath = 'static/integrations/';


const checkAndUpdateIntegrationStatus = async (integration) => {
  const instance = await phantom.create();
  const page = await instance.createPage();

  const TERM = 'MailbizIntegration';
  // const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.97 Safari/537.11';
  const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36';

  // debugger;
  // page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36';
  // page.set('settings.userAgent', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.71 Safari/537.36');
  page.setting('userAgent', USER_AGENT);

  // await page.on('onResourceRequested', function(requestData) {
  //     console.info('Requesting', requestData.url)
  // });

  // await page.on('onLoadFinished', function(status) {
  //   console.log('Status onLoadFinished: ' + status);
  //   // Do other things here...
  // });

  const pageStatus = await page.open(integration.url);
  l(pageStatus);

  const content = await page.property('content');
  // console.log(content);

  let integrationStatus = status.error;

  if (pageStatus === 'success') {
    // 1 - primeiro busca no output da página se existe a varável
    let evalResponse = content.indexOf(TERM) > -1;

    if(!evalResponse) {
      // 2- se o primeiro teste retornar falso, roda o evaluate no final do load da página
      evalResponse = await page.evaluate(function() {
        return window['MailbizIntegration'] && window['MailbizIntegration'].id;
      });

      // evalResponse = await page.evaluate(function () {
      //    return window['MailbizIntegration'];
      // });
    }

    l(evalResponse);

    integrationStatus = evalResponse ? status.integrated : status.notIntegrated;
  }

  // l('page.close ======== =====', page.close);
  await page.close();

  await instance.exit();

  integration.integrationStatus = integrationStatus;

  await integration.save();

  return integrationStatus;
};

exports.saveStaticSettings = async (integrationId, model, cb) => {
  if (!integrationId) {
    return;
  }

  if (typeof integrationId !== 'string') {
    integrationId = integrationId.toString();
  }

  l(model);

  if (!model) {
    return;
  }

  cb = cb || (() => null);

  model = model.toJSON();

  const fileName = `${baseStaticPath}${model._id}.json`;
  const json = JSON.stringify(model);
  fs.writeFile(fileName, json, 'utf8', (err, data) => {
    if (err) {
      // debugger;
      console.log('err', err);
    }

    cb();
  });

  return;
};

exports.removeStaticSettings = (integrationId, cb) => {
  cb = cb || (() => null);
  if (typeof integrationId !== 'string') {
    integrationId = integrationId.toString();
  }
  const fileName = `${baseStaticPath}${integrationId}.json`;
  try {
    fs.unlink(fileName, (err) => {
      if (err) {
        console.log(err);
      }

      //file removed
      cb();
    });
  } catch ($er) {
    cb();
  }
};

exports.checkAndUpdateIntegrationStatus = checkAndUpdateIntegrationStatus;

exports.checkIntegrationsStatus = async (integration) => {
  const response = await wrap(Integration.find());

  if(response.error) {
    return false;
  }

  const integrations = response.data;

  const runCheck = async (index) => {
    const integration = (integrations || [])[index];
    if (!integrations || !integration) {
      return;
    }

    l('rodando: ' + integration.name);

    const response = await checkAndUpdateIntegrationStatus(integration);

    setTimeout(() => runCheck(index + 1), 10000);
  };

  runCheck(0);

  return true;
};
