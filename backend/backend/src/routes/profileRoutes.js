const express = require('express');
const router = express.Router();
const users = require('../data/users');

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

// Update profile (basic - for demo)
router.put('/:userId', (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const updates = req.body;
    
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Update user (in real app, validate and sanitize inputs)
    users[userIndex] = { ...users[userIndex], ...updates };
    
    const { password, ...updatedProfile } = users[userIndex];
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedProfile
    });
    
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
