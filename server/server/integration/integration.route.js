const express = require('express');
const Controller = require('./integration.controller');
const authMiddleware = require('../auth/auth.middleware');
const ctrl = new Controller();
const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  .get(
    authMiddleware.isAdministrator,
    ctrl.list.bind(ctrl)
  )
  .post(
    authMiddleware.isAdministrator,
    ctrl.create.bind(ctrl)
  );

router.route('/filter')
  .post(
    authMiddleware.isAdministrator,
    ctrl.listFilter.bind(ctrl)
  );

router.route('/:integrationId')
  .get(
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

router.route('/public/:integrationId')
  .get(
    ctrl.publicGet.bind(ctrl)
  );

router.route('/:integrationId/check-status')
  .put(
    authMiddleware.isAdministrator,
    ctrl.checkIntegrationStatus.bind(ctrl)
  );

router.param('integrationId', ctrl.load.bind(ctrl));

module.exports = router;
