const { body, validationResult } = require('express-validator');
const Book = require('../models/Book');

exports.createValidators = [
  body('title').trim().notEmpty(),
  body('author').trim().notEmpty(),
  body('isbn').trim().notEmpty(),
  body('totalCopies').isInt({ min: 0 }),
];

exports.createbook = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, author, isbn, totalCopies } = req.body;

    const existing = await Book.findOne({ isbn });
    if (existing) return res.status(400).json({ message: 'ISBN already exists' });

    const book = await Book.create({
      title,
      author,
      isbn,
      totalCopies,
      availableCopies: totalCopies,
    });

    res.status(201).json(book);
  } catch (err) {
    next(err);
  }
};

exports.getbook = async (req, res, next) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    next(err);
  }
};

exports.getAllBookIds = async (req, res, next) => {
  try {
    const ids = await Book.find({}, '_id');
    res.json(ids.map((d) => d._id));
  } catch (err) {
    next(err);
  }
};

exports.getbookbyid = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    next(err);
  }
};

exports.updatebook = async (req, res, next) => {
  try {
    const { title, author, isbn, totalCopies } = req.body;
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    if (isbn && isbn !== book.isbn) {
      const exists = await Book.findOne({ isbn });
      if (exists) return res.status(400).json({ message: 'ISBN already exists' });
    }

    // When changing totalCopies, adjust availableCopies accordingly (never negative)
    if (typeof totalCopies === 'number') {
      const delta = totalCopies - book.totalCopies;
      const newAvailable = book.availableCopies + delta;
      if (newAvailable < 0) return res.status(400).json({ message: 'Not enough available copies to reduce total' });
      book.availableCopies = newAvailable;
      book.totalCopies = totalCopies;
    }

    if (title !== undefined) book.title = title;
    if (author !== undefined) book.author = author;
    if (isbn !== undefined) book.isbn = isbn;

    await book.save();
    res.json(book);
  } catch (err) {
    next(err);
  }
};

exports.deletebook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};
