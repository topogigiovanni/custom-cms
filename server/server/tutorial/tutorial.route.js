const express = require('express');
const Controller = require('./tutorial.controller');
const authMiddleware = require('../auth/auth.middleware');
const ctrl = new Controller();
const router = express.Router(); // eslint-disable-line new-cap

// router.use(authMiddleware.isAdministrator);

router.route('/')
  .get(authMiddleware.isAdministrator, ctrl.list.bind(ctrl))
  .post(authMiddleware.isAdministrator, ctrl.create.bind(ctrl));

router.route('/filter')
  .post(
    authMiddleware.isAdministrator,
    ctrl.listFilter.bind(ctrl)
  );

router.route('/:tutorialId')
  .get(
    authMiddleware.isAdministrator,
    ctrl.get.bind(ctrl)
  )
  .put(
    authMiddleware.isAdministrator,
    ctrl.update.bind(ctrl)
  )
  .delete(
    authMiddleware.isAdministrator,
    ctrl.remove.bind(ctrl)
  );

router.route('/public/:tutorialId')
  .get(ctrl.publicView.bind(ctrl));

router.param('tutorialId', ctrl.load.bind(ctrl));

module.exports = router;
