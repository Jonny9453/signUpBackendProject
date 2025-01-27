require('dotenv').config();
const express = require('express');
 const router = express.Router();
 const User = require('../models/User');
 const nodemailer = require('nodemailer');
//  const bcrypt = require('bcrypt');
 const jwt = require('jsonwebtoken');
 
 // Use environment variables
const JWT_SECRET = process.env.JWT_SECRET;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;


const otpStore = new Map();

// Configure nodemailer with Gmail
const transporter = nodemailer.createTransport({
  service:'gmail',
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000, // 10 seconds
  socketTimeout: 10000, // 10 seconds
});


 

// Email template for OTP
const createEmailTemplate = (otp) => {
    return `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4285f4;">HD Sign Up Verification</h2>
        <p>Thank you for signing up! Please use the following OTP to verify your account:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
          <h1 style="color: #333; letter-spacing: 5px; margin: 0;">${otp}</h1>
        </div>
        <p>This OTP will expire in 10 minutes.</p>
        <p style="color: #666; font-size: 12px;">If you didn't request this, please ignore this email.</p>
      </div>
    `;
  };

 // Generate OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  router.get('/',(req,res)=>{
    res.json("mayank")
  })
// User registration
 router.post('/register', async (req, res) => {
 
 const { username, email, dateOfBirth } = req.body;
 if (!username || !email || !dateOfBirth) {
    return res.status(400).json({ error: 'All fields are required' });
  }

 try {
    const otp = generateOTP();
   
    // Store OTP with timestamp
    otpStore.set(email, {
        otp,
        timestamp: Date.now(),
        userData: { username, email, dateOfBirth }
      });
      console.log(otpStore)
      // Send OTP via email
    const mailOptions = {
        from: `"HD Sign Up" <sharanmayank5@gmail.com>`,
        to: email,
        subject: 'Verify Your HD Account',
        text:"Hello", 
        html: createEmailTemplate(otp)
      };

      await transporter.sendMail(mailOptions);
      res.json({ message: 'OTP sent successfully' });

      // Set OTP expiration
    setTimeout(() => {
        if (otpStore.has(email)) {
          otpStore.delete(email);
        }
      }, 600000); // 10 minutes
 } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ error: 'Failed to send OTP. Please try again later.' });
 }

 
 
 });


 // Verify OTP endpoint
router.post('/registration/verify', async(req, res) => {
    try{
    const { username, dateOfBirth, email, otp } = req.body;
    console.log(req.body)
  const storedData = otpStore.get(email);
  if (!storedData) {
    return res.status(400).json({ error: 'OTP expired or not found. Please request a new one.' });
  }
   // Check if OTP is expired (10 minutes)
   if (Date.now() - storedData.timestamp > 600000) {
    otpStore.delete(email);
    return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
  }

  if (storedData.otp !== otp) {
    return res.status(400).json({ error: 'Invalid OTP' });
  }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ error: 'User already exists with this email' });
    }
    const user = new User({ username, email, dateOfBirth });
 
    await user.save();
   // Generate JWT token
   const token = jwt.sign(storedData.userData, JWT_SECRET, { expiresIn: '24h' });
   // Clear OTP from store
  otpStore.delete(email);
  res.json({ 
    token, 
    user: storedData.userData,
    message: 'Account verified successfully'
  });
  
} catch (error) {
  console.error('Registration error:', error)
    res.status(500).json({ error: 'Registration failed' });
    }
})


//User login
 router.post('/login', async (req, res) => {
 
 const { email } = req.body;
 const user = await User.findOne({ email });
 if (!user) {
 return res.status(401).json({ error: 'Authentication failed' });
 }
 try {
  const otp = generateOTP();
 
  // Store OTP with timestamp
  otpStore.set(email, {
      otp,
      timestamp: Date.now(),
      userData: { email}
    });
    console.log(otpStore)
    // Send OTP via email
  const mailOptions = {
      from: `"HD Sign Up" <mary.ebert@ethereal.email>`,
      to: "mayanksharan11@gmail.com",
      subject: 'Verify Your HD Account',
      text:"Hello", 
      html: createEmailTemplate(otp)
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'OTP sent successfully' });

    // Set OTP expiration
  setTimeout(() => {
      if (otpStore.has(email)) {
        otpStore.delete(email);
      }
    }, 600000); // 10 minutes
} catch (error) {
  console.error('Email sending error:', error);
  res.status(500).json({ error: 'Failed to send OTP. Please try again later.' });
}
 });

  // Verify OTP endpoint
router.post('/login/verify', async(req, res) => {
  try{
  const {  email, otp } = req.body;
  console.log(req.body)
const storedData = otpStore.get(email);
if (!storedData) {
  return res.status(400).json({ error: 'OTP expired or not found. Please request a new one.' });
}
 // Check if OTP is expired (10 minutes)
 if (Date.now() - storedData.timestamp > 600000) {
  otpStore.delete(email);
  return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
}

if (storedData.otp !== otp) {
  return res.status(400).json({ error: 'Invalid OTP' });
}
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
      return res.status(400).json({ error: 'User does not exit' });
  }
  
 // Generate JWT token
 const token = jwt.sign(storedData.userData, JWT_SECRET, { expiresIn: '24h' });
 // Clear OTP from store
otpStore.delete(email);
res.json({ 
  token, 
  user: storedData.userData,
  message: 'Account verified successfully'
});

} catch (error) {
console.error('Registration error:', error)
  res.status(500).json({ error: 'Registration failed' });
  }
})


module.exports = router;