const OTP = require('../models/OTP');
const { sendOTPEmail } = require('../services/emailService');

exports.sendOTP = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    // Validate credentials
    const validUsers = [
      { email: 'admin@virtualbank.com', password: 'admin123', name: 'Administrator' },
      { email: 'fanshawmarkk@yahoo.com', password: 'Fanshawsadday1956', name: 'Mark Jackson Fanshaw' }
    ];
    
    const user = validUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Generate OTP
    const result = await OTP.create(email);
    
    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate OTP'
      });
    }
    
    // Send real email with OTP
    const emailResult = await sendOTPEmail(email, result.otp);
    
    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please try again.'
      });
    }
    
    // Mask email for display
    const maskEmail = (email) => {
      const [localPart, domain] = email.split('@');
      const maskedLocal = localPart.slice(0, 5) + '***';
      return `${maskedLocal}@${domain}`;
    };
    
    res.json({
      success: true,
      message: 'OTP sent to your email',
      maskedEmail: maskEmail(email),
      note: 'Check your Yahoo Mail inbox'
    });
    
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }
    
    const result = await OTP.verify(email, otp);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    // Get user info
    const validUsers = [
      { email: 'admin@virtualbank.com', name: 'Administrator', role: 'admin' },
      { email: 'fanshawmarkk@yahoo.com', name: 'Mark Jackson Fanshaw', role: 'user' }
    ];
    
    const user = validUsers.find(u => u.email === email);
    
    res.json({
      success: true,
      message: 'OTP verified successfully',
      user: {
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
