const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');

const registerUser = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body);
  res.status(201).json({
    success: true,
    message: 'User account registered successfully',
    data: result
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser(email, password);
  res.status(200).json({
    success: true,
    message: 'Authentication successful',
    data: result
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await authService.forgotPassword(email);
  res.status(200).json({
    success: true,
    message: result.message,
    data: result
  });
});

const logoutUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User logged out successfully'
  });
});

const refreshToken = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Token refreshed successfully'
  });
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await authService.getUserProfile(req.user.id);
  res.status(200).json({
    success: true,
    data: user
  });
});

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  logoutUser,
  refreshToken,
  getUserProfile
};
