const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const logger = require('./src/utils/logger');
const apiRoutes = require('./src/routes');
const errorHandler = require('./src/middleware/errorHandler');

// Initialize Express Application Instance
const app = express();

// Security HTTP Headers Middleware
app.use(helmet());

// Cross-Origin Resource Sharing (CORS) Configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://127.0.0.1:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parsers (JSON & URL-Encoded Form Payloads)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// HTTP Request Logging Middleware (Morgan streaming into Winston Logger)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms', { stream: logger.stream }));

// Static Assets / Uploads Route
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

// Health Check & Root Welcome Endpoints
app.get('/', (req, res) => {
  logger.info('Root endpoint accessed');
  res.json({
    status: 'success',
    message: 'Inventra Enterprise SaaS ERP Backend API v1.0',
    documentation: '/api/health',
    timestamp: new Date().toISOString()
  });
});

// Mount Central API Routes (/api)
app.use('/api', apiRoutes);

// Catch-All 404 Route Handler
app.use((req, res, next) => {
  const error = new Error(`Route Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Global Error Handler Middleware
app.use(errorHandler);

module.exports = app;
