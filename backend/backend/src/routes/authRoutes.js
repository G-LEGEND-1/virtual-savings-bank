const express = require('express');
const router = express.Router();
const users = require('../data/users');

// In-memory OTP store
const otpStore = new Map();
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Mask email for display
const maskEmail = (email) => {
  const [localPart, domain] = email.split('@');
  if (localPart.length <= 2) {
    return `${localPart[0]}***@${domain}`;
  }
  return `${localPart[0]}${'*'.repeat(localPart.length - 2)}${localPart.slice(-1)}@${domain}`;
};

// Login endpoint
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log(`🔐 Login attempt: ${email}`);
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    console.log(`✅ User authenticated: ${user.fullName} (${user.role})`);
    
    // ADMIN: Login directly (no OTP needed)
    if (user.role === 'admin') {
      return res.json({
        success: true,
        message: 'Admin login successful',
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          fullName: user.fullName
        }
      });
    }
    
    // USER: Generate OTP
    const otp = generateOTP();
    otpStore.set(email, {
      otp: otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      user: user
    });
    
    const maskedEmail = maskEmail(email);
    
    console.log(`🔢 OTP for ${email}: ${otp}`);
    console.log(`📧 Masked: ${maskedEmail}`);
    
    res.json({
      success: true,
      message: 'OTP sent successfully',
      otp: otp, // For testing - shown in alert
      maskedEmail: maskedEmail,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Verify OTP
router.post('/verify-otp', (req, res) => {
  try {
    const { email, otp } = req.body;
    
    console.log(`🔍 OTP verification: ${email}`);
    
    const stored = otpStore.get(email);
    
    if (!stored) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found. Please request a new one.'
      });
    }
    
    if (stored.expiresAt < Date.now()) {
      otpStore.delete(email);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }
    
    if (stored.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please try again.'
      });
    }
    
    // OTP verified successfully
    otpStore.delete(email);
    const user = stored.user;
    
    console.log(`✅ OTP verified for: ${user.fullName}`);
    
    res.json({
      success: true,
      message: 'Login successful!',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        accountNumber: user.accountNumber,
        totalBalance: user.totalBalance,
        safeBoxBalance: user.safeBoxBalance
      }
    });
    
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = router;
