const express = require('express');
const mongoose = require('mongoose');
const _ = require('lodash');
const service = require('../server/entity/entity.service');
const config = require('../config/config');
const Controller = require('../server/base/controller');
const modelFactory = require('./modelFactory');
const schemaHelper = require('./schemaHelper');
const Schema = mongoose.Schema;

let modelCollection = {};
let routeCollection = {};
let app;
let router;

// let glob = global;

// dummySchema
// // A generic answer sub-schema
var answerSchema = new Schema({
    answer: String,
    correct: Boolean
});

// A generic Question sche
var questionSchema = new Schema({
    text: String,
    answers: [answerSchema]
});

const ExtraFieldSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  customId: {
    type: String,
    required: true
  },
  selector: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  }
});

const PlatformSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  formSelector: {
    type: String
  },
  emailSelector: {
    type: String
  },
  nameSelector: {
    type: String
  },
  radioSelector: {
    type: String
  },
  submitSelector: {
    type: String
  },
  useScript: {
  type: Boolean
  }
}, {
  timestamps: true
});

// const Question = mongoose.model( 'Question', questionSchema );
////////

const buildRoute = (model) => {
  const namespace = model.collectionName + 'Id';

  const ctrl = new Controller(namespace, model.$model);
  const router = express.Router();

  const routeName = (name) => {
    // return `/${model.collectionName}${name}`;
    return name;
  };

  router.route(routeName('/'))
    .get(ctrl.list.bind(ctrl))
    .post(ctrl.create.bind(ctrl));

  router.route(routeName('/filter'))
    .post(
      ctrl.listFilter.bind(ctrl)
    );

  router.route(routeName('/:' + namespace))
    .get(
      ctrl.get.bind(ctrl)
    )
    .put(
      ctrl.update.bind(ctrl)
    )
    .delete(
      ctrl.remove.bind(ctrl)
    );

  router.param(namespace, ctrl.load.bind(ctrl));

  return router;
};

const modelResolver = {
  init: async (router, _app) => {
    app = _app;
    const entities = await service.getEntities();

    l(entities);
    if(entities && entities.length){
      entities.forEach(entity => {
        modelResolver.addModel(entity);
      });
    }

    // const qSchema = schemaHelper.stringify(PlatformSchema);
    // debugger;
    // l('qSchema', qSchema);
    // const rev = schemaHelper.parse(qSchema);
    // l('rev', rev);

    // const saveMsg = {
    //   name: 'Platform',
    //   //id: 'extra-field',
    //   urlPattern: 'platform',
    //   collectionName: 'Platform',
    //   data: qSchema,
    //   timestamps: true
    // };

    // const resp = await service.saveEntity(saveMsg);

    // l('resp', resp);
    // debugger;

    modelResolver.initRoutes(router);
  },
  addModel: (entity) => {
    try {
      entity.$model = modelFactory.create(entity);
    } catch(err){
      l(err);
    }

    modelCollection[entity.collectionName] = entity;

    return entity;
  },
  getModel: (modelName) => {
    return modelCollection[modelName];
  },
  getRoute: (model) => {
    if(!model){
      return;
    }

    const modelName = model.collectionName;

    if(routeCollection[modelName]) {
      return routeCollection[modelName];
    }

    routeCollection[modelName] = buildRoute(model);

    return routeCollection[modelName];
  },
  initRoutes: (_router) => {
    router = _router;

    const collections = Object.keys(modelCollection);

    collections.forEach((collectionName) => {
      const model = modelCollection[collectionName];
      const modelRouteName = model.urlPattern || model.collectionName;
      l(`registering ${collectionName} - ${modelRouteName}`);
      router.use('/' + modelRouteName, modelResolver.getRoute(model));
    });

    global.routes = router;

    // app.use(function replaceableRouter (req, res, next) {
    //   router(req, res, next)
    // });

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
    //   req.next(route);

    //   res.json(true);
    // });

    // app.use('/api', router);
  }
};

module.exports = modelResolver;
