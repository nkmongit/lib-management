const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String }, // New field for description
  author: String,
  isbn: String,
  category: String,
  price: Number,       // Price for purchase
  rentalPrice: Number, // Price for rental
  available: { type: Boolean, default: true },
  ratings: [
    { 
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: Number 
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Book', BookSchema);
