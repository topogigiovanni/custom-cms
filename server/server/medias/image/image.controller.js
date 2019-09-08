const path = require('path');
const config = require('../../../config/config');

const ID = () => {
  return '_' + Math.random().toString(36).substr(2, 19);
};

class ImageController {
  create(req, res, next) {

    if (Object.keys(req.files).length == 0) {
      return res.json({
        error: {
          message: 'Erro ao fazer upload do arquivo'
        }
      });
    }

    let sampleFile = req.files.upload;

    const filePath = path.format({
      root: '/',
      dir: 'static/imgs',
      base: ID() + '.jpg'
    });

    const baseHost = config.baseURL;

    sampleFile.mv(filePath, function(err) {
      if (err){
        return res.json({
          error: {
            message: 'Erro ao fazer upload do arquivo'
          }
        });
      }

      res.json({
        ok: true,
        url: `${baseHost}/${filePath}`
      });
    });
  }
}

module.exports = ImageController;
