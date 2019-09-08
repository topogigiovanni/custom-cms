const Platform = require('./integration.model');
const BaseController = require('../base/controller');
const service = require('./integration.service');

class PlatformController extends BaseController {
  constructor() {
    super('integration', Platform);
    this.attachCreator = true;
  }

  publicGet(req, res, next) {
    return res.json(req[this.namespace]);
  }

  async checkIntegrationStatus(req, res, next) {
    const integration = req[this.namespace];

    if(!integration) {
      return next('Integração não encontrada');
    }

    const serviceResponse = await service.checkAndUpdateIntegrationStatus(integration);
    l('serviceResponse', serviceResponse);

    res.json({
      ok: true,
      _id: integration._id,
      url: integration.url,
      status: serviceResponse
    });
  }
}

module.exports = PlatformController;
