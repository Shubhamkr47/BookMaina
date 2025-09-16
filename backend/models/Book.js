const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  category: { type: String },
  availability: { type: String, enum: ['available', 'issued'], default: 'available' }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
