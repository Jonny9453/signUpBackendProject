const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
// Protected route
router.get('/', verifyToken, (req, res) => {
    if (req.verified) {
        return res.status(200).json({verified:true});
    } else {
        // Access Denied
        return res.status(401).send('Access Denied');
    }

});

module.exports = router;