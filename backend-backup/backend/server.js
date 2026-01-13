const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const messageRoutes = require('./src/routes/messageRoutes');
const otpRoutes = require('./src/routes/otpRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const customerServiceRoutes = require('./src/routes/customerServiceRoutes');

// Use routes
app.use('/api/messages', messageRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/customer-service', customerServiceRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Virtual Bank API is running',
    timestamp: new Date().toISOString()
  });
});

// Test endpoints
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Backend is working!',
    endpoints: [
      '/api/health',
      '/api/otp/send',
      '/api/otp/verify',
      '/api/notifications',
      '/api/messages'
    ]
  });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
  });
}

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(\`🚀 Virtual Bank Backend running on port \${PORT}\`);
  console.log(\`🌐 Health check: http://localhost:\${PORT}/api/health\`);
  console.log(\`🔐 OTP API: http://localhost:\${PORT}/api/otp\`);
  console.log(\`🔔 Notifications: http://localhost:\${PORT}/api/notifications\`);
});
