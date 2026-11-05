const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tripsync';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.error(`[Database Error] Standard connection to ${uri} failed: ${err.message}`);
    console.warn('[Database] Running in disconnected/fallback mode if MongoDB is temporarily unavailable.');
    return null;
  }
};

module.exports = connectDB;
