const mailer = require('../helpers/mailer');

const userMail = {
  sendForgotPassword: (user, passCode) => {
    const params = {
      to: user.email,
      subject: 'Your braza code',
      body: `
        Hello ${user.firstname},
        <br>
        Your code is
        <br>
        <strong>${passCode}</strong>
      `
    };

    return mailer.sendMail(params);
  },
  sendNotification: (body, callback = () => {}) => {
    const {
      toEmail,
      subject,
      message
    } = body;

    const params = {
      to: toEmail,
      subject: subject,
      body: message
    };

    return mailer.sendMail(params, callback);
  }
};

module.exports = userMail;
