const Joi = require('joi');

module.exports = {
  login: {
    body: {
      email: Joi.string().required(),
      password: Joi.string().required()
    }
  }
};
