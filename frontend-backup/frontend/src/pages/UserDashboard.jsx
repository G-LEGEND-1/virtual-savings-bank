import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Shared/Footer';
import ProfileModal from '../components/Shared/ProfileModal';
import SafeBox from '../components/User/SafeBox';
import Card from '../components/User/Card';
import CustomerService from '../components/User/CustomerService';
import HelpCenter from '../components/User/HelpCenter';
import MobileTabs from '../components/Shared/MobileTabs';

const API_BASE = 'http://localhost:5001/api';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSafeBoxModal, setShowSafeBoxModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [showCustomerService, setShowCustomerService] = useState(false);
  const [showHelpCenter, setShowHelpCenter] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [userData, setUserData] = useState({
    fullName: 'Mark Jackson Fanshaw',
    gender: 'Male',
    dateOfBirth: '1956-08-15',
    email: 'fanshawmarkk@yahoo.com',
    accountNumber: 'VSB20240012345',
    routingNumber: '021000021'
  });

  // Load data on mount
  useEffect(() => {
    fetchData();
    
    // Make functions available globally for footer
    window.showProfileModal = () => setShowProfileModal(true);
    window.showSafeBoxModal = () => setShowSafeBoxModal(true);
    window.showCardModal = () => setShowCardModal(true);
    
    return () => {
      window.showProfileModal = null;
      window.showSafeBoxModal = null;
      window.showCardModal = null;
    };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // User ID is 1
      const userId = 1;
      
      // Fetch notifications
      const notifResponse = await fetch(`${API_BASE}/notifications/user/${userId}`);
      const notifData = await notifResponse.json();
      if (notifData.success) {
        setNotifications(notifData.data);
        const unread = notifData.data.filter(n => !n.isRead).length;
        setUnreadNotifications(unread);
      }
      
      // Fetch transactions
      const txResponse = await fetch(`${API_BASE}/transactions/user/${userId}`);
      const txData = await txResponse.json();
      if (txData.success) {
        setTransactions(txData.data);
      }
      
      // Fetch messages
      const msgResponse = await fetch(`${API_BASE}/messages/user/${userId}`);
      const msgData = await msgResponse.json();
      if (msgData.success) {
        setMessages(msgData.data);
      }
      
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
    setLoading(false);
  };

  // Function to mark all notifications as read
  const markAllNotificationsAsRead = async () => {
    try {
      await fetch(`${API_BASE}/notifications/mark-all-read/1`, {
        method: 'PATCH'
      });
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      setUnreadNotifications(0);
      
      console.log('✅ All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  // When user views notifications (clicks bell), mark them as read
  const handleViewNotifications = async () => {
    if (unreadNotifications > 0) {
      await markAllNotificationsAsRead();
    }
    navigate('/notifications');
  };

  const showLocked = (service) => {
    alert(`🔒 ${service}\n\nAccount locked due to tax fee. Please contact support.`);
  };

  const refreshData = () => {
    fetchData();
  };

  // Privacy masking for display
  const maskAccountNumber = (account) => {
    return '******' + account.slice(-5);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        return 'Today';
      } else if (diffDays === 1) {
        return 'Yesterday';
      } else if (diffDays < 7) {
        return `${diffDays} days ago`;
      }
      
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-14">
      {/* Header with Help Center and Notifications */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-3 py-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <i className="fas fa-university text-xl text-blue-900 mr-2"></i>
              <div>
                <h1 className="text-lg font-bold text-gray-800">Virtual Saving Bank</h1>
                <p className="text-gray-600 text-xs">Account: {maskAccountNumber(userData.accountNumber)}</p>
              </div>
            </div>
            
            {/* Help Center and Notification Bell */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setShowHelpCenter(true)}
                className="text-gray-600 hover:text-blue-600 text-sm"
              >
                <i className="fas fa-question-circle"></i>
                <span className="ml-1 hidden sm:inline">Help</span>
              </button>
              
              <button 
                onClick={handleViewNotifications}
                className="relative"
                title="Notifications"
              >
                <i className="fas fa-bell text-gray-600"></i>
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>
              
              <button 
                onClick={() => setShowProfileModal(true)}
                className="relative"
                title="Profile"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <i className="fas fa-user text-white text-sm"></i>
                </div>
              </button>
            </div>
          </div>
          
          {/* Status Bar - Red Inactive */}
          <div className="mt-2">
            <div className="flex items-center bg-red-50 border border-red-200 rounded p-1">
              <i className="fas fa-exclamation-triangle text-red-600 text-xs mr-1"></i>
              <span className="text-red-700 font-medium text-xs">Status: <span className="font-bold">INACTIVE</span></span>
              <button 
                onClick={refreshData}
                className="ml-2 text-xs text-blue-600 hover:text-blue-800"
              >
                <i className="fas fa-sync-alt mr-1"></i>
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tabs */}
      <MobileTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 py-4 mobile-container">
        {loading ? (
          <div className="text-center py-12">
            <i className="fas fa-spinner fa-spin text-3xl text-blue-600 mb-4"></i>
            <p className="text-gray-600">Loading data...</p>
          </div>
        ) : (
          <>
            {/* Home Tab */}
            {activeTab === 'overview' && (
              <>
                {/* Welcome Card with Full Name */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-4 mb-4 shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs opacity-80 mb-1">Welcome back</div>
                      <div className="text-xl font-bold mb-1">{userData.fullName}</div>
                      <div className="text-xs opacity-80">{userData.email}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs opacity-80 mb-1">Total Balance</div>
                      <div className="text-2xl font-bold">
                        {formatCurrency(transactions.reduce((sum, tx) => sum + (tx.type === 'credit' ? tx.amount : -tx.amount), 0) + 5000)}
                      </div>
                      <div className="text-xs opacity-80">Available: {formatCurrency(transactions.reduce((sum, tx) => sum + (tx.type === 'credit' ? tx.amount : -tx.amount), 0) + 4750)}</div>
                    </div>
                  </div>
                </div>

                {/* Notifications Quick View */}
                {unreadNotifications > 0 && (
                  <div 
                    onClick={handleViewNotifications}
                    className="mb-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                          <i className="fas fa-bell text-yellow-600"></i>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800 text-sm">New Notifications</h3>
                          <p className="text-gray-600 text-xs">
                            You have {unreadNotifications} unread notification{unreadNotifications !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <i className="fas fa-chevron-right text-gray-400"></i>
                    </div>
                  </div>
                )}

                {/* Recent Messages */}
                {messages.length > 0 && (
                  <div className="mb-4">
                    <h2 className="text-lg font-bold text-gray-800 mb-3">Recent Messages</h2>
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                      {messages.slice(0, 2).map((msg) => (
                        <div key={msg.id} className="p-3 border-b border-gray-100 hover:bg-gray-50">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-bold text-gray-800 text-sm">{msg.subject}</h3>
                            <span className="text-xs text-gray-500">
                              {msg.displayTimestamp || formatDate(msg.timestamp)}
                            </span>
                          </div>
                          <p className="text-gray-600 text-xs">{msg.content.substring(0, 60)}...</p>
                          <div className="text-xs text-gray-500 mt-1">From: {msg.from || 'Admin'}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button 
                    onClick={() => setShowCardModal(true)}
                    className="bg-white rounded-lg p-3 shadow border border-gray-200 hover:border-blue-300 transition-all"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2 mx-auto">
                      <i className="fas fa-credit-card text-lg text-blue-500"></i>
                    </div>
                    <h3 className="font-bold text-gray-800 text-center text-xs">My Card</h3>
                  </button>

                  <button 
                    onClick={() => setShowSafeBoxModal(true)}
                    className="bg-white rounded-lg p-3 shadow border border-gray-200 hover:border-green-300 transition-all"
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-2 mx-auto">
                      <i className="fas fa-vault text-lg text-green-500"></i>
                    </div>
                    <h3 className="font-bold text-gray-800 text-center text-xs">Safe Box</h3>
                  </button>
                </div>

                {/* Recent Transactions Preview */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-bold text-gray-800">Recent Transactions</h2>
                    <button 
                      onClick={() => setActiveTab('transactions')}
                      className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                    >
                      View All →
                    </button>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    {transactions.slice(0, 3).map((tx) => (
                      <div key={tx.id} className="p-3 border-b border-gray-100 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-2 ${
                              tx.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                              <i className={`fas ${
                                tx.type === 'credit' ? 'fa-arrow-down text-green-600' : 'fa-arrow-up text-red-600'
                              } text-xs`}></i>
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-800 text-xs">
                                {tx.type === 'credit' ? 'Deposit' : 'Payment'}
                              </h3>
                              <p className="text-gray-600 text-xs">
                                {tx.bank} • {tx.displayTimestamp || formatDate(tx.timestamp)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-sm font-bold ${
                              tx.type === 'credit' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                            </div>
                            <div className="text-gray-500 text-xs">
                              ID: {tx.transactionId?.substring(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div>
                <h1 className="text-lg font-bold text-gray-800 mb-4">Transaction History</h1>
                
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-3 border-b border-gray-200 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="font-bold text-gray-800 text-sm">All Transactions</h2>
                        <p className="text-gray-600 text-xs">Account: {maskAccountNumber(userData.accountNumber)}</p>
                      </div>
                      <button 
                        onClick={refreshData}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                      >
                        <i className="fas fa-sync-alt mr-1"></i>
                        Refresh
                      </button>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-gray-200">
                    {transactions.map((tx) => (
                      <div key={tx.id} className="p-3 hover:bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className={`px-2 py-0.5 rounded-full text-xs font-semibold inline-block ${
                              tx.type === 'credit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {tx.type === 'credit' ? 'CREDIT' : 'DEBIT'}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              ID: {tx.transactionId}
                            </div>
                          </div>
                          <div className={`text-lg font-bold ${
                            tx.type === 'credit' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <div className="text-gray-500">Bank</div>
                            <div className="font-medium">{tx.bank}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Sender</div>
                            <div className="font-medium">{tx.sender}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Date & Time</div>
                            <div className="font-medium">{tx.displayTimestamp || `${tx.date} ${tx.time} ${tx.year}`}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Account</div>
                            <div className="font-medium">{tx.accountNumber}</div>
                          </div>
                        </div>
                        
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <div className="text-gray-500 text-xs">Remark</div>
                          <div className="font-medium text-sm">{tx.remark}</div>
                        </div>
                      </div>
                    ))}
                    
                    {transactions.length === 0 && (
                      <div className="p-6 text-center text-gray-500">
                        <i className="fas fa-exchange-alt text-2xl mb-2"></i>
                        <p>No transactions yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <ProfileModal 
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        userData={userData}
        readOnly={true}
      />

      <SafeBox 
        isOpen={showSafeBoxModal}
        onClose={() => setShowSafeBoxModal(false)}
      />

      <Card 
        isOpen={showCardModal}
        onClose={() => setShowCardModal(false)}
      />

      <CustomerService 
        isOpen={showCustomerService}
        onClose={() => setShowCustomerService(false)}
        userType="user"
      />

      <HelpCenter 
        isOpen={showHelpCenter}
        onClose={() => setShowHelpCenter(false)}
        onOpenChat={() => {
          setShowHelpCenter(false);
          setShowCustomerService(true);
        }}
      />

      {/* Support Button (Bottom Right) */}
      <button 
        onClick={() => setShowCustomerService(true)}
        className="fixed bottom-16 right-3 bg-green-600 text-white p-2 rounded-full shadow hover:bg-green-700 z-40"
        title="Customer Support"
      >
        <i className="fas fa-headset text-sm"></i>
      </button>

      {/* Notifications Button (Bottom Right) */}
      <button 
        onClick={handleViewNotifications}
        className="fixed bottom-16 right-12 bg-blue-600 text-white p-2 rounded-full shadow hover:bg-blue-700 z-40"
        title="Notifications"
      >
        <i className="fas fa-bell text-sm"></i>
        {unreadNotifications > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadNotifications}
          </span>
        )}
      </button>

      {/* Refresh Button (Bottom Right) */}
      <button 
        onClick={refreshData}
        className="fixed bottom-16 right-20 bg-purple-600 text-white p-2 rounded-full shadow hover:bg-purple-700 z-40"
        title="Refresh Data"
      >
        <i className="fas fa-sync-alt text-sm"></i>
      </button>

      {/* Logout Button (Bottom Right) */}
      <button 
        onClick={() => {
          localStorage.removeItem('user');
          window.location.href = '/';
        }}
        className="fixed bottom-16 right-28 bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-600 z-40"
        title="Logout"
      >
        <i className="fas fa-sign-out-alt text-sm"></i>
      </button>
    </div>
  );
};

export default UserDashboard;
