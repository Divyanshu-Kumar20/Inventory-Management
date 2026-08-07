const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Register new enterprise user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json({
    success: true,
    message: 'User account registered successfully',
    data: result
  });
});

// @desc    Authenticate user & return JWT token
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  res.status(200).json({
    success: true,
    message: 'Authenticated successfully',
    data: result
  });
});

// @desc    Logout user / clear token session
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user?.id);
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

// @desc    Issue new Access Token using Refresh Token
// @route   POST /api/auth/refresh-token
// @access  Public
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;
  const result = await authService.refreshToken(token);
  res.status(200).json({
    success: true,
    data: result
  });
});

// @desc    Get current authenticated user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user.id || req.user._id);
  res.status(200).json({
    success: true,
    data: user || req.user
  });
});

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  getProfile
};
