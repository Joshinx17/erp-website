const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`MongoDB unavailable: ${error.message}`);
    console.warn('API routes that require persistence will be unavailable. Start MongoDB or set MONGODB_URI to use the backend.');
    return false;
  }
};

module.exports = connectDB;
