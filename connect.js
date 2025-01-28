const mongoose = require('mongoose'); // Import mongoose for MongoDB object modeling

// Function to connect to the MongoDB database
const connectDB = async () => {
    try {
        // Attempt to connect to the MongoDB database using the connection link from environment variables
        await mongoose.connect(`${process.env.MONGODB_CONNECTION_LINK}`, {
            useNewUrlParser: true, // Use the new URL parser to avoid deprecation warnings
            useUnifiedTopology: true, // Use the new unified topology layer
        });
        console.log('Connected to MongoDB'); // Log a success message upon successful connection
    } catch (err) {
        // Log an error message if the connection fails
        console.error('Could not connect to MongoDB', err);
        process.exit(1); // Exit the process with a failure code
    }
}

// Export the connectDB function for use in other modules
module.exports = connectDB;