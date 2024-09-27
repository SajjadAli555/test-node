const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cpassword: {
    type: String,
    required: true,
  },
  avatar: {
    type: String, // Store the path to the uploaded image
  },
  date: {
    type: Date,
    default: Date.now,
  },
  token: {
    type: String,
  },
});

const User = mongoose.model("USER", userSchema);

module.exports = User;
