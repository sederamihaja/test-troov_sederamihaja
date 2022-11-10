const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const User = new Schema ({
  lastName: { type: String, required: true },
  firstName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
});

module.exports = mongoose.model('User', User)
