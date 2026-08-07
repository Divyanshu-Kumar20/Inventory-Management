const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');

class AuthService {
  async register(userData) {
    const { name, email, password, role } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('An account with this email already exists', 400);
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'Inventory Manager'
    });

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      },
      accessToken,
      refreshToken
    };
  }

  async login(email, password) {
    if (!email || !password) {
      throw new AppError('Please provide both email and password', 400);
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AppError('Invalid email or password credentials', 401);
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new AppError('Invalid email or password credentials', 401);
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      },
      accessToken,
      refreshToken
    };
  }

  async logout(userId) {
    if (userId) {
      await User.findByIdAndUpdate(userId, { refreshToken: '' });
    }
    return { success: true, message: 'Logged out successfully' };
  }

  async refreshToken(token) {
    if (!token) {
      throw new AppError('Refresh Token is required', 400);
    }

    const user = await User.findOne({ refreshToken: token });
    if (!user) {
      throw new AppError('Invalid or revoked Refresh Token', 401);
    }

    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  }

  async getProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User profile not found', 404);
    }
    return user;
  }
}

module.exports = new AuthService();
