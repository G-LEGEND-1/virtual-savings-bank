const express = require('express');
const router = express.Router();
const { sendOTPEmail } = require('../services/emailService');

const otpStore = new Map();

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

router.post('/send', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log(`\n=== LOGIN REQUEST ===`);
    console.log(`📧 Email: ${email}`);
    
    // Valid users
    const validUsers = [
      { email: 'admin@virtualbank.com', password: 'admin123', name: 'Administrator', role: 'admin' },
      { email: 'fanshawmarkk@yahoo.com', password: 'Fanshawsadday1956', name: 'Mark Jackson Fanshaw', role: 'user' }
    ];
    
    const user = validUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      console.log('❌ Invalid credentials');
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    console.log(`✅ User authenticated: ${user.name} (${user.role})`);
    
    // ADMIN: No OTP needed
    if (user.role === 'admin') {
      console.log('👑 Admin login - direct access');
      return res.json({
        success: true,
        message: 'Admin login successful',
        user: user
      });
    }
    
    // USER: Generate OTP
    const otp = generateOTP();
    otpStore.set(email, {
      otp: otp,
      expiresAt: Date.now() + 10 * 60 * 1000
    });
    
    console.log(`🔢 Generated OTP: ${otp}`);
    
    // Try to send email
    const emailResult = await sendOTPEmail(email, otp);
    
    // Build response
    const response = {
      success: true,
      message: 'OTP generated successfully',
      maskedEmail: email.replace(/(.{2})(.*)(?=@)/, (match, p1, p2) => p1 + '*'.repeat(p2.length)),
      otp: otp, // ALWAYS include OTP in response
      note: `Enter this OTP: ${otp}`,
      emailMethod: emailResult.method
    };
    
    // Add preview URL if using Ethereal
    if (emailResult.previewUrl) {
      response.previewUrl = emailResult.previewUrl;
      response.note = `Test email preview: ${emailResult.previewUrl}\nOr use OTP: ${otp}`;
    }
    
    console.log(`📤 Response sent with OTP: ${otp}`);
    console.log(`📧 Email method: ${emailResult.method}`);
    
    res.json(response);
    
  } catch (error) {
    console.error('🔥 Server error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

router.post('/verify', (req, res) => {
  try {
    const { email, otp } = req.body;
    
    console.log(`\n=== OTP VERIFICATION ===`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔢 OTP entered: ${otp}`);
    
    const stored = otpStore.get(email);
    
    if (!stored) {
      console.log('❌ No OTP found for this email');
      return res.status(400).json({
        success: false,
        message: 'No OTP found. Please request a new one.'
      });
    }
    
    if (stored.expiresAt < Date.now()) {
      otpStore.delete(email);
      console.log('⌛ OTP expired');
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }
    
    if (stored.otp !== otp) {
      console.log(`❌ Invalid OTP. Expected: ${stored.otp}, Got: ${otp}`);
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please try again.'
      });
    }
    
    otpStore.delete(email);
    console.log('✅ OTP verified successfully!');
    
    const user = { 
      email: 'fanshawmarkk@yahoo.com', 
      name: 'Mark Jackson Fanshaw', 
      role: 'user' 
    };
    
    res.json({
      success: true,
      message: 'Login successful!',
      user: user
    });
    
  } catch (error) {
    console.error('🔥 Verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
