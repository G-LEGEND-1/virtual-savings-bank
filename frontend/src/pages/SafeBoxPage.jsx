import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileTabs from '../components/Shared/MobileTabs';

const API_BASE = 'http://localhost:5001/api';

const SafeBoxPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/');
      return;
    }
    
    fetchUserData(user.id);
  }, [navigate]);

  const fetchUserData = async (userId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/profile/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setUserData(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
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

  const handleWithdraw = () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      alert('Please enter a valid withdrawal amount');
      return;
    }

    alert(`🔒 ACCOUNT LOCKED\n\nWithdrawal request: ${formatCurrency(withdrawAmount)}\n\nAccount inactive due to tax fee.\n\nPlease contact customer support to unlock your account.`);
    setWithdrawAmount('');
  };

  const handleDeposit = () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      alert('Please enter a valid deposit amount');
      return;
    }

    alert(`✅ Deposit Request Received\n\nAmount: ${formatCurrency(depositAmount)}\n\nYour deposit request has been submitted for processing.\n\nPlease visit any Virtual Bank branch to complete the transaction.`);
    setDepositAmount('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Safe Box...</p>
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
                className="mr-3 text-gray-600 hover:text-gray-800"
              >
                <i className="fas fa-arrow-left"></i>
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Safe Box</h1>
                <p className="text-gray-600 text-sm">Secure Asset Storage</p>
              </div>
            </div>
            
            <button
              onClick={() => fetchUserData(userData.id)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              <i className="fas fa-sync-alt mr-2"></i>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Tabs */}
      <MobileTabs />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Safe Box Overview */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white mb-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-90 mb-1">Safe Box Balance</div>
              <div className="text-3xl font-bold">
                {formatCurrency(userData?.safeBoxBalance || 0)}
              </div>
              <div className="text-xs opacity-80 mt-2">Account: VSB-SAFE001</div>
            </div>
            <div className="text-right">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <i className="fas fa-vault text-2xl"></i>
              </div>
              <div className="text-xs opacity-80 mt-2">High Security</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
          <div className="flex">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-3 text-center ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <i className="fas fa-info-circle mr-2"></i>
              Overview
            </button>
            <button
              onClick={() => setActiveTab('withdraw')}
              className={`flex-1 py-3 text-center ${activeTab === 'withdraw' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <i className="fas fa-arrow-up mr-2"></i>
              Withdraw
            </button>
            <button
              onClick={() => setActiveTab('deposit')}
              className={`flex-1 py-3 text-center ${activeTab === 'deposit' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <i className="fas fa-arrow-down mr-2"></i>
              Deposit
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow p-6">
          {activeTab === 'overview' && (
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Safe Box Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <div className="text-gray-500 text-sm">Safe Box Number</div>
                    <div className="font-bold">VSB-SAFE001</div>
                  </div>
                  <i className="fas fa-shield-alt text-yellow-500 text-xl"></i>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <div className="text-gray-500 text-sm">Security Level</div>
                    <div className="font-bold">Maximum Security</div>
                  </div>
                  <i className="fas fa-lock text-green-500 text-xl"></i>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <div className="text-gray-500 text-sm">Insurance Coverage</div>
                    <div className="font-bold">$10,000,000.00</div>
                  </div>
                  <i className="fas fa-file-contract text-blue-500 text-xl"></i>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <div className="text-gray-500 text-sm">Last Deposit</div>
                    <div className="font-bold">August 4, 2008</div>
                  </div>
                  <i className="fas fa-calendar-alt text-purple-500 text-xl"></i>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
                  <h4 className="font-bold text-gray-800 mb-2 flex items-center">
                    <i className="fas fa-exclamation-triangle text-yellow-500 mr-2"></i>
                    Important Notice
                  </h4>
                  <p className="text-sm text-gray-600">
                    Your Safe Box account is currently <span className="font-bold text-red-600">inactive</span> due to unpaid tax fees. 
                    Withdrawals are temporarily disabled. Please contact customer support to resolve this issue.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'withdraw' && (
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Withdraw from Safe Box</h3>
              
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
                <div className="flex items-center">
                  <i className="fas fa-ban text-red-500 text-xl mr-3"></i>
                  <div>
                    <h4 className="font-bold text-red-700">Account Inactive</h4>
                    <p className="text-sm text-red-600">
                      Withdrawals are disabled due to unpaid tax fees. Please contact support.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Withdrawal Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg"
                      placeholder="0.00"
                      disabled
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button className="p-3 bg-gray-100 rounded text-center hover:bg-gray-200">
                    $1,000
                  </button>
                  <button className="p-3 bg-gray-100 rounded text-center hover:bg-gray-200">
                    $5,000
                  </button>
                  <button className="p-3 bg-gray-100 rounded text-center hover:bg-gray-200">
                    $10,000
                  </button>
                  <button className="p-3 bg-gray-100 rounded text-center hover:bg-gray-200">
                    $50,000
                  </button>
                </div>

                <button
                  onClick={handleWithdraw}
                  className="w-full py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600"
                >
                  <i className="fas fa-ban mr-2"></i>
                  Withdraw (Account Inactive)
                </button>
              </div>
            </div>
          )}

          {activeTab === 'deposit' && (
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Deposit to Safe Box</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Deposit Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button onClick={() => setDepositAmount('1000')} className="p-3 bg-gray-100 rounded text-center hover:bg-gray-200">
                    $1,000
                  </button>
                  <button onClick={() => setDepositAmount('5000')} className="p-3 bg-gray-100 rounded text-center hover:bg-gray-200">
                    $5,000
                  </button>
                  <button onClick={() => setDepositAmount('10000')} className="p-3 bg-gray-100 rounded text-center hover:bg-gray-200">
                    $10,000
                  </button>
                  <button onClick={() => setDepositAmount('50000')} className="p-3 bg-gray-100 rounded text-center hover:bg-gray-200">
                    $50,000
                  </button>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                  <h4 className="font-bold text-gray-800 mb-2">Deposit Instructions</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Visit any Virtual Bank branch</li>
                    <li>• Bring valid ID and account details</li>
                    <li>• Maximum deposit: $100,000 per day</li>
                    <li>• Processing time: 1-2 business days</li>
                  </ul>
                </div>

                <button
                  onClick={handleDeposit}
                  className="w-full py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700"
                >
                  <i className="fas fa-arrow-down mr-2"></i>
                  Submit Deposit Request
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Security Info */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-bold text-gray-800 mb-2 flex items-center">
            <i className="fas fa-shield-alt text-yellow-600 mr-2"></i>
            Safe Box Security Features
          </h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 256-bit military-grade encryption</li>
            <li>• 24/7 armed security monitoring</li>
            <li>• Biometric access control</li>
            <li>• FDIC insurance up to $10M</li>
            <li>• Fire and flood protection</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SafeBoxPage;
