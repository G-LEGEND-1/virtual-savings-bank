const express = require('express');
const router = express.Router();
const sgMail = require('@sendgrid/mail');

// Use environment variable - NOT hardcoded
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
    safeBoxBalance: 4000000.00
  }
];

const otpStore = new Map();

// Generate random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via SendGrid
const sendOTPEmail = async (userEmail, otp, userName) => {
  try {
    console.log(`📧 Attempting to send OTP to: ${userEmail}`);
    console.log(`   OTP: ${otp}`);
    console.log(`   From: info.virtualsavingsbank@gmail.com`);
    
    // If no SendGrid API key is set (local dev), just log it
    if (!process.env.SENDGRID_API_KEY || process.env.SENDGRID_API_KEY.includes('your_')) {
      console.log(`📧 [LOCAL] OTP for ${userName}: ${otp}`);
      console.log(`📧 [LOCAL] Would send to: ${userEmail}`);
      return false;
    }
    
    const msg = {
      to: userEmail, // Send to Yahoo email
      from: 'info.virtualsavingsbank@gmail.com',
      subject: `🔐 Your OTP - Virtual Savings Bank`,
      text: `Hello ${userName},\n\nYour OTP is: ${otp}\n\nThis OTP expires in 15 minutes.\n\nVirtual Savings Bank`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0066cc;">🏦 Virtual Savings Bank</h2>
          <h3>Your Login OTP</h3>
          <p>Hello ${userName},</p>
          <p>Your One-Time Password for login is:</p>
          <div style="background: #f0f8ff; padding: 20px; text-align: center; margin: 20px 0; border-radius: 10px;">
            <div style="font-size: 32px; font-weight: bold; color: #0066cc; letter-spacing: 5px;">
              ${otp}
            </div>
          </div>
          <p><strong>Expires:</strong> 15 minutes</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `
    };
    
    await sgMail.send(msg);
    console.log(`✅ OTP sent successfully to ${userEmail}`);
    return true;
    
  } catch (error) {
    console.error('❌ SendGrid error:', error.message);
    console.log(`📧 [FALLBACK] OTP for ${userName}: ${otp}`);
    return false;
  }
};

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log(`\n🔐 LOGIN ATTEMPT: ${email}`);
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    const otp = generateOTP();
    otpStore.set(email, {
      otp: otp,
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
      user: user
    });
    
    console.log(`🔢 Generated OTP: ${otp}`);
    
    // Try to send via SendGrid
    const emailSent = await sendOTPEmail(email, otp, user.fullName);
    
    return res.json({
      success: true,
      message: emailSent ? 'OTP sent to your email' : 'OTP generated',
      otp: otp, // Always include OTP in response as fallback
      note: emailSent ? `Check ${email} for OTP` : 'Copy this OTP to verify',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        accountNumber: user.accountNumber
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Verify OTP
router.post('/verify-otp', (req, res) => {
  try {
    const { email, otp } = req.body;
    
    console.log(`\n🔍 OTP VERIFICATION: ${email}`);
    
    const stored = otpStore.get(email);
    
    if (!stored) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found. Please login again.'
      });
    }
    
    if (stored.expiresAt < Date.now()) {
      otpStore.delete(email);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please login again.'
      });
    }
    
    if (stored.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please try again.'
      });
    }
    
    otpStore.delete(email);
    
    console.log(`✅ Login successful: ${stored.user.fullName}`);
    
    return res.json({
      success: true,
      message: 'Login successful!',
      user: stored.user
    });
    
  } catch (error) {
    console.error('OTP verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
