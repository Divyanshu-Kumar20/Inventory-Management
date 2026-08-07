const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');
const sendEmail = require('../utils/email');

class AuthService {
  async registerUser(userData) {
    const { name, email, password, phone, role } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('User already exists with this email address', 400);
    }

    const user = await User.create({
      name,
      email,
      password,
      phone: phone || '+91 98765 43210',
      role: role || 'Employee'
    });

    const token = user.generateToken();

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt
      },
      token
    };
  }

  async loginUser(email, password) {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AppError('Invalid email or password credentials', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid email or password credentials', 401);
    }

    const token = user.generateToken();

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      token
    };
  }

  async forgotPassword(email) {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1h' });
    const resetLink = `${clientUrl}/login?resetToken=${resetToken}&email=${encodeURIComponent(email)}`;

    const html = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 550px; margin: 0 auto; padding: 30px; background-color: #070A11; color: #F9FAFB; border-radius: 12px; border: 1px solid #1E293B;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #6366F1; font-size: 24px; margin: 0;">Inventra Enterprise ERP</h1>
          <p style="color: #94A3B8; font-size: 14px; margin-top: 5px;">Secure Authentication Magic Link</p>
        </div>
        <div style="background-color: #0F172A; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin-top: 0;">Hello,</p>
          <p>We received a password reset request for your account: <strong style="color: #818CF8;">${email}</strong>.</p>
          <p>Click the button below to complete password verification and access your workspace:</p>
          <div style="text-align: center; margin: 25px 0;">
            <a href="${resetLink}" style="background: linear-gradient(135deg, #4F46E5 0%, #6366F1 100%); color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 4px 12px rgba(79,70,229,0.3);">
              🔐 Access Workspace / Reset Password
            </a>
          </div>
        </div>
        <p style="color: #64748B; font-size: 12px; text-align: center;">This magic link will expire in 60 minutes. If you did not request this email, no action is required.</p>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: '🔐 Inventra Enterprise ERP - Password Reset & Magic Link',
      html
    });

    return { message: `Password reset email sent to ${email}`, resetLink };
  }

  async getUserProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User profile not found', 404);
    }
    return user;
  }
}

module.exports = new AuthService();
