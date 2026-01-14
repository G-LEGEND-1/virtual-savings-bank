import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileTabs from '../components/Shared/MobileTabs';

const API_BASE = 'https://virtual-savings-bank-backend.onrender.com/api';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedNotifications, setExpandedNotifications] = useState({});
  const [markingAllAsRead, setMarkingAllAsRead] = useState(false);

  useEffect(() => {
    const getUser = () => {
      try {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    };

    const user = getUser();
    if (!user) {
      navigate('/');
      return;
    }
    
    fetchNotifications(user.id);
  }, [navigate]);

  const fetchNotifications = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/notifications/user/${userId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Sort by timestamp (newest first)
        const sortedNotifications = data.data.sort((a, b) => 
          new Date(b.timestamp) - new Date(a.timestamp)
        );
        setNotifications(sortedNotifications);
      } else {
        throw new Error(data.message || 'Failed to load notifications');
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setError(error.message);
      
      // Fallback data to prevent blank screen
      const fallbackNotifications = [
        {
          id: 1,
          userId: 1,
          type: 'urgent',
          title: 'FINAL URGENT NOTICE - Settlement',
          content: 'After 11 years of weekly accruals, compounded interest, penalties, and accumulated fees on your Save Box "Sean\'s 2008," the final settlement amount has been calculated as $209,000.',
          isRead: false,
          timestamp: '2021-03-01T09:00:00Z',
          icon: 'fas fa-exclamation-triangle'
        },
        {
          id: 2,
          userId: 1,
          type: 'info',
          title: 'Happy Birthday!',
          content: 'Happy Birthday, Fanshaw! 🎉 Wishing you good health, happiness, and success From all of us at VSB Bank.',
          isRead: false,
          timestamp: '2020-08-15T10:00:00Z',
          icon: 'fas fa-birthday-cake'
        },
        {
          id: 3,
          userId: 1,
          type: 'safebox',
          title: 'Safe Box Deposit Confirmed',
          content: '$4,000,000.00 has been securely deposited in your Safe Box #VSB-SAFE001.',
          isRead: true,
          timestamp: '2008-03-04T10:30:00Z',
          icon: 'fas fa-vault'
        }
      ];
      setNotifications(fallbackNotifications);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(`${API_BASE}/notifications/${id}/read?userId=${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        setNotifications(prev =>
          prev.map(notif =>
            notif.id === id ? { ...notif, isRead: true } : notif
          )
        );
      }
    } catch (error) {
      console.error('Failed to mark as read:', error);
      // Still update UI even if API call fails
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      );
    }
  };

  const markAllAsRead = async () => {
    if (notifications.filter(n => !n.isRead).length === 0) return;
    
    setMarkingAllAsRead(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(`${API_BASE}/notifications/mark-all-read/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        setNotifications(prev =>
          prev.map(notif => ({ ...notif, isRead: true }))
        );
        alert('All notifications marked as read');
      }
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      // Still update UI
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      alert('Notifications marked as read (offline)');
    } finally {
      setMarkingAllAsRead(false);
    }
  };

  const toggleNotificationExpansion = (notificationId) => {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification && !notification.isRead) {
      markAsRead(notificationId);
    }

    setExpandedNotifications(prev => ({
      ...prev,
      [notificationId]: !prev[notificationId]
    }));
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

  const getNotificationIcon = (notification) => {
    if (notification.icon) {
      return notification.icon;
    }
    
    const iconMap = {
      transaction: 'fas fa-money-bill-wave',
      safebox: 'fas fa-vault',
      welcome: 'fas fa-user-plus',
      info: 'fas fa-info-circle',
      message: 'fas fa-envelope',
      urgent: 'fas fa-exclamation-triangle',
      warning: 'fas fa-exclamation-circle'
    };
    
    return iconMap[notification.type] || 'fas fa-bell';
  };

  const getNotificationColor = (notification) => {
    const colorMap = {
      transaction: 'text-green-600 bg-green-100',
      safebox: 'text-yellow-600 bg-yellow-100',
      welcome: 'text-blue-600 bg-blue-100',
      info: 'text-purple-600 bg-purple-100',
      message: 'text-indigo-600 bg-indigo-100',
      urgent: 'text-red-600 bg-red-100',
      warning: 'text-orange-600 bg-orange-100'
    };
    
    return colorMap[notification.type] || 'text-gray-600 bg-gray-100';
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const filteredNotifications = getFilteredNotifications();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pb-14">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="mr-3 text-gray-600 hover:text-gray-800"
                >
                  <i className="fas fa-arrow-left"></i>
                </button>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Notifications</h1>
                  <p className="text-gray-600 text-sm">Using offline mode</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Tabs */}
        <MobileTabs />

        {/* Error Message */}
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <i className="fas fa-exclamation-triangle text-red-600 text-lg mr-3"></i>
              <div>
                <h3 className="font-bold text-red-700">Connection Error</h3>
                <p className="text-red-600 text-sm">Showing offline notifications. {error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-14">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="mr-3 text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100"
              >
                <i className="fas fa-arrow-left"></i>
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Notifications</h1>
                <p className="text-gray-600 text-sm">
                  <span className={`font-medium ${unreadCount > 0 ? 'text-blue-600' : ''}`}>
                    {unreadCount}
                  </span> unread • {notifications.length} total
                </p>
              </div>
            </div>
            
            <button
              onClick={markAllAsRead}
              disabled={unreadCount === 0 || markingAllAsRead}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                unreadCount === 0 || markingAllAsRead
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {markingAllAsRead ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Processing...
                </>
              ) : (
                <>
                  <i className="fas fa-check-double mr-2"></i>
                  Mark All Read
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Tabs */}
      <MobileTabs />

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
          <div className="flex">
            <button
              onClick={() => setActiveFilter('all')}
              className={`flex-1 py-3 text-center transition-colors ${
                activeFilter === 'all' 
                  ? 'bg-blue-600 text-white font-medium' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('unread')}
              className={`flex-1 py-3 text-center transition-colors ${
                activeFilter === 'unread' 
                  ? 'bg-blue-600 text-white font-medium' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setActiveFilter('read')}
              className={`flex-1 py-3 text-center transition-colors ${
                activeFilter === 'read' 
                  ? 'bg-blue-600 text-white font-medium' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Read
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                  !notification.isRead ? 'bg-blue-50 hover:bg-blue-100' : ''
                }`}
                onClick={() => toggleNotificationExpansion(notification.id)}
              >
                <div className="flex items-start">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${getNotificationColor(notification)}`}>
                    <i className={`${getNotificationIcon(notification)}`}></i>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-gray-800 truncate">{notification.title}</h3>
                      <div className="flex items-center space-x-2 flex-shrink-0 pl-2">
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                        )}
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {formatDate(notification.timestamp)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Short preview */}
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {notification.content.length > 100 
                        ? `${notification.content.substring(0, 100)}...`
                        : notification.content}
                    </p>

                    {/* Show/hide arrow indicator */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-xs text-gray-500">
                        <i className="fas fa-info-circle mr-1"></i>
                        Click to {expandedNotifications[notification.id] ? 'collapse' : 'expand'}
                      </div>
                      <i className={`fas fa-chevron-${expandedNotifications[notification.id] ? 'up' : 'down'} text-gray-400 text-xs`}></i>
                    </div>

                    {/* Full Message (shown when expanded) */}
                    {expandedNotifications[notification.id] && (
                      <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded">
                        <h4 className="font-bold text-gray-700 text-sm mb-2">Full Message:</h4>
                        <p className="text-gray-600 text-sm whitespace-pre-line">
                          {notification.content}
                        </p>
                        
                        {/* Show notification details */}
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                            <div>
                              <span className="font-medium">Type:</span> {notification.type}
                            </div>
                            <div>
                              <span className="font-medium">Date:</span> {formatDate(notification.timestamp)}
                            </div>
                            <div>
                              <span className="font-medium">Status:</span> 
                              <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${notification.isRead ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                {notification.isRead ? 'Read' : 'Unread'}
                              </span>
                            </div>
                            <div className="truncate">
                              <span className="font-medium">ID:</span> {notification.id}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-bell-slash text-2xl text-gray-400"></i>
              </div>
              <h3 className="font-bold text-gray-600 mb-1">No notifications</h3>
              <p className="text-sm">You're all caught up!</p>
            </div>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-start">
            <i className="fas fa-info-circle text-blue-500 text-lg mr-3 mt-1"></i>
            <div>
              <h4 className="font-bold text-gray-700 text-sm mb-1">About Notifications</h4>
              <p className="text-gray-600 text-xs">
                • Click on any notification to expand and see full details<br/>
                • Unread notifications have a blue dot indicator<br/>
                • Notifications are automatically cleared after 30 days
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS for line clamp */}
      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default NotificationsPage;