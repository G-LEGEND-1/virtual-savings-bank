import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:5001/api';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user?.role === 'admin' ? 0 : 1;
      
      const response = await fetch(`${API_BASE}/notifications/user/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setNotifications(data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user?.role === 'admin' ? 0 : 1;
      
      await fetch(`${API_BASE}/notifications/${id}/read?userId=${userId}`, {
        method: 'PATCH'
      });
      
      // Update local state
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      );
      
      // Show success feedback
      const notification = notifications.find(n => n.id === id);
      if (notification && !notification.isRead) {
        console.log(`✅ Marked notification as read: ${notification.title}`);
      }
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user?.role === 'admin' ? 0 : 1;
      
      await fetch(`${API_BASE}/notifications/mark-all-read/${userId}`, {
        method: 'PATCH'
      });
      
      // Update all notifications to read
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      
      alert('✅ All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const getFilteredNotifications = () => {
    switch (activeFilter) {
      case 'unread':
        return notifications.filter(notif => !notif.isRead);
      case 'read':
        return notifications.filter(notif => notif.isRead);
      default:
        return notifications;
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'transaction':
        return 'fas fa-money-bill-wave text-green-600';
      case 'message':
        return 'fas fa-envelope text-blue-600';
      case 'welcome':
        return 'fas fa-user-plus text-purple-600';
      default:
        return 'fas fa-bell text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-3xl text-blue-600 mb-4"></i>
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="mr-3 text-gray-600 hover:text-gray-800"
              >
                <i className="fas fa-arrow-left"></i>
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Notifications</h1>
                <p className="text-gray-600 text-sm">
                  {notifications.length} total • {unreadCount} unread
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  <i className="fas fa-check-double mr-1"></i>
                  Mark all read
                </button>
              )}
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

      {/* Filter Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex">
            <button
              onClick={() => setActiveFilter('all')}
              className={`flex-1 py-3 text-sm font-medium ${activeFilter === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('unread')}
              className={`flex-1 py-3 text-sm font-medium ${activeFilter === 'unread' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
            >
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </button>
            <button
              onClick={() => setActiveFilter('read')}
              className={`flex-1 py-3 text-sm font-medium ${activeFilter === 'read' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
            >
              Read
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-bell-slash text-2xl text-gray-400"></i>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">No notifications</h3>
            <p className="text-gray-600">
              {activeFilter === 'all' 
                ? "You don't have any notifications yet."
                : activeFilter === 'unread'
                ? "You don't have any unread notifications."
                : "You don't have any read notifications."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg shadow border ${notification.isRead ? 'border-gray-200' : 'border-blue-200 bg-blue-50'} hover:shadow-md transition-shadow`}
              >
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${notification.isRead ? 'bg-gray-100' : 'bg-blue-100'}`}>
                        <i className={`${getNotificationIcon(notification.type)} ${notification.isRead ? 'text-gray-500' : ''}`}></i>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className={`font-bold ${notification.isRead ? 'text-gray-800' : 'text-gray-900'}`}>
                            {notification.title}
                          </h3>
                          <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                            {notification.displayTimestamp || 
                              (notification.customDate 
                                ? `${notification.customDate} ${notification.customTime || ''} ${notification.customYear || ''}`
                                : new Date(notification.timestamp).toLocaleString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })
                              )}
                          </span>
                        </div>
                        
                        <p className={`text-sm ${notification.isRead ? 'text-gray-600' : 'text-gray-700'}`}>
                          {notification.content}
                        </p>
                        
                        {notification.type && (
                          <span className="inline-block mt-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                            <i className={`${getNotificationIcon(notification.type)} mr-1`}></i>
                            {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                          </span>
                        )}
                        
                        {/* Custom timestamp indicator */}
                        {notification.customDate && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full">
                              <i className="fas fa-calendar-alt mr-1"></i>
                              Custom Date: {notification.customDate} {notification.customTime} {notification.customYear}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* REMOVED DELETE BUTTON - Only show mark as read button for unread */}
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="ml-2 w-8 h-8 rounded-full hover:bg-green-100 flex items-center justify-center"
                        title="Mark as read"
                      >
                        <i className="fas fa-check text-green-600 text-sm"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* REMOVED STATS SECTION COMPLETELY */}
      </div>
    </div>
  );
};

export default NotificationsPage;
