const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const User=require('../models/User')
// Protected route
router.get('/', verifyToken, (req, res) => {
    if (req.verified) {
        return res.status(200).json({verified:true});
    } else {
        // Access Denied
        return res.status(401).send('Access Denied');
    }

});

// const users = [
//     { email: 'mayanksharan11@gmail.com', data: 'Protected data for user@example.com' },
//     // Add more users as needed
//   ];

router.get('/user', async(req, res) => {
    const email = req.query.email; // Get the email from the query parameters
   console.log(email)
    // Find the user by email
    const user =await User.findOne({email});
  
    if (user) {
      res.json({ data: user}); // Send back the protected data
    } else {
      res.status(404).json({ error: 'User not found' }); // Handle user not found
    }
  });

module.exports = router;