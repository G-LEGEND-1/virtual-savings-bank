import React from 'react';

const ProfileModal = ({ isOpen, onClose, userData, readOnly = true }) => {
  if (!isOpen) return null;

  const maskAccountNumber = (account) => {
    return '******' + account.slice(-5);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Profile Information</h2>
            <p className="text-gray-600 text-sm">Account Details</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          {/* Profile Header */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-user text-2xl text-white"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800">{userData.fullName}</h3>
            <p className="text-gray-600 text-sm">{userData.email}</p>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                <i className="fas fa-id-card mr-2 text-blue-600"></i>
                Personal Information
              </h4>
              
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-gray-500 text-xs mb-1">Full Name</label>
                  <div className="font-semibold text-gray-800 text-sm">{userData.fullName}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-500 text-xs mb-1">Gender</label>
                    <div className="font-semibold text-gray-800 text-sm">{userData.gender}</div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-500 text-xs mb-1">Date of Birth</label>
                    <div className="font-semibold text-gray-800 text-sm">
                      {formatDate(userData.dateOfBirth)}
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-500 text-xs mb-1">Email Address</label>
                  <div className="font-semibold text-gray-800 text-sm">{userData.email}</div>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                <i className="fas fa-university mr-2 text-green-600"></i>
                Account Information
              </h4>
              
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-gray-500 text-xs mb-1">Account Number</label>
                  <div className="font-semibold text-gray-800 text-sm font-mono">
                    {maskAccountNumber(userData.accountNumber)}
                    <button 
                      className="ml-2 text-blue-600 text-xs"
                      onClick={() => {
                        navigator.clipboard.writeText(userData.accountNumber);
                        alert('Account number copied to clipboard!');
                      }}
                    >
                      <i className="fas fa-copy"></i>
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-500 text-xs mb-1">Routing Number</label>
                  <div className="font-semibold text-gray-800 text-sm font-mono">
                    {userData.routingNumber}
                    <button 
                      className="ml-2 text-blue-600 text-xs"
                      onClick={() => {
                        navigator.clipboard.writeText(userData.routingNumber);
                        alert('Routing number copied to clipboard!');
                      }}
                    >
                      <i className="fas fa-copy"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <h4 className="font-semibold text-red-700 mb-2 flex items-center">
                <i className="fas fa-exclamation-triangle mr-2"></i>
                Account Status
              </h4>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-red-700 font-bold">INACTIVE</span>
              </div>
              <p className="text-red-600 text-xs mt-2">
                Account locked due to tax fee. Please contact support to activate your account.
              </p>
            </div>
          </div>

          {/* Close Button */}
          <div className="mt-6">
            <button
              onClick={onClose}
              className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-900"
            >
              <i className="fas fa-times mr-2"></i>
              Close Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
