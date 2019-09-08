const express = require('express');
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const _ = require('lodash');
const modelHookHandler = require('../server/base/modelHookHandler');
const config = require('../config/config');
const Controller = require('../server/base/controller');
const schemaHelper = require('./schemaHelper');

const modelFactory = {
  create: (entity) => {
    const schemaSettings = {
      timestamps: _.get(entity, 'timestamps', false)
    };

    const schema = new mongoose.Schema(schemaHelper.parse(entity.data), schemaSettings);

    schema.plugin(mongoosePaginate);

    modelHookHandler(schema)
      .withStaticMethods();

    return mongoose.model(entity.collectionName, schema);
  }
};

module.exports = modelFactory;
