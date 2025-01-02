require('dotenv').config()
const mongoose = require('mongoose');

// MongoDB Connection URL
const mongoURI = process.env.dbUrl

// Function to initialize the connection
function connectDB() {
    mongoose.connect(mongoURI)
        .then(() => console.log('Connected to MongoDB'))
        .catch((err) => console.error('MongoDB connection error:', err));
}

module.exports = { connectDB };
