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
        timestamp: '2026-01-09T10:30:00Z',
        read: true
      },
      {
        id: 2,
        sender: 'customer service ',
        message: 'hello Mr Fanshaw kindly provide us your full name and save box numner.',
        timestamp: '2026-01-09T10:35:00Z',
        read: true
      },
      {
        id: 3,
        sender: 'user',
        message: 'Safe Box #VSB-SAFE166, I want to withdraw my balance.',
        timestamp: '2026-01-09T10:40:00Z',
        read: true
      },
      {
        id: 4,
        sender: 'customer service',
        message: 'thank you for your request we will send you a mail as soon as we check your infirmation .',
        timestamp: '2026-01-09T10:45:00Z',
        read: false
      },
      {
        id: 5,
        sender: 'user',
        message: 'Hello there',
        timestamp: '2026-01-09T22:52:00Z',
        read: true
      },
      {
        id: 6,
        sender: 'user',
        message: 'How can I withdraw money sir',
        timestamp: '2026-01-09T22:52:00Z',
        read: true
      },
      {
        id: 7,
        sender: 'user',
        message: 'Pls. Check out the detail and let us know the pending tax etc',
        timestamp: '2026-01-09T23:11:00Z',
        read: true
      },
      {
        id: 8,
        sender: 'user',
        message: 'Sharon is waiting at your branch office in Texas',
        timestamp: '2026-01-09T23:13:00Z',
        read: true
      },
      {
        id: 9,
        sender: 'user',
        message: 'Her phone',
        timestamp: '2026-01-09T23:16:00Z',
        read: true
      },
      {
        id: 10,
        sender: 'user',
        message: '+16056558277',
        timestamp: '2026-01-09T23:16:00Z',
        read: true
      },
      {
        id: 11,
        sender: 'user',
        message: 'Name Mark Jackson Fenshaw',
        timestamp: '2026-01-09T23:25:00Z',
        read: true
      },
      {
        id: 12,
        sender: 'user',
        message: 'VSB-SAFE 001',
        timestamp: '2026-01-09T23:27:00Z',
        read: true
      },
      {
        id: 13,
        sender: 'customer service',
        message: 'Dear Mr. Fenshaw,\nWe sincerely apologize for any inconvenience caused and appreciate your patience. Please be advised that your SafeBox account is currently under review. Our team has forwarded your SafeBox ID to the Administration Department for verification, as the system currently indicates that the SafeBox is inactive.\nKindly allow 2–3 business days for the verification process. Our Customer Service team will notify you immediately once the administrator has completed the cross-check and your account status has been updated.\nWe value your trust in our services and remain committed to ensuring a secure and seamless banking experience for you.\nThank you for your understanding.',
        timestamp: '2026-01-10T02:05:00Z',
        read: false
      }
    ],
    status: 'open',
    createdAt: '2026-01-09T10:30:00Z',
    updatedAt: '2026-01-10T02:05:00Z'
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