const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: { type: String, unique: true, required: true },
  password: String,
  secret: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;