// backend/models/Transaction.js
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  type: { type: String, enum: ['purchase', 'rental'], required: true },
  transactionDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
