const express = require('express');
const Controller = require('./homolog.controller');
//const authMiddleware = require('../auth/auth.middleware');
const ctrl = new Controller();
const router = express.Router(); // eslint-disable-line new-cap

// router.use(authMiddleware.isAdministrator);

router.route('/')
  .get(ctrl.publicView.bind(ctrl));

module.exports = router;
