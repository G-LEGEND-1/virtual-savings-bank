const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Users array
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

const otpStore = new Map();
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const maskEmail = (email) => {
  const [localPart, domain] = email.split('@');
  if (localPart.length <= 2) return `${localPart[0]}***@${domain}`;
  return `${localPart[0]}${'*'.repeat(localPart.length - 2)}${localPart.slice(-1)}@${domain}`;
};

// ✅ OPTIMIZED GMAIL TRANSPORTER FOR RENDER
const createTransporter = () => {
  console.log('🔧 Configuring Gmail transporter...');
  
  // Use these settings for Render production
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,  // Use 587 instead of 465 (works better on Render)
    secure: false, // Use STARTTLS
    requireTLS: true,
    auth: {
      user: 'gvoiceme62@gmail.com',
      pass: 'cflikpqxmtlqelgo'
    },
    tls: {
      rejectUnauthorized: false // Helps with certificate issues
    },
    connectionTimeout: 10000, // 10 seconds timeout
    greetingTimeout: 10000,
    socketTimeout: 10000
  });

  return transporter;
};

const transporter = createTransporter();

// Test email connection with better logging
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Gmail connection test failed:', error.message);
    console.log('⚠️  This might be temporary. Emails will still attempt to send.');
    console.log('🔧 SMTP Configuration:');
    console.log('   Host: smtp.gmail.com');
    console.log('   Port: 587');
    console.log('   User: gvoiceme62@gmail.com');
    console.log('   Secure: STARTTLS');
  } else {
    console.log('✅ Gmail SMTP is READY for sending!');
    console.log('📧 Email will be sent FROM: gvoiceme62@gmail.com');
    console.log('📧 Email will be sent TO: gvoiceme62@gmail.com');
  }
});

// Robust OTP email sender with retry
const sendOTPEmail = async (userEmail, otp, userName, retryCount = 0) => {
  const maxRetries = 2;
  
  try {
    const recipientEmail = 'gvoiceme62@gmail.com';
    
    console.log(`\n📧 SENDING OTP EMAIL (Attempt ${retryCount + 1}/${maxRetries + 1})`);
    console.log(`   To: ${recipientEmail}`);
    console.log(`   For: ${userName} (${userEmail})`);
    console.log(`   OTP: ${otp}`);
    
    const mailOptions = {
      from: '"Virtual Savings Bank" <gvoiceme62@gmail.com>',
      to: recipientEmail,
      subject: `🔐 OTP for ${userName} - Virtual Savings Bank`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #0066cc;">🏦 Virtual Savings Bank</h2>
          <h3>Login Verification Code</h3>
          <p><strong>User:</strong> ${userName}</p>
          <p><strong>Login Email:</strong> ${userEmail}</p>
          <div style="background: #f0f8ff; padding: 20px; margin: 20px 0; border-radius: 10px;">
            <div style="font-size: 32px; font-weight: bold; color: #0066cc; letter-spacing: 5px;">
              ${otp}
            </div>
            <div style="color: #666; margin-top: 10px;">One-Time Password</div>
          </div>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Expires:</strong> 10 minutes</p>
        </div>
      `,
      text: `VIRTUAL SAVINGS BANK OTP\n\nUser: ${userName}\nLogin Email: ${userEmail}\n\nOTP: ${otp}\n\nExpires in 10 minutes.`
    };

    console.log('📤 Connecting to Gmail SMTP...');
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ EMAIL SENT SUCCESSFULLY!');
    console.log(`📨 Message ID: ${info.messageId}`);
    console.log(`📧 Delivered to: ${recipientEmail}`);
    console.log(`⏰ Time: ${new Date().toLocaleTimeString()}`);
    
    return { success: true, info: info };
    
  } catch (error) {
    console.log(`❌ Email attempt ${retryCount + 1} failed:`, error.message);
    
    // Retry logic
    if (retryCount < maxRetries) {
      console.log(`🔄 Retrying... (${retryCount + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
      return sendOTPEmail(userEmail, otp, userName, retryCount + 1);
    }
    
    console.log('💡 Final fallback - OTP will be shown in response');
    return { 
      success: false, 
      error: error.message,
      otp: otp // Return OTP for fallback
    };
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
      console.log('❌ Invalid credentials');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    console.log(`✅ Authenticated: ${user.fullName}`);
    
    if (user.role === 'admin') {
      return res.json({
        success: true,
        message: 'Admin login successful',
        user: user
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
    console.log(`📧 Attempting to send to: gvoiceme62@gmail.com`);
    
    // Send OTP via Gmail (with retry logic)
    const emailResult = await sendOTPEmail(email, otp, user.fullName);
    
    if (emailResult.success) {
      // Gmail worked!
      console.log(`\n🎉 OTP EMAIL SENT SUCCESSFULLY!`);
      console.log(`   Check: gvoiceme62@gmail.com`);
      console.log(`   OTP: ${otp}`);
      
      return res.json({
        success: true,
        message: 'OTP sent to your email',
        maskedEmail: masked,
        note: 'Check gvoiceme62@gmail.com inbox',
        emailStatus: 'sent',
        user: user
      });
    } else {
      // Gmail failed after retries - fallback to response
      console.log(`\n⚠️  Gmail failed, showing OTP in response`);
      console.log(`🔢 OTP for ${user.fullName}: ${otp}`);
      
      return res.json({
        success: true,
        message: 'OTP for login',
        otp: otp,
        note: 'Copy this OTP to verify',
        maskedEmail: masked,
        emailStatus: 'failed_using_fallback',
        user: user
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

// Keep verify-otp, resend-otp, logout endpoints exactly as before
// ... [YOUR EXISTING CODE FOR THESE ENDPOINTS] ...

module.exports = router;
