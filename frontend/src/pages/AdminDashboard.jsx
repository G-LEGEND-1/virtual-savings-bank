import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:5001/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    
    fetchConversations();
  }, [navigate]);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/customer-service/conversations`);
      const data = await response.json();
      
      if (data.success) {
        setConversations(data.data);
        if (data.data.length > 0 && !selectedConversation) {
          setSelectedConversation(data.data[0]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    }
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    setSending(true);
    
    try {
      const response = await fetch(`${API_BASE}/customer-service/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedConversation.userId,
          sender: 'admin',
          message: newMessage.trim()
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update local state
        const updatedConversations = conversations.map(conv => {
          if (conv.id === selectedConversation.id) {
            return {
              ...conv,
              messages: [...conv.messages, data.data],
              updatedAt: new Date().toISOString()
            };
          }
          return conv;
        });
        
        setConversations(updatedConversations);
        setSelectedConversation(updatedConversations.find(c => c.id === selectedConversation.id));
        setNewMessage('');
        
        // Mark messages as read for user
        await fetch(`${API_BASE}/customer-service/mark-read/${selectedConversation.userId}`, {
          method: 'PATCH'
        });
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

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getUnreadCount = (conversation) => {
    return conversation.messages.filter(msg => msg.sender === 'user' && !msg.read).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <i className="fas fa-university text-xl text-blue-900 mr-2"></i>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Admin Support Dashboard</h1>
                <p className="text-gray-600 text-sm">Customer Service Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={fetchConversations}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                <i className="fas fa-sync-alt mr-1"></i>
                Refresh
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('user');
                  window.location.href = '/';
                }}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Conversations List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-bold text-gray-800">Customer Conversations</h3>
              <p className="text-gray-600 text-sm">{conversations.length} active</p>
            </div>
            
            <div className="divide-y divide-gray-200 max-h-[70vh] overflow-y-auto">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${selectedConversation?.id === conversation.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-gray-800">{conversation.userName}</h4>
                      <p className="text-gray-600 text-sm truncate">{conversation.userEmail}</p>
                    </div>
                    {getUnreadCount(conversation) > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {getUnreadCount(conversation)}
                      </span>
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-500 mb-1">
                    Last updated: {formatDate(conversation.updatedAt)}
                  </div>
                  
                  {conversation.messages.length > 0 && (
                    <div className="text-sm text-gray-600 truncate">
                      {conversation.messages[conversation.messages.length - 1].message.substring(0, 60)}...
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      conversation.status === 'open' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {conversation.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      {conversation.messages.length} messages
                    </span>
                  </div>
                </button>
              ))}
              
              {conversations.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  <i className="fas fa-comments text-2xl mb-2"></i>
                  <p>No conversations yet</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Chat Area */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow-lg overflow-hidden">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
                        <i className="fas fa-user text-green-600"></i>
                      </div>
                      <div>
                        <h2 className="font-bold">{selectedConversation.userName}</h2>
                        <p className="text-green-100 text-sm">{selectedConversation.userEmail}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">Customer since 2008</div>
                      <div className="text-xs text-green-100">Account: VSB20240012345</div>
                    </div>
                  </div>
                </div>
                
                {/* Messages Area */}
                <div className="p-4 overflow-y-auto" style={{ height: '50vh' }}>
                  {selectedConversation.messages.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fas fa-comments text-2xl text-gray-400"></i>
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 mb-2">No messages yet</h3>
                      <p className="text-gray-600">Start a conversation with the customer</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedConversation.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs md:max-w-md rounded-lg p-3 ${msg.sender === 'admin'
                              ? 'bg-green-600 text-white rounded-br-none'
                              : 'bg-gray-100 text-gray-800 rounded-bl-none'
                            }`}
                          >
                            <div className="text-sm">{msg.message}</div>
                            <div className={`text-xs mt-1 ${msg.sender === 'admin' ? 'text-green-200' : 'text-gray-500'}`}>
                              {formatTime(msg.timestamp)}
                              {msg.sender === 'user' && !msg.read && (
                                <span className="ml-2 text-blue-500">
                                  <i className="fas fa-circle text-xs"></i>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
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
                        placeholder="Type your reply here..."
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
                          Send Reply
                        </>
                      )}
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Press Enter to send • Customer will receive notification
                  </div>
                </div>
              </>
            ) : (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-headset text-3xl text-gray-400"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Select a Conversation</h3>
                <p className="text-gray-600 mb-4">Choose a customer conversation from the list to start replying</p>
                <button
                  onClick={fetchConversations}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  <i className="fas fa-sync-alt mr-2"></i>
                  Refresh Conversations
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Customer Info Panel (when conversation is selected) */}
        {selectedConversation && (
          <div className="mt-6 bg-white rounded-lg shadow p-4">
            <h3 className="font-bold text-gray-800 mb-3">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-500">Account Balance</div>
                <div className="font-bold text-green-600">$204,000.00</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Safe Box Balance</div>
                <div className="font-bold text-yellow-600">$4,000,000.00</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Account Status</div>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <i className="fas fa-check-circle mr-1"></i>
                  Active since 2008
                </span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="font-bold text-gray-800 mb-2">Recent Activity</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center">
                  <i className="fas fa-circle text-xs text-blue-500 mr-2"></i>
                  Last login: Today, 10:30 AM
                </li>
                <li className="flex items-center">
                  <i className="fas fa-circle text-xs text-green-500 mr-2"></i>
                  Last transaction: Jan 5, 2024 ($249.99)
                </li>
                <li className="flex items-center">
                  <i className="fas fa-circle text-xs text-purple-500 mr-2"></i>
                  Customer since: February 2008
                </li>
                <li className="flex items-center">
                  <i className="fas fa-circle text-xs text-yellow-500 mr-2"></i>
                  Support tickets: 3 (2 resolved)
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
