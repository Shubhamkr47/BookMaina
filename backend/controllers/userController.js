const { body, validationResult } = require('express-validator');
const User = require('../models/User');

exports.createValidators = [
  body('name').trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').optional().isIn(['admin', 'student']),
];

exports.createUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password, role = 'student' } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const user = new User({ name, email, password, role });
    await user.save();

    res.status(201).json({ message: 'User created', user: { id: user._id, name, email, role } });
  } catch (err) {
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const u = await User.findById(req.params.id).select('-password');
    if (!u) return res.status(404).json({ message: 'User not found' });
    // Only admin or the user themself
    if (req.user.role !== 'admin' && req.user.id !== String(u._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(u);
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { name, role } = req.body;
    const targetId = req.params.id;

    // Only admin or self (but only admin may change role)
    if (req.user.role !== 'admin' && req.user.id !== targetId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const user = await User.findById(targetId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name !== undefined) user.name = name;
    if (role !== undefined) {
      if (req.user.role !== 'admin') return res.status(403).json({ message: 'Only admin can change role' });
      user.role = role;
    }

    await user.save();
    res.json({ message: 'Updated', user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    // Admin only
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
    const u = await User.findByIdAndDelete(req.params.id);
    if (!u) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};
