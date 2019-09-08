const Joi = require('joi');

module.exports = {
  // POST /api/users
  createUser: {
    body: {
      firstname: Joi.string().required(),
      email: Joi.string().required(), //Joi.string().email({ minDomainAtoms: 2 }),
      password: Joi.string().required(),
    }
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      firstname: Joi.string().required(),
      email: Joi.string().required(), //Joi.string().email({ minDomainAtoms: 2 })
    },
    params: {
      userId: Joi.string().hex().required()
    }
  },

  updatePassword: {
    body: {
      passCode: Joi.string().required(),
      email: Joi.string().email(),
      password: Joi.string().required(),
      passwordVerify: Joi.string().required()
    }
  },

  sendNotification: {
    body: {
      type: Joi.string().required(),
      message: Joi.string().required()
    }
  }
};
