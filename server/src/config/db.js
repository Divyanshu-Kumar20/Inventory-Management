const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/inventra_db';

    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    };

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

const closeDB = async (signal) => {
  try {
    await mongoose.connection.close();
    console.log(`[Database Shutdown] Mongoose connection closed due to app termination (${signal})`);
  } catch (err) {
    console.error(`[Database Shutdown Error] Error closing connection: ${err.message}`);
  }
};

module.exports = { connectDB, closeDB };
