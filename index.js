// Load environment variables from a .env file into process.env
require('dotenv').config();

// Import necessary modules
const express = require('express'); // Import Express framework
const cors = require('cors'); // Import CORS middleware for handling cross-origin requests
const connectDB = require('./connect.js'); // Import database connection function
const authRoutes = require('./routes/auth'); // Import authentication routes
const protectedRoute = require('./routes/protectedRoute.js'); // Import protected routes


// Initialize the Express application
const app = express();

// Connect to the database
connectDB();

// Use CORS middleware to allow cross-origin requests
app.use(cors({
  origin: '*', // Allow requests from any origin
  methods: 'GET,POST,PUT,DELETE,OPTIONS', // Allow specified HTTP methods
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization' // Allow specified headers
}));

// Middleware to parse JSON request bodies
app.use(express.json());

// Set up routes
app.use('/', authRoutes); // Use authentication routes for the root path



// Use protected routes for the '/protected' path
app.use('/protected', protectedRoute);

// Set the port for the server to listen on
const PORT = process.env.PORT || 3000; // Use the port from environment variables or default to 3000

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // Log a message indicating the server is running
});