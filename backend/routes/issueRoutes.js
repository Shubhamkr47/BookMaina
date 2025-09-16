const express = require('express');
const router = express.Router();
const { issueBook, returnBook, issueValidators, returnValidators } = require('../controllers/issueController');
const auth = require('../middlewares/Auth');
const adminOnly = require('../middlewares/adminOnly');

// Admin issues and processes returns
router.post('/issue', auth, adminOnly, issueValidators, issueBook);
router.post('/return', auth, adminOnly, returnValidators, returnBook);

module.exports = router;
