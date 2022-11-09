const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Object = new Schema ({
  name: { type: String, required: true, index: { unique: true } },
  description: { type: String, required: true },
});

module.exports = mongoose.model('Object', Object)
