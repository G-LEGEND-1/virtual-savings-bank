import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileTabs from '../components/Shared/MobileTabs';

const API_BASE = 'http://localhost:5001/api';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/');
      return;
    }
    
    fetchUserProfile(user.id);
  }, [navigate]);

  const fetchUserProfile = async (userId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/profile/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setUserData(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
    setLoading(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const maskEmail = (email) => {
    if (!email) return '';
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 3) {
      return `${localPart[0]}***@${domain}`;
    }
    return `${localPart.substring(0, 3)}***@${domain}`;
  };

  const maskPhone = (phone) => {
    if (!phone) return '';
    return phone.replace(/\d(?=\d{4})/g, '*');
  };

  const maskAccountNumber = (account) => {
    if (!account) return '';
    return '******' + account.slice(-4);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-14">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="mr-3 text-gray-600 hover:text-gray-800"
            >
              <i className="fas fa-arrow-left"></i>
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">My Profile</h1>
              <p className="text-gray-600 text-sm">Account details & personal information</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tabs */}
      <MobileTabs />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mr-4">
                <i className="fas fa-user text-2xl text-blue-600"></i>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{userData.fullName}</h2>
                <p className="text-blue-100 text-sm">{maskEmail(userData.email)}</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Personal Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-500 text-sm">Full Name</label>
                    <p className="font-medium">{userData.fullName}</p>
                  </div>
                  <div>
                    <label className="block text-gray-500 text-sm">Date of Birth</label>
                    <p className="font-medium">{formatDate(userData.dateOfBirth)}</p>
                  </div>
                  <div>
                    <label className="block text-gray-500 text-sm">Gender</label>
                    <p className="font-medium">{userData.gender}</p>
                  </div>
                  <div>
                    <label className="block text-gray-500 text-sm">Phone</label>
                    <p className="font-medium">{maskPhone(userData.phone)}</p>
                  </div>
                  <div>
                    <label className="block text-gray-500 text-sm">Address</label>
                    <p className="font-medium">{userData.address}</p>
                  </div>
                </div>
              </div>
              
              {/* Account Information */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Account Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-500 text-sm">Account Number</label>
                    <p className="font-medium font-mono">{maskAccountNumber(userData.accountNumber)}</p>
                  </div>
                  <div>
                    <label className="block text-gray-500 text-sm">Routing Number</label>
                    <p className="font-medium font-mono">{userData.routingNumber}</p>
                  </div>
                  <div>
                    <label className="block text-gray-500 text-sm">Account Type</label>
                    <p className="font-medium">{userData.accountType}</p>
                  </div>
                  <div>
                    <label className="block text-gray-500 text-sm">KYC Status</label>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      userData.kycVerified 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      <i className={`fas fa-${userData.kycVerified ? 'check-circle' : 'clock'} mr-1`}></i>
                      {userData.kycVerified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-gray-500 text-sm">Account Status</label>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <i className="fas fa-check-circle mr-1"></i>
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Account Security */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Account Security</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <i className="fas fa-shield-alt text-blue-600"></i>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">2FA Status</div>
                      <div className="font-bold text-blue-700">Enabled</div>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <i className="fas fa-history text-green-600"></i>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Last Login</div>
                      <div className="font-bold text-green-700">Today, 10:30 AM</div>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      <i className="fas fa-bell text-purple-600"></i>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Alerts</div>
                      <div className="font-bold text-purple-700">SMS & Email</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
