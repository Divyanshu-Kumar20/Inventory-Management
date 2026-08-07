const mongoose = require('mongoose');

/**
 * Connects to MongoDB (Local or MongoDB Atlas Cluster)
 * Includes connection pooling, event listeners, and graceful shutdown.
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/inventra_db';

    // Connection Options for Performance & Pooling
    const options = {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4 // Use IPv4, skip trying IPv6
    };

    // Mongoose Event Listeners
    mongoose.connection.on('connected', () => {
      console.log(`[Database Event] Mongoose connected to DB Cluster`);
    });

    mongoose.connection.on('error', (err) => {
      console.error(`[Database Event Error] Mongoose connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn(`[Database Event Warning] Mongoose disconnected from DB Cluster`);
    });

    const conn = await mongoose.connect(mongoURI, options);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host} / Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] Connection failed: ${error.message}`);
    console.log('[Database Notice] Running in Memory / Development Mode until local or MongoDB Atlas service connects.');
  }
};

/**
 * Graceful Shutdown Handler to cleanly close Mongoose connections
 */
const closeDB = async (signal) => {
  try {
    await mongoose.connection.close();
    console.log(`[Database Shutdown] Mongoose connection closed due to app termination (${signal})`);
  } catch (err) {
    console.error(`[Database Shutdown Error] Error closing connection: ${err.message}`);
  }
};

module.exports = { connectDB, closeDB };
