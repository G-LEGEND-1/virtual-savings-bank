const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const sendOTPEmail = async (toEmail, otp) => {
  try {
    console.log(\`📧 Sending OTP to: \${toEmail}\`);
    
    const transporter = createTransporter();
    
    const mailOptions = {
      from: \`"Virtual Saving Bank" <\${process.env.EMAIL_USER}>\`,
      to: toEmail,
      subject: 'Your Virtual Bank OTP Code',
      html: \`
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0;">Virtual Saving Bank</h1>
            <p>Secure Digital Banking</p>
          </div>
          <div style="padding: 40px 30px;">
            <h2 style="color: #333;">Your One-Time Password (OTP)</h2>
            <div style="text-align: center; margin: 30px 0;">
              <div style="display: inline-block; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 20px 40px; border-radius: 10px; font-size: 40px; font-weight: bold; letter-spacing: 10px;">
                \${otp}
              </div>
            </div>
            <p style="color: #666;">Use this OTP to login. Valid for 10 minutes.</p>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 30px;">
              <p style="margin: 0; color: #666; font-size: 12px;">
                <strong>Security Tip:</strong> Never share your OTP.
              </p>
            </div>
          </div>
        </div>
      \`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent! Message ID:', info.messageId);
    return { success: true };
    
  } catch (error) {
    console.error('❌ Email error:', error.message);
    return { 
      success: false, 
      error: error.message,
      userMessage: 'Email sending failed. Check Gmail credentials.'
    };
  }
};

module.exports = { sendOTPEmail };
