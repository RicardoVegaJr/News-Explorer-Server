const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 30 },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(value) { return validator.isURL(value); },
      message: 'You must enter a valid URL',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: { validator: validator.isEmail, message: 'Invalid email' },
  },
  password: { type: String, required: true, select: false },
  articles: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Card',
}],
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Incorrect email or password'));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error('Incorrect email or password'));
        }
        return user;
      });
    });
};

module.exports = mongoose.model('User', userSchema);