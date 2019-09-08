const CronJob = require('cron').CronJob;
const config = require('./config');

const cronService = {
  start: () => {
    new CronJob(
      '0 * * * *', // a cada hora
      // '* * * * *', // a cada minuto
      () => {
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
