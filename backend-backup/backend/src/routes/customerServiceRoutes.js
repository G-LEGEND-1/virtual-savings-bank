const express = require('express');
const router = express.Router();

// In-memory storage for customer service messages
let conversations = [];

// Get all conversations (admin only)
router.get('/conversations', (req, res) => {
  res.json({
    success: true,
    data: conversations
  });
});

// Get conversation for a specific user
router.get('/conversation/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  let conversation = conversations.find(c => c.userId === userId);
  
  if (!conversation) {
    // Create a new conversation if none exists
    conversation = {
      id: conversations.length + 1,
      userId: userId,
      messages: [],
      status: 'open',
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    conversations.push(conversation);
  }
  
  res.json({
    success: true,
    data: conversation
  });
});

// Send a message
router.post('/message', (req, res) => {
  try {
    const { userId, sender, message } = req.body;
    
    let conversation = conversations.find(c => c.userId === parseInt(userId));
    
    if (!conversation) {
      // Create new conversation
      conversation = {
        id: conversations.length + 1,
        userId: parseInt(userId),
        messages: [],
        status: 'open',
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      conversations.push(conversation);
    }
    
    // Add message to conversation
    const newMessage = {
      id: conversation.messages.length + 1,
      sender: sender,
      message: message,
      timestamp: new Date().toISOString()
    };
    
    conversation.messages.push(newMessage);
    conversation.lastUpdated = new Date().toISOString();
    
    res.json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage
    });
    
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
});

// Close a conversation
router.patch('/conversation/:userId/close', (req, res) => {
  const userId = parseInt(req.params.userId);
  const conversation = conversations.find(c => c.userId === userId);
  
  if (conversation) {
    conversation.status = 'closed';
    conversation.lastUpdated = new Date().toISOString();
    
    res.json({
      success: true,
      message: 'Conversation closed'
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Conversation not found'
    });
  }
});

module.exports = router;
