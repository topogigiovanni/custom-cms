const path = require('path');
const Platform = require('./tutorial.model');
const BaseController = require('../base/controller');

class TutorialController extends BaseController {

  constructor() {
    super('tutorial', Platform);
    this.attachCreator = true;
  }

  publicView(req, res, next) {
    const model = req[this.namespace] || {};

    res.render('tutorial/public.html', {model});
  }
}

module.exports = TutorialController;
