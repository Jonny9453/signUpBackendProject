require('dotenv').config(); // Load environment variables from a .env file
const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library for handling JWTs

// Middleware function to verify the JWT token
function verifyToken(req, res, next) {
    // Retrieve the token from the Authorization header and remove the "Bearer " prefix
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    // If no token is provided, respond with a 401 Unauthorized status
    if (!token) return res.status(401).json({ error: 'Access denied' });
    
    try {
        // Verify the token using the secret key from environment variables
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.verified = verified; // Attach the verified token data to the request object
        next(); // Call the next middleware or route handler
    } catch (error) {
        // If token verification fails, respond with a 401 Unauthorized status
        res.status(401).json({ error: 'Invalid token' });
    }
}

// Export the verifyToken middleware for use in other modules
module.exports = verifyToken;