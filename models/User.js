const mongoose = require('mongoose'); // Import mongoose for MongoDB object modeling

// Define the user schema for the MongoDB collection
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true }, // Username must be unique and is required
    dateOfBirth: { type: Date, required: true, unique: true }, // Date of birth must be unique and is required
    email: { type: String, unique: true, required: true }, // Email must be unique and is required
});

// Create a User model based on the user schema
const User = mongoose.model('User', userSchema);

// Export the User model for use in other modules
module.exports = User;