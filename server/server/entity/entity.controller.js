const Entity = require('./entity.model');
const BaseController = require('../base/controller');

class EntityController extends BaseController {
  constructor() {
    super('entity', Entity);
  }
}

module.exports = EntityController;
