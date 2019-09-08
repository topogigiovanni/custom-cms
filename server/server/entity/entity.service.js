const asyncHelper = require('../helpers/asyncHelper');
const Entity = require('./entity.model');
const {wrap} = asyncHelper;

exports.getEntities = async () => {
  const response = await wrap(Entity.find());

  if(response.error) {
    return false;
  }

  const entities = response.data;

  // const runCheck = async (index) => {
  //   const integration = (integrations || [])[index];
  //   if (!integrations || !integration) {
  //     return;
  //   }

  //   l('rodando: ' + integration.name);

  //   const response = await checkAndUpdateEntityStatus(integration);

  //   setTimeout(() => runCheck(index + 1), 10000);
  // };

  // runCheck(0);

  return entities;
};

exports.saveEntity = async (saveMessage) => {
  return await Entity.create(saveMessage);
};
