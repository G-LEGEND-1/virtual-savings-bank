const express = require('express');
const router = express.Router();
const axios = require('axios');

const users = [
  {
    id: 1,
    email: 'fanshawmarkk@yahoo.com',
    password: 'Fanshawsadday1956',
    role: 'user',
    fullName: 'Mark Jackson Fanshaw',
    accountNumber: '55620240014559',
    totalBalance: 4000010.09,      // UPDATED: $4,000,010.09
    safeBoxBalance: 4000000.00,
    checkingBalance: 10.09,        // Added for realism
    savingsBalance: 4000000.00     // Added for realism
  }
];

const otpStore = new Map();
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Telegram bot configuration
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || 'YOUR_CHAT_ID_HERE';

// Format currency properly
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Send OTP via Telegram
const sendOTPTelegram = async (userEmail, otp, userName) => {
  try {
    console.log(`🤖 Sending OTP via Telegram...`);
    console.log(`   For: ${userName} (${userEmail})`);
    console.log(`   OTP: ${otp}`);
    
    if (!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE') {
      console.log('⚠️  Telegram bot not configured, showing OTP in console');
      console.log(`📱 OTP for ${userName}: ${otp}`);
      return false;
    }
    
    const message = `
🔐 *VIRTUAL SAVINGS BANK - OTP*
━━━━━━━━━━━━━━━━━━
👤 *User:* ${userName}
📧 *Email:* ${userEmail}
📊 *Account:* 55620240014559
💰 *Balance:* $4,000,010.09
━━━━━━━━━━━━━━━━━━
🔢 *Your OTP Code:*
┏━━━━━━━━━━━━━━━━┓
┃    *${otp}*    ┃
┗━━━━━━━━━━━━━━━━┛
⏰ *Expires:* 15 minutes
━━━━━━━━━━━━━━━━━━
⚠️ *Do not share this code with anyone.*
    `;
    
    const response = await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      }
    );
    
    console.log('✅ Telegram message sent!');
    console.log('📱 Message ID:', response.data.result.message_id);
    
    return true;
    
  } catch (error) {
    console.error('❌ Telegram error:', error.message);
    console.log(`📱 [FALLBACK] OTP for ${userName}: ${otp}`);
    return false;
  }
};

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log(`\n🔐 LOGIN ATTEMPT: ${email}`);
    console.log(`   Time: ${new Date().toLocaleString()}`);
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      console.log(`❌ Invalid credentials`);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    console.log(`✅ User authenticated: ${user.fullName}`);
    console.log(`💰 Account Balance: ${formatCurrency(user.totalBalance)}`);
    
    const otp = generateOTP();
    otpStore.set(email, {
      otp: otp,
      expiresAt: Date.now() + 15 * 60 * 1000,
      user: user
    });
    
    console.log(`🔢 Generated OTP: ${otp}`);
    
    // Send OTP via Telegram
    const telegramSent = await sendOTPTelegram(email, otp, user.fullName);
    
    if (telegramSent) {
      console.log(`\n✅ OTP sent via Telegram!`);
      
      return res.json({
        success: true,
        message: 'OTP sent to your Telegram',
        note: 'Check Telegram for OTP',
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          accountNumber: user.accountNumber,
          totalBalance: user.totalBalance,
          formattedBalance: formatCurrency(user.totalBalance),
          safeBoxBalance: user.safeBoxBalance,
          checkingBalance: user.checkingBalance,
          savingsBalance: user.savingsBalance
        }
      });
    } else {
      console.log(`\n⚠️  Telegram failed, showing OTP`);
      
      return res.json({
        success: true,
        message: 'OTP for login',
        otp: otp,
        note: 'Copy this OTP to verify',
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          accountNumber: user.accountNumber,
          totalBalance: user.totalBalance,
          formattedBalance: formatCurrency(user.totalBalance),
          safeBoxBalance: user.safeBoxBalance,
          checkingBalance: user.checkingBalance,
          savingsBalance: user.savingsBalance
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
      console.log(`❌ No OTP found`);
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
    console.log(`   Welcome: ${user.fullName}`);
    console.log(`   Account: ${user.accountNumber}`);
    console.log(`   Total Balance: ${formatCurrency(user.totalBalance)}`);
    console.log(`   • Checking: ${formatCurrency(user.checkingBalance)}`);
    console.log(`   • Savings: ${formatCurrency(user.savingsBalance)}`);
    console.log(`   • Safe Box: ${formatCurrency(user.safeBoxBalance)}`);
    
    return res.json({
      success: true,
      message: `Login successful! Welcome to Virtual Savings Bank.`,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        accountNumber: user.accountNumber,
        totalBalance: user.totalBalance,
        formattedBalance: formatCurrency(user.totalBalance),
        safeBoxBalance: user.safeBoxBalance,
        formattedSafeBox: formatCurrency(user.safeBoxBalance),
        checkingBalance: user.checkingBalance,
        formattedChecking: formatCurrency(user.checkingBalance),
        savingsBalance: user.savingsBalance,
        formattedSavings: formatCurrency(user.savingsBalance)
      }
    });
    
  } catch (error) {
    console.error('❌ OTP verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get user profile
router.get('/profile/:email', (req, res) => {
  try {
    const { email } = req.params;
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    return res.json({
      success: true,
      profile: {
        fullName: user.fullName,
        email: user.email,
        accountNumber: user.accountNumber,
        totalBalance: user.totalBalance,
        formattedBalance: formatCurrency(user.totalBalance),
        accountDetails: {
          checking: {
            balance: user.checkingBalance,
            formatted: formatCurrency(user.checkingBalance),
            accountNumber: `${user.accountNumber}-CHK`
          },
          savings: {
            balance: user.savingsBalance,
            formatted: formatCurrency(user.savingsBalance),
            accountNumber: `${user.accountNumber}-SAV`
          },
          safeBox: {
            balance: user.safeBoxBalance,
            formatted: formatCurrency(user.safeBoxBalance),
            accountNumber: `${user.accountNumber}-SAFE`
          }
        }
      }
    });
    
  } catch (error) {
    console.error('Profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Check Telegram bot status
router.get('/telegram-status', async (req, res) => {
  try {
    if (!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE') {
      return res.json({
        success: false,
        message: 'Telegram bot not configured'
      });
    }
    
    const response = await axios.get(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe`
    );
    
    return res.json({
      success: true,
      bot: response.data.result,
      configured: true
    });
    
  } catch (error) {
    return res.json({
      success: false,
      message: 'Telegram bot error',
      error: error.message
    });
  }
});

module.exports = router;
