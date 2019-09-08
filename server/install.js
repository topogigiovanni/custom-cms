/*
  Use this script at installation
*/
const mongoose = require('mongoose');
const userModel = require('./server/user/user.model');
const config = require('./config/config');

const mongoUri = config.mongo.host;

const onConnect = (err) => {
  if (err) {
    console.error(err.stack);
  } else {

    userModel.find({}, (err, users) => {
      if (!err) {
        console.log('users', users);

        // pass encoded: $2a$10$j3UJPC3gTyE36Hxw5VyNyea.EI78zsgbm4RPl0R3GXNIQAbD6K0i.
        userModel.create({
          firstname: 'Admin',
          email: 'admin@admin.com',
          password: '123',
          isAdmin: true,
          isActive: true
        }, (err, user) => {
          if (!err) {
            console.log('User admin created !');
          } else {
            console.log(err);
          }

          mongoose.connection.close();
        });
      } else {
        console.log(err);
      }

    });
  }
};

mongoose.connect(
  mongoUri,
  {
    useNewUrlParser: true,
    useCreateIndex: true
  },
  onConnect
);
