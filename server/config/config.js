const path = require('path');
const Joi = require('joi');

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test', 'provision'])
    .default('development'),
  PORT: Joi.number()
    .default(4040),
  MONGOOSE_DEBUG: Joi.boolean()
    .when('NODE_ENV', {
      is: Joi.string().equal('development'),
      then: Joi.boolean().default(true),
      otherwise: Joi.boolean().default(false)
    }),
  JWT_SECRET: Joi.string().required()
    .description('JWT Secret required to sign'),
  MONGO_HOST: Joi.string().required()
    .description('Mongo DB host url'),
  MONGO_PORT: Joi.number()
    .default(27017),
  RUN_CRON: Joi.boolean().default(true)
}).unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  tz: 'America/Sao_Paulo',
  baseURL: envVars.NODE_ENV === 'development' ? 'http://localhost:5001' : 'https://integration-hub.mailclick.me/server',
  mongooseDebug: envVars.MONGOOSE_DEBUG,
  jwtSecret: envVars.JWT_SECRET,
  mongo: {
    host: envVars.MONGO_HOST,
    port: envVars.MONGO_PORT
  },
  mailer: {
    email: envVars.MAILER_EMAIL_FROM || '',
    password: envVars.MAILER_EMAIL_PASSWORD || ''
  },
  rollbar: {
    accessToken: envVars.ROLLBAR_ACCESSTOKEN || ''
  },
  enableCronJob: envVars.RUN_CRON,
  enableAPIErrorHandler: false
};

module.exports = config;
