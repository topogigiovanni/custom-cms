const jwt = require('jsonwebtoken');
const config = require('../../config/config');

const authMiddleware = {

  hasAuthorization(req, res, next) {
    if (req.headers.authorization) {
      jwt.verify(req.headers.authorization, config.jwtSecret, (err, decoded) => {
        if (err) {
          return res.sendStatus(403);
        }

        req.user = decoded;
        next();
      });
    } else {
      return res.sendStatus(403);
    }
  },

  isAdministrator(req, res, next) {
    if (req.headers.authorization) {
      jwt.verify(req.headers.authorization, config.jwtSecret, (err, decoded) => {
        if (!err && decoded && decoded.isAdmin) {
          req.user = decoded;
          next();
          return;
        }

        return res.sendStatus(403);
      });
    } else {
      return res.sendStatus(401);
    }
  }
};

module.exports = authMiddleware;
