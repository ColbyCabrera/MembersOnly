const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: { type: String, required: true, maxLength: 30 },
  first_name: { type: String, required: true, maxLength: 30 },
  last_name: { type: String, required: true, maxLength: 30 },
  password: { type: String, required: true },
  isMember: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", UserSchema);