const Platform = require('./platform.model');
const BaseController = require('../base/controller');

class PlatformController extends BaseController {
  constructor() {
    super('platform', Platform);
  }
}

module.exports = PlatformController;
