const dotenv = require('dotenv');

dotenv.config();

const app = require('./app');
const { connectDB, closeDB } = require('./src/config/db');
const logger = require('./src/utils/logger');

connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`==================================================`);
  logger.info(` 🚀 Inventra ERP Server running on port ${PORT}`);
  logger.info(` 🌐 Local API Base URL: http://localhost:${PORT}`);
  logger.info(` 🛠️  Environment Mode: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`==================================================`);
});

process.on('unhandledRejection', (err, promise) => {
  logger.error(`[Unhandled Rejection Error] ${err.message}`, { stack: err.stack });
});

const gracefulShutdown = async (signal) => {
  logger.warn(`Received ${signal}. Initiating Graceful Shutdown...`);
  server.close(async () => {
    logger.info('Express HTTP server stopped accepting new connections.');
    await closeDB(signal);
    process.exit(0);
  });
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

module.exports = server;
