import React, { useState, useEffect, useRef } from 'react';

const API_BASE = 'http://localhost:5001/api';

const CustomerService = ({ isOpen, onClose, userType = 'user' }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user?.role === 'admin' ? 0 : 1;
      
      const response = await fetch(`${API_BASE}/customer-service/conversation/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setMessages(data.data.messages || []);
        console.log(`💬 Loaded ${data.data.messages?.length || 0} messages`);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      // Initialize with sample messages if API fails
      setMessages([
        {
          id: 1,
          sender: 'admin',
          message: 'Hello! How can I help you today?',
          timestamp: new Date().toISOString(),
          displayTimestamp: 'Just now'
        }
      ]);
    }
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.role === 'admin' ? 0 : 1;
    const sender = user?.role === 'admin' ? 'admin' : 'user';
    
    // Add message immediately to UI for better UX
    const tempMessage = {
      id: messages.length + 1,
      sender: sender,
      message: newMessage,
      timestamp: new Date().toISOString(),
      displayTimestamp: 'Sending...'
    };
    
    setMessages(prev => [...prev, tempMessage]);
    const messageToSend = newMessage;
    setNewMessage('');
    
    try {
      const response = await fetch(`${API_BASE}/customer-service/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          sender: sender,
          message: messageToSend
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update the temporary message with real data
        setMessages(prev => 
          prev.map(msg => 
            msg.id === tempMessage.id 
              ? { ...msg, ...data.data, displayTimestamp: 'Just now' }
              : msg
          )
        );
        console.log('✅ Message sent successfully');
      } else {
        // Show error
        alert('Failed to send message');
        // Remove the temporary message
        setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
      // Remove the temporary message
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
      
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return timestamp;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              <i className="fas fa-headset mr-2 text-green-600"></i>
              {userType === 'admin' ? 'Admin Support' : 'Customer Support'}
            </h2>
            <p className="text-gray-600 text-sm">
              {userType === 'admin' ? 'Support Dashboard' : 'Live Chat - 24/7 Support'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {loading ? (
            <div className="text-center py-8">
              <i className="fas fa-spinner fa-spin text-2xl text-blue-600 mb-2"></i>
              <p className="text-gray-600">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-comments text-2xl text-blue-600"></i>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Start a conversation</h3>
              <p className="text-gray-600">Send a message to our support team</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === (userType === 'admin' ? 'admin' : 'user') ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md rounded-2xl p-3 ${msg.sender === (userType === 'admin' ? 'admin' : 'user')
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <div className="flex items-center mb-1">
                      <span className={`text-xs font-semibold ${msg.sender === (userType === 'admin' ? 'admin' : 'user') ? 'text-blue-200' : 'text-gray-500'}`}>
                        {msg.sender === 'admin' ? 'Support Agent' : 'You'}
                      </span>
                      <span className={`text-xs ml-2 ${msg.sender === (userType === 'admin' ? 'admin' : 'user') ? 'text-blue-200' : 'text-gray-500'}`}>
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm mb-1">{msg.message}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="sticky bottom-0 bg-white border-t p-4">
          <div className="flex space-x-2">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="flex-1 border border-gray-300 rounded-lg p-3 text-sm resize-none"
              rows="2"
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim() || loading}
              className={`self-end px-4 py-3 rounded-lg font-semibold ${!newMessage.trim() || loading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Press Enter to send • Shift+Enter for new line
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerService;
