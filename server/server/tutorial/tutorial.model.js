const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const modelHookHandler = require('../base/modelHookHandler');

/**
 * Schema
 */
const TutorialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  platform: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Platform',
    required: true,
    populate: true
  },
  html: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  modifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

TutorialSchema.plugin(mongoosePaginate);

modelHookHandler(TutorialSchema)
  .withStaticMethods();

module.exports = mongoose.model('Tutorial', TutorialSchema);
