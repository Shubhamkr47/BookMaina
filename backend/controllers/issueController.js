const { body, validationResult } = require('express-validator');
const Issue = require('../models/Issue');
const User = require('../models/User');
const Book = require('../models/Book');

exports.issueValidators = [
  body('bookId').isMongoId(),
  body('days').optional().isInt({ min: 1, max: 60 }),
  body('studentId').optional().isMongoId(),
  body('studentEmail').optional().isEmail().normalizeEmail(),
  body().custom((value) => {
    if (!value.studentId && !value.studentEmail) {
      throw new Error('studentId or studentEmail is required');
    }
    return true;
  }),
];

exports.issueBook = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { studentId, studentEmail, bookId, days = 14 } = req.body;
    const studentQuery = studentId ? { _id: studentId } : { email: studentEmail };
    const [student, book] = await Promise.all([
      User.findOne(studentQuery),
      Book.findById(bookId),
    ]);

    if (!student) return res.status(404).json({ message: 'Student not found' });
    if (student.role !== 'student') return res.status(400).json({ message: 'Target user is not a student' });

    if (!book) return res.status(404).json({ message: 'Book not found' });

    const availableCopies = typeof book.availableCopies === 'number'
      ? book.availableCopies
      : book.availability === 'available'
        ? 1
        : 0;
    if (availableCopies <= 0) return res.status(400).json({ message: 'No copies available' });

    const active = await Issue.findOne({ user: student._id, book: bookId, returned: false });
    if (active) return res.status(400).json({ message: 'This book is already issued to this student' });

    const dueDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    const issue = await Issue.create({
      user: student._id,
      book: bookId,
      issuedBy: req.user.id,
      dueDate,
    });

    if (typeof book.availableCopies === 'number') {
      book.availableCopies -= 1;
    }
    book.availability = 'issued';
    await book.save();

    res.status(201).json({ message: 'Book issued', issue });
  } catch (err) {
    next(err);
  }
};

exports.returnValidators = [
  body('bookId').isMongoId(),
  body('studentId').optional().isMongoId(),
  body('studentEmail').optional().isEmail().normalizeEmail(),
  body().custom((value) => {
    if (!value.studentId && !value.studentEmail) {
      throw new Error('studentId or studentEmail is required');
    }
    return true;
  }),
];

exports.returnBook = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { studentId, studentEmail, bookId } = req.body;
    const student = studentId
      ? await User.findById(studentId)
      : await User.findOne({ email: studentEmail });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const issue = await Issue.findOne({ user: student._id, book: bookId, returned: false }).populate('book');
    if (!issue) return res.status(404).json({ message: 'Active issue not found' });

    issue.returned = true;
    issue.returnDate = new Date();
    await issue.save();

    const book = await Book.findById(bookId);
    if (book) {
      if (typeof book.availableCopies === 'number') {
        book.availableCopies += 1;
      }
      book.availability = 'available';
      await book.save();
    }

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
