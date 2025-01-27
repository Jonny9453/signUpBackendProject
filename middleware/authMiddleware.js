require('dotenv').config();
const jwt = require('jsonwebtoken');


function verifyToken(req, res, next) {
    const token = req.header("Authorization")?.replace("Bearer ", "");
if (!token) return res.status(401).json({ error: 'Access denied' });
try {
 const verified= jwt.verify(token, process.env.JWT_SECRET);
 req.verified = verified
 next();
 } catch (error) {
 res.status(401).json({ error: 'Invalid token' });
 }
 };

module.exports = verifyToken;