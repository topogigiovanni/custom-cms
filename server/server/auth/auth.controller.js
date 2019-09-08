const httpStatus = require('http-status');
const User = require('../user/user.model');
const APIError = require('../helpers/APIError');
const authHelper = require('../helpers/authHelper');
const userService = require('../user/user.service');

const SOCIAL_PROVIDERS = {
  facebook: 'facebook',
  google: 'google'
};

class AuthController {

  authorizeLogin(err, user, req, res, next) {
    const apiError = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);

    if (err){
      return next(err);
    }

    if (!user){
      return next(apiError);
    }

    user.comparePassword(req.body.password, (errr, isMatch) => {
      if (errr) {
        return next(errr);
      }

      if (isMatch) {
        // return the information including token as JSON
        res.json({
          valid: true,
          user: user,
          token: authHelper.buildToken(user)
        });

        return;
      }

      return next(apiError);
    });
  }

  login(req, res, next) {
    User.findOne({
      email: req.body.email,
      isActive: true
    }, (err, user) => {
      return this.authorizeLogin(err, user, req, res, next);
    });
  }

  adminLogin(req, res, next) {
    User.findOne({
      email: req.body.email,
      isAdmin: true,
      isActive: true
    }, (err, user) => {
      return this.authorizeLogin(err, user, req, res, next);
    });
  }

  getRandomNumber(req, res) {
    // req.user is assigned by jwt middleware if valid token is provided
    return res.json({
      user: req.user,
      num: Math.random() * 100
    });
  }

  tokenDecode(req, res) {
    return res.json({
      user: req.user
    });
  }

  saveUser(user, req, res, next) {
    const newUser = new User({
      ...user,
      isAdmin: false,
      isActive: true
    });

    return userService.saveUser(newUser, req, res, next);
  }

  facebookAuth(req, res, next) {
    User.findOne({
      email: req.body.email,
      sourceId: req.body.id,
      source: SOCIAL_PROVIDERS.facebook
    }, (err, user) => {
      if(err){
        return next(err);
      }

      if (user) {
        res.json({
          valid: true,
          user: user,
          token: authHelper.buildToken(user)
        });

        return;
      }

      // cria novo user
      // const name = req.body.name.split(' ');
      // const firstName = name[0];
      // const lastName = name[1] || null;
      const newUser = {
        email: req.body.email,
        sourceId: req.body.id,
        picture: req.body.picture,
        firstname: req.body.name,
        source: SOCIAL_PROVIDERS.facebook,
        password: `${req.body.hash}+${req.body.id}`
      };
      return this.saveUser(newUser, req, res, next);
    });
  }

  googleAuth(req, res, next) {
    User.findOne({
      email: req.body.email,
      sourceId: req.body.id,
      source: SOCIAL_PROVIDERS.google
    }, (err, user) => {
      if(err){
        return next(err);
      }

      if (user) {
        res.json({
          valid: true,
          user: user,
          token: authHelper.buildToken(user)
        });

        return;
      }

      const newUser = {
        email: req.body.email,
        sourceId: req.body.id,
        picture: req.body.picture,
        firstname: req.body.name,
        source: SOCIAL_PROVIDERS.google,
        password: `${req.body.hash}+${req.body.id}`
      };
      return this.saveUser(newUser, req, res, next);
    });
  }

  socialAuth(req, res, next) {
    const provider = req.params.provider || SOCIAL_PROVIDERS.facebook;

    if(provider === SOCIAL_PROVIDERS.facebook){
      return this.facebookAuth(req, res, next);
    }

    if(provider === SOCIAL_PROVIDERS.google){
      return this.googleAuth(req, res, next);
    }

    return next('Provider not found');
  }
}

module.exports = AuthController;
