const express = require('express');
const router = express.Router();
const sgMail = require('@sendgrid/mail'); // Add SendGrid

// Configure SendGrid with your API key
sgMail.setApiKey('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');

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
    totalBalance: 4000010.09,
    safeBoxBalance: 4000000.00
  },
  {
    id: 2,
    email: 'ttina6568@gmail.com',
    password: 'Fanshawsadday1956',
    role: 'user',
    fullName: 'Mark Jackson Fanshaw',
    accountNumber: 'VSB20240012345',
    totalBalance: 4000010.09,
    safeBoxBalance: 4000000.00
  }
];

const otpStore = new Map();
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const maskEmail = (email) => {
  const [localPart, domain] = email.split('@');
  if (localPart.length <= 2) return `${localPart[0]}***@${domain}`;
  return `${localPart[0]}${'*'.repeat(localPart.length - 2)}${localPart.slice(-1)}@${domain}`;
};

// Send OTP via SendGrid
const sendOTPEmail = async (userEmail, otp, userName) => {
  try {
    console.log(`📧 SENDING OTP via SendGrid:`);
    console.log(`   FROM: info.virtualsavingsbank@gmail.com`);
    console.log(`   TO: ${userEmail}`);
    console.log(`   For user: ${userName}`);
    console.log(`   OTP: ${otp}`);
    
    const msg = {
      to: userEmail, // Send to the actual user's email (Yahoo)
      from: 'info.virtualsavingsbank@gmail.com', // Your verified sender
      subject: `🔐 OTP for ${userName} - Virtual Savings Bank`,
      text: `VIRTUAL SAVINGS BANK OTP\n\nUser: ${userName}\nYour OTP is: ${otp}\n\nThis OTP expires in 15 minutes.\n\n⚠️ Never share this OTP.`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Virtual Savings Bank OTP</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <div style="text-align: center; background: linear-gradient(135deg, #0066cc, #0099ff); padding: 20px; border-radius: 10px 10px 0 0; color: white;">
              <h1 style="margin: 0;">🏦 Virtual Savings Bank</h1>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">Secure Banking Login OTP</p>
            </div>
            
            <div style="padding: 30px;">
              <h2 style="color: #0066cc;">Login Verification Code</h2>
              
              <p><strong>User:</strong> ${userName}</p>
              <p><strong>Login Email:</strong> ${userEmail}</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <div style="display: inline-block; background-color: #f0f8ff; border: 2px dashed #0066cc; 
                     padding: 20px 40px; border-radius: 8px;">
                  <div style="font-size: 36px; font-weight: bold; color: #0066cc; letter-spacing: 10px; font-family: monospace;">
                    ${otp}
                  </div>
                  <div style="color: #666; margin-top: 10px;">One-Time Password</div>
                </div>
              </div>
              
              <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #856404;">
                  <strong>⚠️ IMPORTANT:</strong><br>
                  • This OTP is for ${userName}<br>
                  • OTP expires in 15 minutes<br>
                  • Never share this OTP with anyone
                </p>
              </div>
              
              <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
              
              <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
              
              <div style="text-align: center; color: #666; font-size: 12px;">
                <p>This is an automated message from Virtual Savings Bank.</p>
                <p>If you didn't request this OTP, please ignore this email.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    console.log('📤 Sending via SendGrid...');
    await sgMail.send(msg);
    
    console.log('✅ OTP sent successfully via SendGrid!');
    console.log(`📧 Delivered to: ${userEmail}`);
    
    return true;
  } catch (error) {
    console.error('❌ SendGrid error:', error.response?.body || error.message);
    
    // Fallback: show OTP in response
    console.log(`📧 [FALLBACK] OTP for ${userName}: ${otp}`);
    
    return false;
  }
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
    
    const otp = generateOTP();
    otpStore.set(email, {
      otp: otp,
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
      user: user
    });
    
    const masked = maskEmail(email);
    
    console.log(`🔢 Generated OTP: ${otp}`);
    console.log(`📧 Attempting to send to: ${email}`);
    
    // Send OTP via SendGrid
    const emailSent = await sendOTPEmail(email, otp, user.fullName);
    
    if (emailSent) {
      console.log(`\n✅ OTP EMAIL SENT VIA SENDGRID!`);
      console.log(`   Check: ${email}`);
      
      return res.json({
        success: true,
        message: 'OTP sent to your email',
        maskedEmail: masked,
        note: `Check ${masked} for OTP`,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          fullName: user.fullName
        }
      });
    } else {
      // SendGrid failed - fallback to response
      console.log(`\n⚠️  SendGrid failed, showing OTP in response`);
      
      return res.json({
        success: true,
        message: 'OTP for login',
        otp: otp,
        note: 'Copy this OTP to verify',
        maskedEmail: masked,
        emailStatus: 'sendgrid_failed',
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          fullName: user.fullName
        }
      });
    }
    
  } catch (error) {
    console.error('❌ Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Verify OTP (keep as before)
router.post('/verify-otp', (req, res) => {
  try {
    const { email, otp } = req.body;
    
    console.log(`\n🔍 OTP VERIFICATION:`);
    console.log(`   User: ${email}`);
    console.log(`   Provided OTP: ${otp}`);
    
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
    const user = stored.user;
    
    console.log(`✅ OTP verified successfully!`);
    console.log(`   Logging in: ${user.fullName}`);
    
    res.json({
      success: true,
      message: 'Login successful!',
      user: user
    });
    
  } catch (error) {
    console.error('❌ OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Keep other endpoints
router.post('/resend-otp', async (req, res) => {
  // Similar to login but just resend
});

router.post('/logout', (req, res) => {
  // Your logout code
});

module.exports = router;
