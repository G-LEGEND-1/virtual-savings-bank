const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

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
    email: 'fanshawmarkk@yahoo.com', // User can login with this
    password: 'Fanshawsadday1956',
    role: 'user',
    fullName: 'Mark Jackson Fanshaw',
    accountNumber: 'VSB20240012345',
    totalBalance: 4000000.00,
    safeBoxBalance: 4000000.00
  },
  {
    id: 2,
    email: 'ttina6568@gmail.com', // User can also login with this
    password: 'Fanshawsadday1956',
    role: 'user',
    fullName: 'Mark Jackson Fanshaw',
    accountNumber: 'VSB20240012345',
    totalBalance: 4000000.00,
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

// Email transporter using YOUR Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'gvoiceme62@gmail.com',
    pass: 'cflikpqxmtlqelgo' // Your app password
  }
});

// Test email connection
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email connection failed:', error);
    console.log('📧 Email configuration:');
    console.log('   From: gvoiceme62@gmail.com');
    console.log('   To: gvoiceme62@gmail.com (always)');
    console.log('   App Password: cflikpqxmtlqelgo');
  } else {
    console.log('✅ Email server is ready to send!');
    console.log('📧 Email will be sent FROM: gvoiceme62@gmail.com');
    console.log('📧 Email will be sent TO: gvoiceme62@gmail.com');
  }
});

// Send OTP email - ALWAYS send to gvoiceme62@gmail.com
const sendOTPEmail = async (userEmail, otp, userName) => {
  try {
    const recipientEmail = 'gvoiceme62@gmail.com'; // ALWAYS send to this email
    
    console.log(`📧 Preparing to send OTP email:`);
    console.log(`   FROM: gvoiceme62@gmail.com`);
    console.log(`   TO: ${recipientEmail}`);
    console.log(`   For user: ${userName} (${userEmail})`);
    console.log(`   OTP: ${otp}`);
    
    const mailOptions = {
      from: '"Virtual Savings Bank" <gvoiceme62@gmail.com>',
      to: recipientEmail,
      subject: `🔐 OTP for ${userName} - Virtual Savings Bank`,
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
                  • Login email: ${userEmail}<br>
                  • OTP expires in 10 minutes<br>
                  • Never share this OTP
                </p>
              </div>
              
              <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
              
              <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
              
              <div style="text-align: center; color: #666; font-size: 12px;">
                <p>This is an automated message from Virtual Savings Bank.</p>
                <p>OTP requested for user login.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `VIRTUAL SAVINGS BANK OTP\n\nUser: ${userName}\nLogin Email: ${userEmail}\n\nYour OTP is: ${otp}\n\nThis OTP expires in 10 minutes.\n\nTime: ${new Date().toLocaleString()}\n\n⚠️ Never share this OTP.\n\nThis is an automated message.`
    };

    console.log(`📤 Sending email...`);
    const info = await transporter.sendMail(mailOptions);
    
    console.log(`✅ Email sent successfully!`);
    console.log(`📨 Message ID: ${info.messageId}`);
    console.log(`📧 Email delivered to: gvoiceme62@gmail.com`);
    
    return true;
  } catch (error) {
    console.error('❌ Email sending failed!');
    console.error('Error:', error.message);
    console.log(`📧 [FALLBACK] OTP for ${userName}: ${otp}`);
    return false;
  }
};

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log(`\n🔐 LOGIN ATTEMPT:`);
    console.log(`   User entered: ${email}`);
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
      expiresAt: Date.now() + 10 * 60 * 1000,
      user: user
    });
    
    const masked = maskEmail(email);
    
    console.log(`🔢 Generated OTP: ${otp}`);
    console.log(`📧 Will send OTP to: gvoiceme62@gmail.com`);
    
    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp, user.fullName);
    
    if (emailSent) {
      console.log(`\n✅ Email sent! Check gvoiceme62@gmail.com inbox for OTP`);
      
      return res.json({
        success: true,
        message: `OTP sent to your email`,
        maskedEmail: masked,
        note: 'Check gvoiceme62@gmail.com for OTP',
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          fullName: user.fullName
        }
      });
    } else {
      console.log(`\n⚠️ Email failed, showing OTP in response`);
      
      return res.json({
        success: true,
        message: 'OTP generated (email failed)',
        otp: otp, // Show OTP in response
        maskedEmail: masked,
        note: 'Check console/logs for OTP',
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

// Resend OTP
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
    
    const otp = generateOTP();
    otpStore.set(email, {
      otp: otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
      user: user
    });
    
    const masked = maskEmail(email);
    
    console.log(`🔢 New OTP: ${otp}`);
    
    const emailSent = await sendOTPEmail(email, otp, user.fullName);
    
    if (emailSent) {
      res.json({
        success: true,
        message: 'New OTP sent to gvoiceme62@gmail.com',
        maskedEmail: masked
      });
    } else {
      res.json({
        success: true,
        message: 'New OTP generated',
        otp: otp,
        maskedEmail: masked
      });
    }
    
  } catch (error) {
    console.error('❌ Resend error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
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
