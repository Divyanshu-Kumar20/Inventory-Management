const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/inventra_db';

    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    };

    const conn = await mongoose.connect(mongoURI, options);
    isConnected = conn.connections[0].readyState;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] ${error.message}`);
  }
};

const closeDB = async (signal) => {
  try {
    await mongoose.connection.close();
    isConnected = false;
  } catch (err) {
    console.error(`[Database Shutdown Error] ${err.message}`);
  }
};

module.exports = { connectDB, closeDB };
