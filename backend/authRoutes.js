const express = require('express');
const router = express.Router();
const sgMail = require('@sendgrid/mail');

// Configure SendGrid from environment variable
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Users
const users = [
  {
    id: 1,
    email: 'fanshawmarkk@yahoo.com',
    password: 'Fanshawsadday1956',
    role: 'user',
    fullName: 'Mark Jackson Fanshaw',
    accountNumber: 'VSB20240012345',
    totalBalance: 4000010.09,
    safeBoxBalance: 4000010.09
  }
];

const otpStore = new Map();
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP via SendGrid
const sendOTPEmail = async (userEmail, otp, userName) => {
  try {
    if (!process.env.SENDGRID_API_KEY || process.env.SENDGRID_API_KEY === 'placeholder_key_here') {
      console.log('📧 SendGrid not configured, showing OTP in console');
      console.log(`OTP for ${userName}: ${otp}`);
      return false;
    }
    
    const msg = {
      to: userEmail,
      from: 'info.virtualsavingsbank@gmail.com',
      subject: `OTP for ${userName}`,
      text: `Your OTP is: ${otp}`,
      html: `<strong>Your OTP is: ${otp}</strong>`
    };
    
    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.log('📧 SendGrid failed, showing OTP');
    console.log(`OTP for ${userName}: ${otp}`);
    return false;
  }
};

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const otp = generateOTP();
    otpStore.set(email, {
      otp: otp,
      expiresAt: Date.now() + 15 * 60 * 1000,
      user: user
    });
    
    const emailSent = await sendOTPEmail(email, otp, user.fullName);
    
    return res.json({
      success: true,
      message: emailSent ? 'OTP sent to email' : 'OTP generated',
      otp: otp,
      user: user
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Other endpoints...
module.exports = router;
