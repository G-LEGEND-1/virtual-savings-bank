const nodemailer = require('nodemailer');

const sendOTPEmail = async (toEmail, otp) => {
  try {
    console.log(`📧 Attempting to send OTP to: ${toEmail}`);
    console.log(`📤 Using email: ${process.env.EMAIL_USER || 'ethereal-test'}`);
    
    // Option 1: Try Gmail if credentials exist
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        console.log('🔄 Trying Gmail...');
        const gmailTransporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS.replace(/\s+/g, '') // Remove spaces
          }
        });
        
        // Verify Gmail connection
        await gmailTransporter.verify();
        console.log('✅ Gmail connection verified');
        
        const mailOptions = {
          from: `"Virtual Saving Bank" <${process.env.EMAIL_USER}>`,
          to: toEmail,
          subject: 'Your Virtual Bank OTP Code',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #667eea; padding: 30px; text-align: center; color: white;">
                <h1>Virtual Saving Bank</h1>
                <p>Secure Digital Banking</p>
              </div>
              <div style="padding: 40px 30px; background: white;">
                <h2 style="color: #333;">Your OTP Code</h2>
                <div style="text-align: center; margin: 30px 0;">
                  <div style="font-size: 48px; font-weight: bold; color: #667eea; letter-spacing: 10px;">
                    ${otp}
                  </div>
                </div>
                <p>Use this code to login. Valid for 10 minutes.</p>
              </div>
            </div>
          `,
          text: `Your Virtual Bank OTP: ${otp}. Valid for 10 minutes.`
        };
        
        const info = await gmailTransporter.sendMail(mailOptions);
        console.log('✅ Gmail sent successfully!');
        console.log('📨 Message ID:', info.messageId);
        
        return {
          success: true,
          method: 'gmail',
          messageId: info.messageId
        };
        
      } catch (gmailError) {
        console.log('❌ Gmail failed:', gmailError.message);
        // Fall through to Ethereal
      }
    }
    
    // Option 2: Use Ethereal (always works for testing)
    console.log('🔄 Falling back to Ethereal email...');
    const testAccount = await nodemailer.createTestAccount();
    
    const etherealTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    
    const etherealOptions = {
      from: '"Virtual Bank" <noreply@virtualbank.com>',
      to: toEmail,
      subject: 'Your Virtual Bank OTP (Test)',
      html: `<h2>OTP: ${otp}</h2><p>Test email - valid for 10 minutes</p>`,
      text: `Test OTP: ${otp}`
    };
    
    const etherealInfo = await etherealTransporter.sendMail(etherealOptions);
    const previewUrl = nodemailer.getTestMessageUrl(etherealInfo);
    
    console.log('✅ Ethereal email created!');
    console.log('🔗 Preview URL:', previewUrl);
    console.log(`🔢 OTP: ${otp}`);
    
    return {
      success: true,
      method: 'ethereal',
      previewUrl: previewUrl,
      otp: otp,
      note: 'Check preview URL for test email'
    };
    
  } catch (error) {
    console.error('🔥 All email methods failed:', error.message);
    // Even if all fails, we'll still show OTP
    return {
      success: true, // Still success so OTP is shown
      method: 'failed',
      otp: otp,
      error: error.message
    };
  }
};

module.exports = { sendOTPEmail };
