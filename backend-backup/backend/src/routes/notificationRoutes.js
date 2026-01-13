const express = require('express');
const router = express.Router();

// In-memory notifications storage
let notifications = [
  {
    id: 1,
    userId: 1,
    type: 'welcome',
    title: 'Welcome to Virtual Bank!',
    content: 'Your account has been successfully activated.',
    isRead: false,
    timestamp: new Date().toISOString(),
    icon: 'fas fa-bell',
    customDate: null,
    customTime: null,
    customYear: null
  },
  {
    id: 2,
    userId: 1,
    type: 'transaction',
    title: 'New Transaction Received',
    content: '$500.00 deposited from Chase Bank',
    isRead: false,
    timestamp: new Date().toISOString(),
    icon: 'fas fa-money-bill-wave',
    customDate: null,
    customTime: null,
    customYear: null
  }
];

// Get all notifications for user
router.get('/user/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const userNotifications = notifications
    .filter(n => n.userId === userId)
    .sort((a, b) => {
      // Sort by custom timestamp if available, otherwise by actual timestamp
      const dateA = a.customDate ? new Date(`${a.customDate}T${a.customTime || '00:00'}`) : new Date(a.timestamp);
      const dateB = b.customDate ? new Date(`${b.customDate}T${b.customTime || '00:00'}`) : new Date(b.timestamp);
      return dateB - dateA; // Newest first
    });
  
  res.json({
    success: true,
    data: userNotifications,
    count: userNotifications.length,
    unreadCount: userNotifications.filter(n => !n.isRead).length
  });
});

// Get unread count
router.get('/unread-count/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const unreadCount = notifications.filter(n => 
    n.userId === userId && !n.isRead
  ).length;
  
  res.json({
    success: true,
    count: unreadCount,
    userId: userId
  });
});

// Create notification (when admin sends message)
router.post('/', (req, res) => {
  try {
    const { userId, type, title, content, icon, customDate, customTime, customYear } = req.body;
    
    // Use custom timestamp if provided, otherwise use current time
    let timestamp = new Date().toISOString();
    let displayDate = new Date();
    
    if (customDate) {
      // Combine custom date, time, and year
      const year = customYear || new Date().getFullYear();
      const dateStr = `${year}-${customDate.split('-')[1]}-${customDate.split('-')[2]}`;
      displayDate = new Date(`${dateStr}T${customTime || '00:00'}`);
      timestamp = displayDate.toISOString();
    }
    
    const newNotification = {
      id: notifications.length + 1,
      userId: parseInt(userId),
      type: type || 'message',
      title: title || 'New Notification',
      content: content || '',
      isRead: false,
      timestamp: timestamp,
      icon: icon || 'fas fa-bell',
      customDate: customDate || null,
      customTime: customTime || null,
      customYear: customYear || null,
      displayTimestamp: customDate ? `${customDate} ${customTime} ${customYear}` : null
    };
    
    notifications.push(newNotification);
    
    console.log(`🔔 New notification created for user ${userId}: ${title}`);
    if (customDate) {
      console.log(`📅 Custom timestamp: ${customDate} ${customTime} ${customYear}`);
    }
    
    res.json({
      success: true,
      message: 'Notification created',
      data: newNotification,
      totalNotifications: notifications.filter(n => n.userId === parseInt(userId)).length
    });
    
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create notification'
    });
  }
});

// Mark notification as read
router.patch('/:id/read', (req, res) => {
  const id = parseInt(req.params.id);
  const notification = notifications.find(n => n.id === id);
  
  if (notification) {
    notification.isRead = true;
    res.json({ 
      success: true, 
      message: 'Notification marked as read',
      notificationId: id
    });
  } else {
    res.status(404).json({ 
      success: false, 
      message: 'Notification not found' 
    });
  }
});

// Mark all as read for user
router.patch('/mark-all-read/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  let markedCount = 0;
  
  notifications.forEach(notification => {
    if (notification.userId === userId && !notification.isRead) {
      notification.isRead = true;
      markedCount++;
    }
  });
  
  res.json({
    success: true,
    message: `Marked ${markedCount} notifications as read`,
    markedCount: markedCount,
    userId: userId
  });
});

// Delete notification
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = notifications.length;
  
  notifications = notifications.filter(n => n.id !== id);
  
  if (notifications.length < initialLength) {
    res.json({
      success: true,
      message: 'Notification deleted',
      deletedId: id
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Notification not found'
    });
  }
});

module.exports = router;
