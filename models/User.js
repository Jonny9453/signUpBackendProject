const mongoose = require('mongoose'); // Import mongoose for MongoDB object modeling

// Define the user schema for the MongoDB collection
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true }, // Username must be unique and is required
    dateOfBirth: { type: Date, required: true, unique: true }, // Date of birth must be unique and is required
    email: { type: String, unique: true, required: true }, // Email must be unique and is required
    notes: { type: [Object], default: {} },
});

const eventSchema = new mongoose.Schema({
    emails:{ type: String, required: true },
    title: { type: String, required: true },
    description: String,
    date: { type: Date, required: true },
    attendees: [{ type: String, ref: 'User' }],
    // location: String,
    // category: String,
    // owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    // createdAt: { type: Date, default: Date.now }
  });


// Create a User model based on the user schema
const User = mongoose.model('User', userSchema);

const Event = mongoose.model('Event', eventSchema);
// Export the User model for use in other modules
module.exports = {User, Event};