const express = require('express');
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const modelHookHandler = require('../server/base/modelHookHandler');
const _ = require('lodash');
const config = require('../config/config');
const Controller = require('../server/base/controller');
const schemaHelper = require('./schemaHelper');

const modelFactory = {
  create: (entity) => {
    const schema = new mongoose.Schema(schemaHelper.parse(entity.data));

    schema.plugin(mongoosePaginate);

    modelHookHandler(schema)
      .withStaticMethods();

    return mongoose.model(entity.collectionName, schema);
  }
};

module.exports = modelFactory;
