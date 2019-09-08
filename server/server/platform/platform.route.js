const express = require('express');
const Controller = require('./platform.controller');
const authMiddleware = require('../auth/auth.middleware');
const ctrl = new Controller();
const router = express.Router(); // eslint-disable-line new-cap

// const hasAuth = authMiddleware.hasAuthorization;

router.use(authMiddleware.isAdministrator);

router.route('/')
  .get(ctrl.list.bind(ctrl))
  .post(ctrl.create.bind(ctrl));

router.route('/filter')
  .post(
    ctrl.listFilter.bind(ctrl)
  );

router.route('/:platformId')
  .get(
    ctrl.get.bind(ctrl)
  )
  .put(
    ctrl.update.bind(ctrl)
  )
  .delete(
    ctrl.remove.bind(ctrl)
  );

router.param('platformId', ctrl.load.bind(ctrl));

module.exports = router;
