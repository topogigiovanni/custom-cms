const nodemailer = require('nodemailer');
const config = require('../../config/config');

function Mailer() {

  let transporter;

  try {
    transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 465,
      secure: true, // use SSL
      auth: {
        user: config.mailer.email,
        pass: config.mailer.password
      }
    });
  } catch (e) {
    console.log(e);
  }

  this.sendMail = () => {};

  if (transporter) {
    this.sendMail = (options, callback) => {

      const baseMail = 'braza.app@brazasoccer.com';
      // var baseMail = 'jsel.robot@gmail.com';

      const mailOptions = {
        from: `"Braza Soccer" <${baseMail}>`, // sender address
        to: options.to || '', // list of receivers
        subject: options.subject || '', // Subject line
        html: options.body || '' // html body
      };

      return transporter.sendMail(mailOptions, callback);

    };

  }

}

module.exports = new Mailer();
