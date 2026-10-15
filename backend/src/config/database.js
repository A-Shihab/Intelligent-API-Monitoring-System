const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Increase timeout to 10 seconds to allow Atlas a stable handshake
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1); // Fail fast so you know if credentials/network are wrong instead of silently losing data
  }
};

module.exports = connectDB;