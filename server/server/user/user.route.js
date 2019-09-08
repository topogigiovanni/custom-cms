const express = require('express');
const validate = require('express-validation');
const paramValidation = require('./user.validation');
const UserCtrl = require('./user.controller');
const authMiddleware = require('../auth/auth.middleware');

const userCtrl = new UserCtrl();
const router = express.Router(); // eslint-disable-line new-cap

const hasAuth = authMiddleware.hasAuthorization;

// User
router.route('/')
  /** GET /api/users - Get list of users */
  .get(userCtrl.list.bind(userCtrl))

  /** POST /api/users - Create new user */
  .post(validate(paramValidation.createUser), userCtrl.create);

router.route('/forgot-password')
  .post(
    userCtrl.forgotPassword.bind(userCtrl)
  );

router.route('/update-forgeted-password')
  .post(
    validate(paramValidation.updatePassword),
    userCtrl.updateForgetedPassword.bind(userCtrl)
  );


router.route('/filter')
  .post(
    hasAuth,
    userCtrl.listFilter.bind(userCtrl)
  );

router.route('/:userId')
  /** GET /api/users/:userId - Get user */
  .get(
    hasAuth,
    userCtrl.get.bind(userCtrl)
  )

  /** PUT /api/users/:userId - Update user */
  .put(
    hasAuth,
    validate(paramValidation.updateUser),
    userCtrl.update.bind(userCtrl)
  )

  /** DELETE /api/users/:userId - Delete user */
  .delete(
    hasAuth,
    userCtrl.remove.bind(userCtrl)
  );

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load.bind(userCtrl));

module.exports = router;
