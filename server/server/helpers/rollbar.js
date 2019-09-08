const Rollbar = require('rollbar');
const config = require('../../config/config');

const rollbar = new Rollbar({
  accessToken: config.rollbar.accessToken,
  captureUncaught: true,
  captureUnhandledRejections: true
});


module.exports = rollbar;
