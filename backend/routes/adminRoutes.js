const express = require('express');
const router = express.Router();

const Book = require('../models/Book');
const User = require('../models/User');
const Issue = require('../models/Issue');

const auth = require('../middlewares/Auth');
const adminOnly = require('../middlewares/adminOnly');

// GET /admin/stats
router.get('/stats', auth, adminOnly, async (req, res, next) => {
  try {
    const [totalBooks, totalStudents, booksIssued] = await Promise.all([
      Book.countDocuments(),
      User.countDocuments({ role: 'student' }),
      Issue.countDocuments({ returned: false }),
    ]);
    res.json({ totalBooks, totalStudents, booksIssued });
  } catch (err) {
    next(err);
  }
});

// POST /admin/register-user  (now hashes password)
router.post('/register-user', auth, adminOnly, async (req, res, next) => {
  try {
    const { name, email, password, role = 'student' } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'name, email, password required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const newUser = new User({ name, email, password, role }); // pre-save hook hashes
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', user: { id: newUser._id, name, email, role } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
