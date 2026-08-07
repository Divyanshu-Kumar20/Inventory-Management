const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json({
    success: true,
    message: 'User account registered successfully',
    data: result
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  res.status(200).json({
    success: true,
    message: 'Authenticated successfully',
    data: result
  });
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user?.id);
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;
  const result = await authService.refreshToken(token);
  res.status(200).json({
    success: true,
    data: result
  });
});

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
