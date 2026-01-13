import React, { useState, useEffect } from 'react';

const UserMessages = () => {
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(2);

  const demoMessages = [
    {
      id: 1,
      subject: 'New Deposit Received',
      content: 'A deposit of $500.00 has been credited to your account from Chase Bank.',
      type: 'transaction',
      date: 'Dec 15, 2023',
      time: '14:30',
      year: '2023',
      isRead: false,
      bank: 'Chase Bank',
      sender: 'John Doe',
      amount: 500.00
    },
    {
      id: 2,
      subject: 'Account Security Alert',
      content: 'We detected a login from a new device. If this was not you, please contact support immediately.',
      type: 'security',
      date: 'Dec 14, 2023',
      time: '11:45',
      year: '2023',
      isRead: true
    },
    {
      id: 3,
      subject: 'Welcome to Virtual Bank!',
      content: 'Thank you for choosing Virtual Bank. Your account is now active and ready to use.',
      type: 'welcome',
      date: 'Dec 10, 2023',
      time: '09:15',
      year: '2023',
      isRead: true
    }
  ];

  useEffect(() => {
    setMessages(demoMessages);
    
    const unread = demoMessages.filter(msg => !msg.isRead).length;
    setUnreadCount(unread);
    
    if (window.updateMessageBadge) {
      window.updateMessageBadge(unread);
    }
  }, []);

  const markAsRead = (messageId) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, isRead: true } : msg
      )
    );
    
    const newUnread = messages.filter(msg => msg.id !== messageId && !msg.isRead).length;
    setUnreadCount(newUnread);
    
    if (window.updateMessageBadge) {
      window.updateMessageBadge(newUnread);
    }
  };

  const formatMessageTime = (message) => {
    return `${message.date} ${message.time} • ${message.year}`;
  };

  const getMessageIcon = (type) => {
    switch(type) {
      case 'transaction':
        return 'fa-money-bill-wave';
      case 'security':
        return 'fa-shield-alt';
      case 'welcome':
        return 'fa-handshake';
      default:
        return 'fa-envelope';
    }
  };

  const getMessageColor = (type) => {
    switch(type) {
      case 'transaction':
        return 'bg-green-100 text-green-800';
      case 'security':
        return 'bg-red-100 text-red-800';
      case 'welcome':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Messages & Notifications</h2>
            <p className="opacity-90">Stay updated with your account activity</p>
          </div>
          {unreadCount > 0 && (
            <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold">
              {unreadCount} Unread
            </div>
          )}
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {messages.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <i className="fas fa-envelope-open-text text-4xl mb-4"></i>
            <p className="text-lg">No messages yet</p>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id}
              className={`p-6 hover:bg-gray-50 transition-colors ${!message.isRead ? 'bg-blue-50' : ''}`}
              onClick={() => !message.isRead && markAsRead(message.id)}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getMessageColor(message.type)}`}>
                  <i className={`fas ${getMessageIcon(message.type)} text-xl`}></i>
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-800 text-lg">
                      {message.subject}
                      {!message.isRead && (
                        <span className="ml-2 inline-block w-3 h-3 bg-blue-500 rounded-full"></span>
                      )}
                    </h3>
                    <span className="text-gray-500 text-sm">
                      {formatMessageTime(message)}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3">
                    {message.content}
                  </p>
                  
                  {message.type === 'transaction' && message.bank && (
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Bank:</span>
                          <span className="ml-2 font-semibold">{message.bank}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Sender:</span>
                          <span className="ml-2 font-semibold">{message.sender}</span>
                        </div>
                        {message.amount && (
                          <div className="col-span-2">
                            <span className="text-gray-500">Amount:</span>
                            <span className="ml-2 font-semibold text-green-600">
                              ${message.amount.toFixed(2)} USD
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center mt-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getMessageColor(message.type)}`}>
                      {message.type.charAt(0).toUpperCase() + message.type.slice(1)}
                    </span>
                    
                    {!message.isRead && (
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
                        Mark as read →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {messages.length > 0 && (
        <div className="bg-gray-50 p-4 text-center">
          <button className="text-blue-600 hover:text-blue-800 font-semibold">
            <i className="fas fa-history mr-2"></i>
            View All Messages
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMessages;
