const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const modelHookHandler = require('../base/modelHookHandler');
const status = require('./integration.status.enum');
const service = require('./integration.service');

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

/**
 * Schema
 */
const IntegrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String
  },
  active: {
    type: Boolean,
    default: true
  },
  platform: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Platform',
    required: true,
    populate: true
  },
  listId: {
    type: String,
    required: true
  },
  listId: {
    type: String
  },
  sendUrl: {
    type: String
  },
  formSelector: {
    type: String
  },
  emailSelector: {
    type: String
  },
  nameCustomId: {
    type: String
  },
  nameCustomSelector: {
    type: String
  },
  radioCustomId: {
    type: String
  },
  radioCustomSelector: {
    type: String
  },
  submitSelector: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  modifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  timeout: {
    type: Number
  },
  integrationStatus: {
    type: String,
    default: status.notIntegrated
  },
  extraFields: {
    type: [ExtraFieldSchema]
  }
}, {
  timestamps: true
});

IntegrationSchema.plugin(mongoosePaginate);

modelHookHandler(IntegrationSchema)
  .withStaticMethods();

module.exports = mongoose.model('Integration', IntegrationSchema);
