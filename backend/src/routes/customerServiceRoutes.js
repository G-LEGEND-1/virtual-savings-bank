const express = require('express');
const router = express.Router();

// In-memory chat messages
let conversations = [
  {
    id: 1,
    userId: 1,
    userName: 'Mark Jackson Fanshaw',
    userEmail: 'fanshawmarkk@yahoo.com',
    messages: [
      {
        id: 1,
        sender: 'user',
        message: 'Hello, I need help with my Safe Box withdrawal process.',
        timestamp: '2024-01-09T10:30:00Z',
        read: true
      },
      {
        id: 2,
        sender: 'admin',
        message: 'Hello Mark! I can help you with that. Please provide your Safe Box number and the amount you wish to withdraw.',
        timestamp: '2024-01-09T10:35:00Z',
        read: true
      },
      {
        id: 3,
        sender: 'user',
        message: 'Safe Box #VSB-SAFE001, I want to withdraw $500,000.',
        timestamp: '2024-01-09T10:40:00Z',
        read: true
      },
      {
        id: 4,
        sender: 'admin',
        message: 'Request received. A withdrawal form has been sent to your email. Please complete and return it with your ID verification.',
        timestamp: '2024-01-09T10:45:00Z',
        read: false
      }
    ],
    status: 'open',
    createdAt: '2024-01-09T10:30:00Z',
    updatedAt: '2024-01-09T10:45:00Z'
  }
];

// Get all conversations (admin only)
router.get('/conversations', (req, res) => {
  try {
    res.json({
      success: true,
      data: conversations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get conversation for user
router.get('/user/:userId', (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const conversation = conversations.find(c => c.userId === userId);
    
    if (!conversation) {
      // Create new conversation if none exists
      const newConversation = {
        id: conversations.length + 1,
        userId: userId,
        userName: 'Mark Jackson Fanshaw',
        userEmail: 'fanshawmarkk@yahoo.com',
        messages: [],
        status: 'open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      conversations.push(newConversation);
      return res.json({
        success: true,
        data: newConversation
      });
    }
    
    res.json({
      success: true,
      data: conversation
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Send message
router.post('/message', (req, res) => {
  try {
    const { userId, sender, message } = req.body;
    
    let conversation = conversations.find(c => c.userId === userId);
    
    if (!conversation) {
      conversation = {
        id: conversations.length + 1,
        userId: userId,
        userName: 'Mark Jackson Fanshaw',
        userEmail: 'fanshawmarkk@yahoo.com',
        messages: [],
        status: 'open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      conversations.push(conversation);
    }
    
    const newMessage = {
      id: conversation.messages.length + 1,
      sender: sender,
      message: message,
      timestamp: new Date().toISOString(),
      read: sender === 'user' // Admin messages are unread until user sees them
    };
    
    conversation.messages.push(newMessage);
    conversation.updatedAt = new Date().toISOString();
    
    res.json({
      success: true,
      data: newMessage,
      message: 'Message sent'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Mark messages as read
router.patch('/mark-read/:userId', (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const conversation = conversations.find(c => c.userId === userId);
    
    if (conversation) {
      conversation.messages.forEach(msg => {
        if (msg.sender === 'admin') {
          msg.read = true;
        }
      });
    }
    
    res.json({
      success: true,
      message: 'Messages marked as read'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
