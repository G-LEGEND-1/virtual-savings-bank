const express = require('express');
const router = express.Router();

// Users
const users = [
  {
    id: 0,
    email: 'admin@virtualbank.com',
    password: 'admin123',
    role: 'admin',
    fullName: 'System Administrator'
  },
  {
    id: 1,
    email: 'fanshawmarkk@yahoo.com',
    password: 'Fanshawsadday1956',
    role: 'user',
    fullName: 'Mark Jackson Fanshaw',
    accountNumber: 'VSB20240012345',
    totalBalance: 4000000.00,
    safeBoxBalance: 4000000.00
  },
  {
    id: 2,
    email: 'ttina6568@gmail.com',
    password: 'Fanshawsadday1956',
    role: 'user',
    fullName: 'Mark Jackson Fanshaw',
    accountNumber: 'VSB20240012345',
    totalBalance: 4000000.00,
    safeBoxBalance: 4000000.00
  }
];

// Your predefined OTPs that rotate
const predefinedOTPs = ['223446', '268157', '688957', '676855'];
let currentOTPIndex = 0;
const otpStore = new Map();

const maskEmail = (email) => {
  const [localPart, domain] = email.split('@');
  if (localPart.length <= 2) return `${localPart[0]}***@${domain}`;
  return `${localPart[0]}${'*'.repeat(localPart.length - 2)}${localPart.slice(-1)}@${domain}`;
};

// Get next OTP from your predefined list
const getNextOTP = () => {
  const otp = predefinedOTPs[currentOTPIndex];
  currentOTPIndex = (currentOTPIndex + 1) % predefinedOTPs.length; // Rotate
  return otp;
};

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log(`\n🔐 LOGIN ATTEMPT:`);
    console.log(`   User: ${email}`);
    console.log(`   Time: ${new Date().toLocaleString()}`);
    
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    
    if (!user) {
      console.log(`❌ Invalid credentials`);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    console.log(`✅ User authenticated: ${user.fullName}`);
    
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
    
    // Get next OTP from your predefined list
    const otp = getNextOTP();
    
    // Store OTP with 15 minute expiration
    otpStore.set(email, {
      otp: otp,
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
      user: user
    });
    
    const masked = maskEmail(email);
    
    console.log(`🔢 Using predefined OTP: ${otp}`);
    console.log(`📋 Next OTP will be: ${predefinedOTPs[currentOTPIndex]}`);
    console.log(`📊 OTP rotation: ${currentOTPIndex}/${predefinedOTPs.length}`);
    
    // No email sending - just return OTP
    return res.json({
      success: true,
      message: 'Use this OTP to login:',
      otp: otp,
      note: `Copy this OTP: ${otp}`,
      maskedEmail: masked,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName
      }
    });
    
  } catch (error) {
    console.error('❌ Login error:', error);
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
    
    console.log(`\n🔍 OTP VERIFICATION:`);
    console.log(`   User: ${email}`);
    console.log(`   Provided OTP: ${otp}`);
    console.log(`   Time: ${new Date().toLocaleString()}`);
    
    const stored = otpStore.get(email);
    
    if (!stored) {
      console.log(`❌ No OTP found for this user`);
      return res.status(400).json({
        success: false,
        message: 'No OTP found. Please login again.'
      });
    }
    
    console.log(`📝 Stored OTP: ${stored.otp}`);
    console.log(`⏰ Expires: ${new Date(stored.expiresAt).toLocaleTimeString()}`);
    
    if (stored.expiresAt < Date.now()) {
      otpStore.delete(email);
      console.log(`❌ OTP expired`);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please login again.'
      });
    }
    
    if (stored.otp !== otp) {
      console.log(`❌ OTP mismatch`);
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please try again.'
      });
    }
    
    otpStore.delete(email);
    const user = stored.user;
    
    console.log(`✅ OTP verified successfully!`);
    console.log(`   Logging in: ${user.fullName}`);
    console.log(`   Account: ${user.accountNumber}`);
    console.log(`   Balance: $${user.totalBalance.toLocaleString()}`);
    
    res.json({
      success: true,
      message: 'Login successful! Welcome to Virtual Savings Bank.',
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
    console.error('❌ OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Resend OTP - returns next OTP in rotation
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    
    console.log(`\n🔄 RESEND OTP REQUEST:`);
    console.log(`   User: ${email}`);
    
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const otp = getNextOTP();
    otpStore.set(email, {
      otp: otp,
      expiresAt: Date.now() + 15 * 60 * 1000,
      user: user
    });
    
    const masked = maskEmail(email);
    
    console.log(`🔢 New OTP: ${otp}`);
    console.log(`📋 Next OTP will be: ${predefinedOTPs[currentOTPIndex]}`);
    
    res.json({
      success: true,
      message: 'New OTP generated',
      otp: otp,
      note: `Copy this OTP: ${otp}`,
      maskedEmail: masked
    });
    
  } catch (error) {
    console.error('❌ Resend error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get current OTP rotation status
router.get('/otp-status', (req, res) => {
  res.json({
    success: true,
    predefinedOTPs: predefinedOTPs,
    currentIndex: currentOTPIndex,
    nextOTP: predefinedOTPs[currentOTPIndex],
    totalOTPs: predefinedOTPs.length
  });
});

// Logout
router.post('/logout', (req, res) => {
  console.log(`👤 User logged out`);
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = router;
