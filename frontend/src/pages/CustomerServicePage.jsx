import React, { useState, useEffect, useRef } from 'react';
import MobileTabs from "../components/Shared/MobileTabs";
import Footer from "../components/Shared/Footer";
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:5001/api';

const CustomerServicePage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/');
      return;
    }
    
    fetchConversation(user.id);
  }, [navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversation = async (userId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/customer-service/user/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setMessages(data.data.messages || []);
      }
    } catch (error) {
      console.error('Failed to fetch conversation:', error);
    }
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    
    const user = JSON.parse(localStorage.getItem('user'));
    setSending(true);
    
    try {
      const response = await fetch(`${API_BASE}/customer-service/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          sender: 'user',
          message: newMessage.trim()
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessages(prev => [...prev, data.data]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    }
    setSending(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center"> pb-16 pb-14
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading customer service...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50"> pb-16 pb-14
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="mr-3 text-gray-600 hover:text-gray-800"
              >
                <i className="fas fa-arrow-left"></i>
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Customer Support</h1>
                <p className="text-gray-600 text-sm">24/7 Virtual Banking Support</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => fetchConversation(JSON.parse(localStorage.getItem('user')).id)}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                <i className="fas fa-sync-alt mr-1"></i>
                Refresh
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-3 py-1 bg-gray-800 text-white rounded text-sm hover:bg-gray-900"
              >
                <i className="fas fa-home mr-1"></i>
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
n      {/* Mobile Tabs */}
      <MobileTabs />
        {/* Chat Container */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: '70vh' }}>
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 text-white">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
                <i className="fas fa-headset text-green-600"></i>
              </div>
              <div>
                <h2 className="font-bold">Virtual Bank Support</h2>
                <p className="text-green-100 text-sm">Typically replies within 5 minutes</p>
              </div>
              <div className="ml-auto">
                <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
                <span className="text-green-100 text-xs">Online</span>
              </div>
            </div>
          </div>
          
          {/* Messages Area */}
          <div className="p-4 overflow-y-auto" style={{ height: 'calc(70vh - 140px)' }}>
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-comments text-2xl text-gray-400"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Start a conversation</h3>
                <p className="text-gray-600">Send a message to our support team</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md rounded-lg p-3 ${msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      <div className="text-sm">{msg.message}</div>
                      <div className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                        {formatTime(msg.timestamp)}
                        {msg.sender === 'admin' && !msg.read && (
                          <span className="ml-2">
                            <i className="fas fa-check text-gray-400"></i>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          
          {/* Input Area */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-1">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  rows="2"
                  disabled={sending}
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={sending || !newMessage.trim()}
                className={`ml-3 px-6 py-3 rounded-lg font-medium ${sending || !newMessage.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {sending ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Sending...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane mr-2"></i>
                    Send
                  </>
                )}
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Press Enter to send • Shift+Enter for new line
            </div>
          </div>
        </div>
        
        {/* Quick Help Topics */}
        <div className="mt-6">
          <h3 className="font-bold text-gray-800 mb-3">Quick Help Topics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => setNewMessage('I need help with my Safe Box withdrawal process.')}
              className="bg-white border border-gray-300 rounded-lg p-3 text-left hover:bg-gray-50"
            >
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-2">
                  <i className="fas fa-vault text-yellow-600"></i>
                </div>
                <span className="font-medium">Safe Box Help</span>
              </div>
              <p className="text-sm text-gray-600">Withdrawals, deposits, and security</p>
            </button>
            
            <button
              onClick={() => setNewMessage('I have questions about my transaction history from 2008-2010.')}
              className="bg-white border border-gray-300 rounded-lg p-3 text-left hover:bg-gray-50"
            >
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                  <i className="fas fa-exchange-alt text-blue-600"></i>
                </div>
                <span className="font-medium">Transaction History</span>
              </div>
              <p className="text-sm text-gray-600">Questions about past transactions</p>
            </button>
            
            <button
              onClick={() => setNewMessage('I need assistance with my debit card.')}
              className="bg-white border border-gray-300 rounded-lg p-3 text-left hover:bg-gray-50"
            >
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-2">
                  <i className="fas fa-credit-card text-purple-600"></i>
                </div>
                <span className="font-medium">Card Services</span>
              </div>
              <p className="text-sm text-gray-600">Card issues, limits, and replacements</p>
            </button>
          </div>
        </div>
        
        {/* Contact Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-bold text-gray-800 mb-2">Other Ways to Contact Us</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <i className="fas fa-phone text-blue-600"></i>
              </div>
              <div>
                <div className="font-medium">Phone Support</div>
                <div className="text-sm text-gray-600">1-800-VIRTUAL</div>
                <div className="text-xs text-gray-500">24/7 toll-free</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <i className="fas fa-envelope text-green-600"></i>
              </div>
              <div>
                <div className="font-medium">Email</div>
                <div className="text-sm text-gray-600">support@virtualbank.com</div>
                <div className="text-xs text-gray-500">Response within 24h</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                <i className="fas fa-map-marker-alt text-purple-600"></i>
              </div>
              <div>
                <div className="font-medium">Headquarters</div>
                <div className="text-sm text-gray-600">123 Wall Street, NYC</div>
                <div className="text-xs text-gray-500">By appointment only</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerServicePage;
 
      {/* Footer */}
      <Footer />
