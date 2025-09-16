const { body, validationResult } = require('express-validator');
const Issue = require('../models/Issue');
const User = require('../models/User');
const Book = require('../models/Book');

exports.issueValidators = [
  body('studentId').isMongoId(),
  body('bookId').isMongoId(),
  body('days').optional().isInt({ min: 1, max: 60 }),
];

exports.issueBook = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { studentId, bookId, days = 14 } = req.body;
    const [student, book] = await Promise.all([
      User.findById(studentId),
      Book.findById(bookId),
    ]);

    if (!student) return res.status(404).json({ message: 'Student not found' });
    if (student.role !== 'student') return res.status(400).json({ message: 'Target user is not a student' });

    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.availableCopies <= 0) return res.status(400).json({ message: 'No copies available' });

    const active = await Issue.findOne({ user: studentId, book: bookId, returned: false });
    if (active) return res.status(400).json({ message: 'This book is already issued to this student' });

    const dueDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    const issue = await Issue.create({
      user: studentId,
      book: bookId,
      issuedBy: req.user.id, // admin
      dueDate,
    });

    book.availableCopies -= 1;
    await book.save();

    res.status(201).json({ message: 'Book issued', issue });
  } catch (err) {
    next(err);
  }
};

exports.returnValidators = [body('studentId').isMongoId(), body('bookId').isMongoId()];

exports.returnBook = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { studentId, bookId } = req.body;

    const issue = await Issue.findOne({ user: studentId, book: bookId, returned: false }).populate('book');
    if (!issue) return res.status(404).json({ message: 'Active issue not found' });

    issue.returned = true;
    issue.returnDate = new Date();
    await issue.save();

    // Increment availableCopies
    const book = await Book.findById(bookId);
    if (book) {
      book.availableCopies += 1;
      await book.save();
    }

    // Optional: compute fine (₹2/day after dueDate)
    let fine = 0;
    if (issue.returnDate > issue.dueDate) {
      const lateDays = Math.ceil((issue.returnDate - issue.dueDate) / (24 * 60 * 60 * 1000));
      fine = Math.max(0, lateDays * 2);
    }

    res.json({ message: 'Book returned', issue, fine });
  } catch (err) {
    next(err);
  }
};
