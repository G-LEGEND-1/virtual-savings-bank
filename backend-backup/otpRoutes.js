const express = require('express');
const router = express.Router();
const { sendOTPEmail } = require('../services/emailService');

const otpStore = new Map();

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const maskEmail = (email) => {
  const [localPart, domain] = email.split('@');
  return localPart.slice(0, 2) + '*****' + localPart.slice(-1) + '@' + domain;
};

router.post('/send', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password required'
      });
    }
    
    const validUsers = [
      { email: 'admin@virtualbank.com', password: 'admin123', name: 'Administrator', role: 'admin' },
      { email: 'fanshawmarkk@yahoo.com', password: 'Fanshawsadday1956', name: 'Mark Jackson Fanshaw', role: 'user' }
    ];
    
    const user = validUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // ADMIN: Skip OTP
    if (user.role === 'admin') {
      return res.json({
        success: true,
        message: 'Admin login successful',
        user: { email: user.email, name: user.name, role: user.role }
      });
    }
    
    // USER: Send OTP
    const otp = generateOTP();
    otpStore.set(email, { otp, expiresAt: Date.now() + 600000 });
    
    console.log(\`OTP for \${email}: \${otp}\`);
    
    const emailResult = await sendOTPEmail(email, otp);
    
    if (!emailResult.success) {
      return res.json({
        success: true,
        message: 'OTP generated (email failed)',
        maskedEmail: maskEmail(email),
        note: \`Check backend terminal for OTP: \${otp}\`
      });
    }
    
    res.json({
      success: true,
      message: 'OTP sent to your email',
      maskedEmail: maskEmail(email),
      note: 'Check your email inbox'
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/verify', (req, res) => {
  try {
    const { email, otp } = req.body;
    
    const stored = otpStore.get(email);
    
    if (!stored) {
      return res.status(400).json({ success: false, message: 'No OTP found' });
    }
    
    if (stored.expiresAt < Date.now()) {
      otpStore.delete(email);
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }
    
    if (stored.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
    
    otpStore.delete(email);
    
    const validUsers = [
      { email: 'admin@virtualbank.com', name: 'Administrator', role: 'admin' },
      { email: 'fanshawmarkk@yahoo.com', name: 'Mark Jackson Fanshaw', role: 'user' }
    ];
    
    const user = validUsers.find(u => u.email === email);
    
    res.json({
      success: true,
      message: 'Login successful',
      user: { email: user.email, name: user.name, role: user.role }
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
