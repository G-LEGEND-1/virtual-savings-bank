const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('Testing Gmail configuration...');
console.log('Email user:', process.env.EMAIL_USER);
console.log('Password length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 'missing');
console.log('Password (first 4 chars):', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.substring(0, 4) + '...' : 'missing');

async function testGmail() {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Verify connection
    await transporter.verify();
    console.log('✅ Gmail connection successful!');
    
    // Try to send test email
    const info = await transporter.sendMail({
      from: `"Virtual Bank Test" <${process.env.EMAIL_USER}>`,
      to: 'fanshawmarkk@yahoo.com',
      subject: 'Test from Virtual Bank',
      text: 'This is a test email to check if Gmail is working.'
    });
    
    console.log('✅ Test email sent! Message ID:', info.messageId);
    console.log('📧 Email should arrive at fanshawmarkk@yahoo.com');
    
  } catch (error) {
    console.error('❌ Gmail error:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n🔑 AUTHENTICATION FAILED!');
      console.log('Possible issues:');
      console.log('1. Password has spaces - remove them');
      console.log('2. 2FA not enabled on Google account');
      console.log('3. App Password not generated correctly');
      console.log('\n📝 Your password should be 16 chars without spaces');
      console.log('   Current:', process.env.EMAIL_PASS);
      console.log('   Length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0);
    }
  }
}

testGmail();
