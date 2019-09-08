const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const modelHookHandler = require('../base/modelHookHandler');


/**
 * Schema
 */
EntitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  collectionName: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  urlPattern: {
    type: String,
    required: true,
    unique: true
  },
  data: Object
});

EntitySchema.plugin(mongoosePaginate);

modelHookHandler(EntitySchema)
  .withStaticMethods();

module.exports = mongoose.model('Entity', EntitySchema)
