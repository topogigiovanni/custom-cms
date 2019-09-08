const process = require('process');
const mongoose = require('mongoose');
const util = require('util');

global.l = function(){
  console.log.apply(console, arguments);
};

process.on('uncaughtException', (err, origin) => {
  console.log('uncaughtException', err);
});

// config should be imported before importing any other file
const config = require('./config/config');
const cron = require('./config/cron');

l(1);
const app = require('./config/express');
l('passou');

const debug = require('debug')('api:index');

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

// connect to mongo db
const mongoUri = config.mongo.host;
mongoose.connect(mongoUri,
  {
    useNewUrlParser: true,
    useCreateIndex: true
  }
);

mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});

// print mongoose logs in dev env
if (config.mongooseDebug) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}

if (config.enableCronJob) {
  cron.start();
}

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
  // listen on port config.port
  app.listen(config.port, () => {
    console.info(`server started on port ${config.port} (${config.env})`); // eslint-disable-line no-console
  });
}

module.exports = app;
