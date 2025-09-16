const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/Auth');
const adminOnly = require('../middlewares/adminOnly');
const Issue = require('../models/Issue'); // ✅ Make sure this matches your file name exactly

// ✅ Student dashboard stats route must come before `/:id`
router.get('/stats', auth, async (req, res) => {
  try {
    const booksBorrowed = await Issue.countDocuments({
      userId: req.user.id
    });

    const booksReturned = await Issue.countDocuments({
      userId: req.user.id,
      returned: true
    });

    res.json({ booksBorrowed, booksReturned });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch student stats' });
  }
});

// Admin manage users; users may view/update themselves
router.post('/', auth, adminOnly, userController.createValidators, userController.createUser);
router.get('/', auth, adminOnly, userController.getUsers);
router.get('/:id', auth, userController.getUserById);
router.put('/:id', auth, userController.updateUser);
router.delete('/:id', auth, adminOnly, userController.deleteUser);

module.exports = router;
