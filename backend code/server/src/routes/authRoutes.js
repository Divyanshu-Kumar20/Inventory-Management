const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  forgotPassword,
  logoutUser,
  refreshToken,
  getUserProfile
} = require('../controllers/authController');
const { authenticateUser } = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../validators');

router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/logout', logoutUser);
router.post('/refresh-token', refreshToken);
router.get('/profile', authenticateUser, getUserProfile);

module.exports = router;
