const CronJob = require('cron').CronJob;
const integrationService = require('../server/integration/integration.service');
const config = require('./config');

const cronService = {
  start: () => {
    new CronJob(
      '0 * * * *', // a cada hora
      // '* * * * *', // a cada minuto
      () => {
        integrationService.checkIntegrationsStatus();
      },
      null,
      true,
      config.tz
    );

    // DEBUG
    // integrationService.checkIntegrationsStatus();
  }
};

module.exports = cronService;
