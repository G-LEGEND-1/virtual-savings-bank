const express = require('express');
const router = express.Router();

// In-memory notifications
let notifications = [
  {
    id: 1,
    userId: 1,
    type: 'welcome',
    title: 'Welcome to Virtual Savings Bank',
    content: 'Your premium savings account has been active since 2008.',
    isRead: false,
    timestamp: '2008-02-01T10:00:00Z',
    icon: 'fas fa-user-plus'
  },
  {
    id: 2,
    userId: 1,
    type: 'transaction',
    title: 'Large Deposit Received',
    content: '$7,500,000.00 deposited from Washington Mutual Bank',
    isRead: false,
    timestamp: '2008-02-15T09:45:00Z',
    icon: 'fas fa-money-bill-wave'
  },
  {
    id: 3,
    userId: 1,
    type: 'safebox',
    title: 'Safe Box Deposit Confirmed',
    content: '$4,000,000.00 securely deposited in your Safe Box',
    isRead: false,
    timestamp: '2008-08-04T10:30:00Z',
    icon: 'fas fa-vault'
  },
  {
    id: 4,
    userId: 1,
    type: 'info',
    title: 'Account Statement Ready',
    content: 'Your 2010 annual statement is now available for download',
    isRead: true,
    timestamp: '2011-01-15T14:20:00Z',
    icon: 'fas fa-file-invoice-dollar'
  }
];

// Get notifications for user
router.get('/user/:userId', (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const userNotifications = notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    const unreadCount = userNotifications.filter(n => !n.isRead).length;
    
    res.json({
      success: true,
      data: userNotifications,
      unreadCount: unreadCount
    });
    
  } catch (error) {
    console.error('Notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Mark notification as read
router.patch('/:id/read', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const userId = parseInt(req.query.userId);
    
    const notification = notifications.find(n => n.id === id && n.userId === userId);
    
    if (notification) {
      notification.isRead = true;
      res.json({
        success: true,
        message: 'Notification marked as read'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Mark all notifications as read
router.patch('/mark-all-read/:userId', (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    notifications = notifications.map(n => 
      n.userId === userId ? { ...n, isRead: true } : n
    );
    
    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
    
  } catch (error) {
    console.error('Mark all read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Create notification (for customer service)
router.post('/', (req, res) => {
  try {
    const { userId, type, title, content, icon } = req.body;
    
    const newNotification = {
      id: notifications.length + 1,
      userId: parseInt(userId),
      type: type || 'message',
      title: title || 'New Message',
      content: content || '',
      isRead: false,
      timestamp: new Date().toISOString(),
      icon: icon || 'fas fa-envelope'
    };
    
    notifications.push(newNotification);
    
    res.json({
      success: true,
      data: newNotification,
      message: 'Notification created'
    });
    
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
