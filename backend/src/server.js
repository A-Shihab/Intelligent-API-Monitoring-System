const dotenv = require('dotenv');
const connectDB = require('./config/database');
const app = require('./app'); // Import app from app.js

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});