const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const modelHookHandler = require('../base/modelHookHandler');

/**
 * Schema
 */
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

PlatformSchema.plugin(mongoosePaginate);

modelHookHandler(PlatformSchema)
  .withStaticMethods();

module.exports = mongoose.model('Platform', PlatformSchema);
