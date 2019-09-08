const express = require('express');
const userRoutes = require('./server/user/user.route');
const authRoutes = require('./server/auth/auth.route');
// const platformRoutes = require('./server/platform/platform.route');
// const integrationRoutes = require('./server/integration/integration.route');
// const tutorialRoutes = require('./server/tutorial/tutorial.route');
// const mediasRoutes = require('./server/medias/medias.route');
const entityRoutes = require('./server/entity/entity.route');


const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// router.use('/platform', platformRoutes);
// router.use('/integration', integrationRoutes);
// router.use('/tutorial', tutorialRoutes);
// router.use('/medias', mediasRoutes);

router.use('/entity', entityRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);
// mount user routes at /users
router.use('/users', userRoutes);

// router.use('/:entityId', (req, res, next) => {
//   l(req.params.entityId);
//   debugger;
//   const model = modelResolver.getModel(req.params.entityId);

//   if(!model){
//     return res.send(404);
//   }

//   const route = modelResolver.getRoute(model);

//   //router.use('/users', userRoutes);
//   debugger;
//   return route(req, res, next);//req.next(route);

//   //res.json(true);
// });

module.exports = router;
