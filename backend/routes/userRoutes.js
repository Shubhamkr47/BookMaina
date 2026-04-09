const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/Auth');
const adminOnly = require('../middlewares/adminOnly');
const Issue = require('../models/Issue');

router.get('/stats', auth, async (req, res) => {
  try {
    const booksBorrowed = await Issue.countDocuments({
      user: req.user.id
    });

    const booksReturned = await Issue.countDocuments({
      user: req.user.id,
      returned: true
    });

    res.json({ booksBorrowed, booksReturned });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch student stats' });
  }
});

router.post('/', auth, adminOnly, userController.createValidators, userController.createUser);
router.get('/', auth, adminOnly, userController.getUsers);
router.get('/:id', auth, userController.getUserById);
router.put('/:id', auth, userController.updateUser);
router.delete('/:id', auth, adminOnly, userController.deleteUser);

module.exports = router;
