const dotenv = require('dotenv');
const path = require('path');

// Ensure dotenv loads environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

const config = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/inventra_db',
  JWT_SECRET: process.env.JWT_SECRET || 'inventra_enterprise_super_secret_jwt_key_2026_production_grade',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CLIENT_URL: process.env.CLIENT_URL || process.env.CORS_ORIGIN || 'http://127.0.0.1:5173'
};

// Validate Critical Environment Variables
const validateEnv = () => {
  const missing = [];
  if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
    missing.push('JWT_SECRET');
  }
  if (missing.length > 0) {
    console.warn(`[Environment Warning] Missing critical variables in production: ${missing.join(', ')}`);
  }
};

validateEnv();

module.exports = config;
