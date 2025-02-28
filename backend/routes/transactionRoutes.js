// backend/routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// Create a new transaction (purchase or rental)
router.post('/', protect, async (req, res) => {
  const { bookId, type } = req.body; // type should be 'purchase' or 'rental'
  try {
    if (!['purchase', 'rental'].includes(type)) {
      return res.status(400).json({ message: 'Invalid transaction type' });
    }
    const transaction = new Transaction({ user: req.user.id, book: bookId, type });
    await transaction.save();

    // Update user record
    const user = await User.findById(req.user.id);
    if (type === 'purchase') {
      user.purchasedBooks.push(bookId);
    } else {
      user.rentedBooks.push(bookId);
    }
    await user.save();

    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all transactions (Admin only)
router.get('/', protect, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  try {
    const transactions = await Transaction.find()
      .populate('user', 'name email')
      .populate('book', 'title author');
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
