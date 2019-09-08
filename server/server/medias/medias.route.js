const express = require('express');
const fileUpload = require('express-fileupload');
const ImgController = require('./image/image.controller');
const authMiddleware = require('../auth/auth.middleware');
const imgCtrl = new ImgController();
const router = express.Router(); // eslint-disable-line new-cap

router.use(authMiddleware.isAdministrator);

router.use(fileUpload());

router.route('/img')
  .post(imgCtrl.create.bind(imgCtrl));


module.exports = router;
