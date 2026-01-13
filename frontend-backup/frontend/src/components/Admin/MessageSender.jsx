import React, { useState } from 'react';

const MessageSender = ({ onSend }) => {
  const [message, setMessage] = useState({
    subject: '',
    content: '',
    userId: '1',
    useCustomDate: false,
    customDate: new Date().toISOString().split('T')[0],
    customTime: '14:30',
    customYear: new Date().getFullYear().toString()
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const messageData = {
      ...message,
      customDate: message.useCustomDate ? message.customDate : null,
      customTime: message.useCustomDate ? message.customTime : null,
      customYear: message.useCustomDate ? message.customYear : null
    };

    onSend(messageData);
    
    setMessage({
      subject: '',
      content: '',
      userId: '1',
      useCustomDate: false,
      customDate: new Date().toISOString().split('T')[0],
      customTime: '14:30',
      customYear: new Date().getFullYear().toString()
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">📨 Send Message to User</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Select User</label>
          <select
            value={message.userId}
            onChange={(e) => setMessage({...message, userId: e.target.value})}
            className="w-full border border-gray-300 rounded-lg p-3"
          >
            <option value="1">John Client (user@example.com)</option>
            <option value="2">Jane Doe (jane.doe@email.com)</option>
            <option value="3">Michael Smith (michael@domain.com)</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Subject</label>
          <input
            type="text"
            value={message.subject}
            onChange={(e) => setMessage({...message, subject: e.target.value})}
            className="w-full border border-gray-300 rounded-lg p-3"
            placeholder="Important Account Update"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Message Content</label>
          <textarea
            value={message.content}
            onChange={(e) => setMessage({...message, content: e.target.value})}
            className="w-full border border-gray-300 rounded-lg p-3 h-32"
            placeholder="Type your message here..."
            required
          />
        </div>

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="useCustomDate"
            checked={message.useCustomDate}
            onChange={(e) => setMessage({...message, useCustomDate: e.target.checked})}
            className="mr-2"
          />
          <label htmlFor="useCustomDate" className="text-gray-700">
            Set custom date/time (not real-time)
          </label>
        </div>

        {message.useCustomDate && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={message.customDate}
                onChange={(e) => setMessage({...message, customDate: e.target.value})}
                className="w-full border border-gray-300 rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Time</label>
              <input
                type="time"
                value={message.customTime}
                onChange={(e) => setMessage({...message, customTime: e.target.value})}
                className="w-full border border-gray-300 rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Year</label>
              <input
                type="number"
                value={message.customYear}
                onChange={(e) => setMessage({...message, customYear: e.target.value})}
                className="w-full border border-gray-300 rounded-lg p-3"
                min="2000"
                max="2030"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          <i className="fas fa-paper-plane mr-2"></i>
          Send Message
        </button>
      </form>
    </div>
  );
};

export default MessageSender;
