import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileTabs from '../components/Shared/MobileTabs';

const API_BASE = 'http://localhost:5001/api';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [userData, setUserData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/');
      return;
    }
    
    fetchDashboardData(user.id);
  }, [navigate]);

  const fetchDashboardData = async (userId) => {
    setLoading(true);
    try {
      // Fetch user profile
      const profileRes = await fetch(`${API_BASE}/profile/${userId}`);
      const profileData = await profileRes.json();
      
      if (profileData.success) {
        setUserData(profileData.data);
      }
      
      // Fetch transactions
      const txRes = await fetch(`${API_BASE}/transactions/user/${userId}`);
      const txData = await txRes.json();
      
      if (txData.success) {
        setTransactions(txData.data.slice(0, 5)); // Show only 5 recent
      }
      
      // Fetch notifications
      const notifRes = await fetch(`${API_BASE}/notifications/user/${userId}`);
      const notifData = await notifRes.json();
      
      if (notifData.success) {
        setNotifications(notifData.data);
      }
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
    setLoading(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const maskAccountNumber = (account) => {
    return '******' + account.slice(-5);
  };

  const getUnreadNotifications = () => {
    return notifications.filter(n => !n.isRead).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your banking dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-14">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-3 py-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <i className="fas fa-university text-xl text-blue-900 mr-2"></i>
              <div>
                <h1 className="text-lg font-bold text-gray-800">Virtual Savings Bank</h1>
                <p className="text-gray-600 text-xs">
                  Account: {maskAccountNumber(userData?.accountNumber || '')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => navigate('/notifications')}
                className="relative"
                title="Notifications"
              >
                <i className="fas fa-bell text-gray-600"></i>
                {getUnreadNotifications() > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {getUnreadNotifications()}
                  </span>
                )}
              </button>
              
              <button 
                onClick={() => navigate('/profile')}
                className="relative"
                title="Profile"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <i className="fas fa-user text-white text-sm"></i>
                </div>
              </button>
            </div>
          </div>
          
          {/* Status Bar */}
          <div className="mt-2">
            <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded p-1">
              <div className="flex items-center">
                <i className="fas fa-shield-alt text-blue-600 text-xs mr-1"></i>
                <span className="text-blue-700 font-medium text-xs">
                  Status: <span className="font-bold">ACTIVE SINCE 2008</span>
                </span>
              </div>
              <button 
                onClick={() => fetchDashboardData(userData.id)}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                <i className="fas fa-sync-alt mr-1"></i>
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tabs */}
      <MobileTabs />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 py-4 mobile-container">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-4 mb-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs opacity-80 mb-1">Welcome back</div>
              <div className="text-xl font-bold mb-1">{userData?.fullName}</div>
              <div className="text-xs opacity-80">Member since {userData?.joinDate?.split('-')[0]}</div>
            </div>
            <div className="text-right">
              <div className="text-xs opacity-80 mb-1">Total Balance</div>
              <div className="text-2xl font-bold">
                {formatCurrency(userData?.totalBalance || 0)}
              </div>
              <div className="text-xs opacity-80">
                Safe Box: {formatCurrency(userData?.safeBoxBalance || 0)}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <button 
            onClick={() => navigate('/card')}
            className="bg-white rounded-lg p-3 shadow border border-gray-200 hover:border-blue-300 transition-all"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-1 mx-auto">
              <i className="fas fa-credit-card text-lg text-blue-500"></i>
            </div>
            <h3 className="font-medium text-gray-800 text-center text-xs">My Card</h3>
          </button>

          <button 
            onClick={() => alert('Safe Box interface coming soon')}
            className="bg-white rounded-lg p-3 shadow border border-gray-200 hover:border-green-300 transition-all"
          >
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-1 mx-auto">
              <i className="fas fa-vault text-lg text-green-500"></i>
            </div>
            <h3 className="font-medium text-gray-800 text-center text-xs">Safe Box</h3>
          </button>

          <button 
            onClick={() => navigate('/customer-service')}
            className="bg-white rounded-lg p-3 shadow border border-gray-200 hover:border-yellow-300 transition-all"
          >
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mb-1 mx-auto">
              <i className="fas fa-headset text-lg text-yellow-500"></i>
            </div>
            <h3 className="font-medium text-gray-800 text-center text-xs">Support</h3>
          </button>
        </div>

        {/* Recent Transactions */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-gray-800">Recent Transactions</h2>
            <button 
              onClick={() => navigate('/transactions')}
              className="text-blue-600 hover:text-blue-800 font-medium text-xs"
            >
              View All →
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {transactions.length > 0 ? (
              transactions.map((tx) => (
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
                          {tx.type === 'credit' ? 'Deposit' : tx.category}
                        </h3>
                        <p className="text-gray-600 text-xs">
                          {tx.bank} • {tx.displayTimestamp}
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
                        ID: {tx.transactionId?.substring(0, 8)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                <i className="fas fa-exchange-alt text-2xl mb-2"></i>
                <p className="text-sm">No transactions found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="fixed bottom-16 right-3 flex space-x-2">
        <button 
          onClick={() => navigate('/notifications')}
          className="bg-purple-600 text-white p-2 rounded-full shadow hover:bg-purple-700"
          title="Notifications"
        >
          <i className="fas fa-bell text-sm"></i>
        </button>
        
        <button 
          onClick={() => navigate('/customer-service')}
          className="bg-green-600 text-white p-2 rounded-full shadow hover:bg-green-700"
          title="Support"
        >
          <i className="fas fa-headset text-sm"></i>
        </button>
        
        <button 
          onClick={() => {
            localStorage.removeItem('user');
            window.location.href = '/';
          }}
          className="bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-600"
          title="Logout"
        >
          <i className="fas fa-sign-out-alt text-sm"></i>
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;
