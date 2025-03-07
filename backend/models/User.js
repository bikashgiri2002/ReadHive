const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String, // Admin has fixed credentials
  department: String,
  regdNo: { type: String, unique: true },
  role: { type: String, enum: ["admin", "student"], required: true },
});

module.exports = mongoose.model("User", UserSchema);
