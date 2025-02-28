// backend/routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Transaction = require('../models/Transaction'); // <-- Make sure this line is present
const { protect, admin } = require('../middleware/authMiddleware');


// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new book (Admin only)
router.post('/', protect, admin, async (req, res) => {
  const { title, author, isbn, category, price, rentalPrice } = req.body;
  try {
    const book = new Book({ title, author, isbn, category, price, rentalPrice });
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a book (Admin only)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a book (Admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    // Use findByIdAndDelete to remove the book
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book removed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/:id/details', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    
    // Fetch transactions for this book and populate user details
    const transactions = await Transaction.find({ book: req.params.id }).populate('user', 'name email');
    
    res.json({ book, transactions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
