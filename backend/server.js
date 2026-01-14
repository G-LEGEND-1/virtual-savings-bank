const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration - ADD YOUR DOMAIN
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://reliable-stroopwafel-69a762.netlify.app',
    'https://vsbonline.site',                    // ADD THIS
    'https://www.vsbonline.site',                // ADD THIS
    'https://*.vsbonline.site'                   // ADD THIS (wildcard for subdomains)
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const profileRoutes = require('./src/routes/profileRoutes');
const transactionRoutes = require('./src/routes/transactionRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const customerServiceRoutes = require('./src/routes/customerServiceRoutes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/transactions', transactionRoutes);
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

// For Render health checks
app.get('/', (req, res) => {
  res.json({ 
    message: 'Virtual Savings Bank API',
    status: 'online',
    version: '1.0.0'
  });
});

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
  console.log(`🚀 Virtual Bank Backend running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
});
