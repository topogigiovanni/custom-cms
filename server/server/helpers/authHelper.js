const jwt = require('jsonwebtoken');
const config = require('../../config/config');

const authHelper = {
  buildToken: $user => {
    // console.log('user', $user);
    // debugger;
    const user = $user._doc ? $user._doc : $user;
    const {picture, ...otherUserProps} = (user || {});
    return jwt.sign({
      ...otherUserProps
    }, config.jwtSecret, {
      expiresIn: '48h'
    });
  },
  generatePassCode: () => {
    return (Math.floor(Math.random() * 10000000) + 1) + ''
  }
};

module.exports = authHelper;
