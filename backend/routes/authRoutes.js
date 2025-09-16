const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middlewares/Auth');

router.post('/login', authController.loginValidators, authController.login);
router.post('/register', authController.registerValidators, authController.register);
router.get('/me', auth, authController.me);

module.exports = router;
