const express = require('express');
const router = express.Router();

// Demo message data
const demoMessages = [
  {
    id: 1,
    userId: 1,
    subject: 'Welcome to Virtual Bank!',
    content: 'Your account has been successfully activated.',
    isRead: false,
    messageType: 'welcome',
    customDate: '2023-12-15',
    customTime: '09:30',
    customYear: '2023',
    createdAt: new Date().toISOString()
  }
];

// Send message
router.post('/send', (req, res) => {
  const { userId, subject, content, customDate, customTime, customYear } = req.body;
  
  const newMessage = {
    id: demoMessages.length + 1,
    userId,
    subject,
    content,
    isRead: false,
    messageType: 'notification',
    customDate: customDate || null,
    customTime: customTime || null,
    customYear: customYear || null,
    createdAt: new Date().toISOString()
  };
  
  demoMessages.push(newMessage);
  
  res.json({
    success: true,
    message: 'Message sent successfully',
    data: newMessage
  });
});

// Get user messages
router.get('/user/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const userMessages = demoMessages.filter(msg => msg.userId === userId);
  
  res.json({
    success: true,
    data: userMessages
  });
});

// Mark message as read
router.patch('/:messageId/read', (req, res) => {
  const messageId = parseInt(req.params.messageId);
  const message = demoMessages.find(msg => msg.id === messageId);
  
  if (message) {
    message.isRead = true;
    res.json({ success: true, message: 'Message marked as read' });
  } else {
    res.status(404).json({ success: false, message: 'Message not found' });
  }
});

// Get unread count
router.get('/unread/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const unreadCount = demoMessages.filter(msg => 
    msg.userId === userId && !msg.isRead
  ).length;
  
  res.json({ success: true, count: unreadCount });
});

module.exports = router;
