const express = require('express');
const router = express.Router();

// Inline user data
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
    dateOfBirth: '1956-08-15',
    gender: 'Male',
    address: '123 Ocean Drive, Miami Beach, FL 33139',
    phone: '+1 (305) 555-0198',
    accountNumber: 'VSB20240012345',
    routingNumber: '021000021',
    accountType: 'Premium Savings',
    joinDate: '2008-02-01',
    status: 'active',
    kycVerified: true,
    totalBalance: 4000000.00,
    availableBalance: 4000000.00,
    safeBoxBalance: 4000000.00,
    lastLogin: new Date().toISOString()
  }
];

// Get user profile
router.get('/:userId', (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Return user profile (excluding password)
    const { password, ...userProfile } = user;
    
    res.json({
      success: true,
      data: userProfile
    });
    
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
