const Promise = require('bluebird');
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const bcrypt = require('bcryptjs');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

const SALT_WORK_FACTOR = 10;

/**
 * Schema
 */
const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: String,
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [(email) => {
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
    }, 'Please use a valid email address'],
  },
  password: {
    type: String,
    required: true
  },
  passCode: {
    type: String
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    default: 'active'
  },
  picture: {
    type: String
  }
}, {
  timestamps: true
});

function generateSalt(user, callback) {
  callback = callback || function() {};

  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) {
      // console.log('err 1', err);
      return callback(err);
    }

    // console.log('stp 1', err, salt);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, (err, hash) => {
      // console.log('stp 2', err, salt, hash);

      if (err) {
        // console.log('err 2', err);
        return callback(err);
      }

      // override the cleartext password with the hashed one
      user.password = hash;
      callback(null, hash);
    });
  });
}

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

// https://stackoverflow.com/questions/14588032/mongoose-password-hashing
// must be a declarated function, not arrow
UserSchema.pre('save', function(next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) {
    // console.log('!user.isModified( ', !user.isModified, user.isModified);
    return next();
  }

  generateSalt(user, (err) => {
    next(err);
  });
});

UserSchema.pre('update', function(next) {
  const self = this;
  // let user = this.getUpdate().$set;
  let user = this.getUpdate();
  // debugger;

  // console.log('user update', user)

  // only hash the password if it has been modified (or is new)
  if (!user.password) {
    return next();
  }

  generateSalt(user, (err, pass) => {

    self.update({}, {
      $set: {
        password: pass
      }
    });

    next(err);
  });
});

/**
 * Methods
 */
UserSchema.method({
  comparePassword: function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      if (err) return cb(err);
      cb(null, isMatch);
    });
  }
});

/**
 * Statics
 */
UserSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  },

  getUser(props = {}) {
    return this.findOne({
        ...props,
        isActive: true
      })
      .exec();
  },

  listActives({ skip = 0, limit = 50 } = {}) {
    return this.find({isActive: true})
      .sort({
        createdAt: -1
      })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

UserSchema.plugin(mongoosePaginate);


module.exports = mongoose.model('User', UserSchema);
