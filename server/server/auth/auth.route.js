const express = require('express');
const validate = require('express-validation');
const paramValidation = require('./auth.validation');
const authMiddleware = require('./auth.middleware');
const AuthCtrl = require('./auth.controller');

const authCtrl = new AuthCtrl();
const router = express.Router(); // eslint-disable-line new-cap

/** POST /api/auth/login - Returns token if correct username and password is provided */
router.route('/login')
  .post(validate(paramValidation.login), authCtrl.login.bind(authCtrl));

router.route('/admin/login')
  .post(validate(paramValidation.login), authCtrl.adminLogin.bind(authCtrl));

router.route('/social-auth/:provider')
  .post(authCtrl.socialAuth.bind(authCtrl));

/** GET /api/auth/random-number - Protected route,
 * needs token returned by the above as header. Authorization: {token} */
router.route('/random-number')
  .get(authMiddleware.hasAuthorization, authCtrl.getRandomNumber);

router.route('/token/decode')
  .post(authMiddleware.hasAuthorization, authCtrl.tokenDecode);


module.exports = router;
