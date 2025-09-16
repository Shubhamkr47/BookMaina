const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const auth = require('../middlewares/Auth');
const adminOnly = require('../middlewares/adminOnly');

/**
 * 🔍 Search Books (both students & admins)
 * Query params: title, author, isbn, availability
 */
router.get('/search', auth, async (req, res) => {
  try {
    const { title, author, isbn, availability } = req.query;
    const query = {};

    if (title) query.title = { $regex: title, $options: 'i' };
    if (author) query.author = { $regex: author, $options: 'i' };
    if (isbn) query.isbn = { $regex: isbn, $options: 'i' };
    if (availability) query.availability = { $regex: availability, $options: 'i' };

    const books = await Book.find(query);
    res.json(books);
  } catch (err) {
    console.error('❌ Error searching books:', err);
    res.status(500).json({ error: 'Server error while searching books' });
  }
});

/**
 * 📚 Get All Books (admin only)
 */
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    console.error('❌ Error fetching books:', err);
    res.status(500).json({ error: 'Server error while fetching books' });
  }
});

/**
 * ➕ Add Book (admin only)
 */
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { title, author, isbn, category, availability, year } = req.body;
    const newBook = new Book({
      title,
      author,
      isbn,
      category,
      availability,
      year
    });

    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (err) {
    console.error('❌ Error adding book:', err);
    res.status(500).json({ error: 'Server error while adding book' });
  }
});

/**
 * ✏️ Update Book (admin only)
 */
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!updatedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(updatedBook);
  } catch (err) {
    console.error('❌ Error updating book:', err);
    res.status(500).json({ error: 'Server error while updating book' });
  }
});

/**
 * 🗑️ Delete Book (admin only)
 */
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting book:', err);
    res.status(500).json({ error: 'Server error while deleting book' });
  }
});

/**
 * 📖 Get Single Book by ID (admin only)
 */
router.get('/:id', auth, adminOnly, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (err) {
    console.error('❌ Error fetching book:', err);
    res.status(500).json({ error: 'Server error while fetching book' });
  }
});

module.exports = router;
