const { body, validationResult } = require('express-validator');
const Issue = require('../models/Issue');
const User = require('../models/User');
const Book = require('../models/Book');
const BookRequest = require('../models/BookRequest');
const sendEmail = require('../utils/emailSender');

const getAvailableCopies = (book) => (
  typeof book.availableCopies === 'number'
    ? book.availableCopies
    : book.availability === 'available'
      ? 1
      : 0
);

const getIssueUserFilter = (studentId) => [{ user: studentId }, { userId: studentId }];
const getIssueBookFilter = (bookId) => [{ book: bookId }, { bookId }];

const normalizeIssue = (issue) => {
  const plain = issue.toObject ? issue.toObject() : issue;
  return {
    ...plain,
    user: plain.user || plain.userId || null,
    book: plain.book || plain.bookId || null,
  };
};

const trySendEmail = async (payload) => {
  try {
    await sendEmail(payload);
    return null;
  } catch (error) {
    console.error('Email send failed:', error.message);
    return error.message;
  }
};

const markBookIssued = async (book) => {
  if (typeof book.availableCopies === 'number') {
    book.availableCopies = Math.max(0, book.availableCopies - 1);
  }
  book.availability = typeof book.availableCopies === 'number' && book.availableCopies > 0 ? 'available' : 'issued';
  await book.save();
};

const markBookReturned = async (book) => {
  if (typeof book.availableCopies === 'number') {
    book.availableCopies += 1;
  }
  book.availability = 'available';
  await book.save();
};

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

exports.requestValidators = [
  body('bookId').isMongoId(),
  body('note').optional().isString().trim().isLength({ max: 300 }),
];

exports.requestBook = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { bookId, note } = req.body;
    const [book, user, existingRequest, activeIssue] = await Promise.all([
      Book.findById(bookId),
      User.findById(req.user.id),
      BookRequest.findOne({ user: req.user.id, book: bookId, status: 'pending' }),
      Issue.findOne({
        $and: [
          { returned: false },
          { $or: getIssueUserFilter(req.user.id) },
          { $or: getIssueBookFilter(bookId) },
        ],
      }),
    ]);

    if (!user || user.role !== 'student') return res.status(403).json({ message: 'Student only' });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (existingRequest) return res.status(400).json({ message: 'A request for this book is already pending' });
    if (activeIssue) return res.status(400).json({ message: 'You already have this book issued' });

    const request = await BookRequest.create({
      user: req.user.id,
      book: bookId,
      note,
    });

    const populated = await BookRequest.findById(request._id)
      .populate('book')
      .populate('user', 'name email role');

    res.status(201).json({ message: 'Book request sent to admin', request: populated });
  } catch (err) {
    next(err);
  }
};

exports.listMyRequests = async (req, res, next) => {
  try {
    const requests = await BookRequest.find({ user: req.user.id })
      .populate('book')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    next(err);
  }
};

exports.listRequests = async (req, res, next) => {
  try {
    const requests = await BookRequest.find()
      .populate('book')
      .populate('user', 'name email')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    next(err);
  }
};

exports.listActiveIssues = async (req, res, next) => {
  try {
    const issues = await Issue.find({ returned: false })
      .populate('user', 'name email')
      .populate('userId', 'name email')
      .populate('book')
      .populate('bookId')
      .populate('issuedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(issues.map(normalizeIssue));
  } catch (err) {
    next(err);
  }
};

exports.approveRequestValidators = [
  body('days').optional().isInt({ min: 1, max: 60 }),
];

exports.approveRequest = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { days = 14 } = req.body;
    const request = await BookRequest.findById(req.params.id).populate('user').populate('book');
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.status !== 'pending') return res.status(400).json({ message: 'Request has already been processed' });

    const activeIssue = await Issue.findOne({
      $and: [
        { returned: false },
        { $or: getIssueUserFilter(request.user._id) },
        { $or: getIssueBookFilter(request.book._id) },
      ],
    });
    if (activeIssue) return res.status(400).json({ message: 'This book is already issued to the student' });

    const book = await Book.findById(request.book._id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (getAvailableCopies(book) <= 0) return res.status(400).json({ message: 'No copies available' });

    const dueDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    const issue = await Issue.create({
      user: request.user._id,
      userId: request.user._id,
      book: request.book._id,
      bookId: request.book._id,
      issuedBy: req.user.id,
      dueDate,
    });

    request.status = 'approved';
    request.reviewedBy = req.user.id;
    request.reviewedAt = new Date();
    await request.save();
    await markBookIssued(book);

    const emailError = request.user.email
      ? await trySendEmail({
          to: request.user.email,
          subject: `Book request approved: ${request.book.title}`,
          html: `
            <h3>Your book request has been approved</h3>
            <p>Hello ${request.user.name},</p>
            <p>Your request for <strong>${request.book.title}</strong> has been approved.</p>
            <p>Due date: <strong>${dueDate.toDateString()}</strong></p>
          `,
        })
      : null;

    res.json({
      message: emailError
        ? 'Request approved and book issued, but email could not be sent'
        : 'Request approved and book issued',
      issue,
      emailError,
    });
  } catch (err) {
    next(err);
  }
};

exports.rejectRequest = async (req, res, next) => {
  try {
    const request = await BookRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.status !== 'pending') return res.status(400).json({ message: 'Request has already been processed' });

    request.status = 'rejected';
    request.reviewedBy = req.user.id;
    request.reviewedAt = new Date();
    await request.save();

    res.json({ message: 'Request rejected' });
  } catch (err) {
    next(err);
  }
};

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
    if (getAvailableCopies(book) <= 0) return res.status(400).json({ message: 'No copies available' });

    const active = await Issue.findOne({
      $and: [
        { returned: false },
        { $or: getIssueUserFilter(student._id) },
        { $or: getIssueBookFilter(bookId) },
      ],
    });
    if (active) return res.status(400).json({ message: 'This book is already issued to this student' });

    const dueDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    const issue = await Issue.create({
      user: student._id,
      userId: student._id,
      book: bookId,
      bookId,
      issuedBy: req.user.id,
      dueDate,
    });

    await markBookIssued(book);
    await BookRequest.updateMany(
      { user: student._id, book: bookId, status: 'pending' },
      { status: 'approved', reviewedBy: req.user.id, reviewedAt: new Date() }
    );

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

    const issue = await Issue.findOne({
      $and: [
        { returned: false },
        { $or: getIssueUserFilter(student._id) },
        { $or: getIssueBookFilter(bookId) },
      ],
    }).populate('book').populate('bookId');

    if (!issue) return res.status(404).json({ message: 'Active issue not found' });

    issue.returned = true;
    issue.returnDate = new Date();
    await issue.save();

    const book = await Book.findById(bookId);
    if (book) {
      await markBookReturned(book);
    }

    let fine = 0;
    if (issue.returnDate > issue.dueDate) {
      const lateDays = Math.ceil((issue.returnDate - issue.dueDate) / (24 * 60 * 60 * 1000));
      fine = Math.max(0, lateDays * 2);
    }

    res.json({ message: 'Book returned', issue: normalizeIssue(issue), fine });
  } catch (err) {
    next(err);
  }
};

exports.sendAlert = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('user', 'name email')
      .populate('userId', 'name email')
      .populate('book')
      .populate('bookId');

    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    const normalized = normalizeIssue(issue);
    if (!normalized.user?.email) return res.status(400).json({ message: 'Student email not found' });

    const emailError = await trySendEmail({
      to: normalized.user.email,
      subject: `Book alert: ${normalized.book?.title || 'Borrowed book'}`,
      html: `
        <h3>Library alert</h3>
        <p>Hello ${normalized.user.name},</p>
        <p>This is a reminder regarding your issued book <strong>${normalized.book?.title || 'Book'}</strong>.</p>
        <p>Due date: <strong>${issue.dueDate ? new Date(issue.dueDate).toDateString() : 'Not available'}</strong></p>
        <p>Please take the required action as soon as possible.</p>
      `,
    });

    if (emailError) {
      return res.status(502).json({ message: 'Alert action reached the server, but email could not be sent', emailError });
    }

    res.json({ message: 'Alert email sent successfully' });
  } catch (err) {
    next(err);
  }
};
