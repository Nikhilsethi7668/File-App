const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  serialNo: Number,
  firstName: String,
  lastName: String,
  company: String,
  title: String,
  email: String,
  phone: String,
});

module.exports = mongoose.model("User", userSchema);
