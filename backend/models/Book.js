const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
  quantity: { type: Number, required: true }, // Total copies available
  available: { type: Boolean, default: true }, // Indicates if at least one copy is available
});

module.exports = mongoose.model("Book", BookSchema);
