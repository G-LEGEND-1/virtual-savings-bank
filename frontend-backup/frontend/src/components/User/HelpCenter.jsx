import React from 'react';

const HelpCenter = ({ isOpen, onClose, onOpenChat }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-3 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">Help Center</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* About Us */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center">
              <i className="fas fa-info-circle text-blue-600 mr-2"></i>
              About Virtual Saving Bank
            </h3>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-gray-700 text-sm mb-2">
                <strong>Virtual Saving Bank</strong> is a premier digital banking institution providing secure and convenient banking services to customers worldwide.
              </p>
              <p className="text-gray-700 text-sm mb-2">
                Founded with the vision of making banking accessible to everyone, we offer a wide range of financial services through our secure online platform.
              </p>
              <div className="mt-3 text-xs text-gray-600">
                <p><strong>Email:</strong> info.virtualsaviesbank@gmail.com</p>
                <p><strong>Support:</strong> 24/7 Customer Service</p>
                <p><strong>Services:</strong> Savings, Transfers, Payments, Investments</p>
              </div>
            </div>
          </div>

          {/* Quick Help */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center">
              <i className="fas fa-life-ring text-green-600 mr-2"></i>
              Quick Help
            </h3>
            <div className="space-y-2">
              {[
                { q: 'Why is my account inactive?', a: 'Account may be inactive due to tax verification. Contact support.' },
                { q: 'How to reset password?', a: 'Use OTP verification during login.' },
                { q: 'Transaction not showing?', a: 'Transactions may take 24 hours to reflect.' },
                { q: 'Safe Box withdrawals?', a: 'Only administrators can process Safe Box transactions.' }
              ].map((item, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-2">
                  <div className="font-medium text-gray-800 text-sm">{item.q}</div>
                  <div className="text-gray-600 text-xs mt-1">{item.a}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Options */}
          <div>
            <h3 className="font-bold text-gray-800 mb-3 flex items-center">
              <i className="fas fa-headset text-purple-600 mr-2"></i>
              Contact Us
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  onClose();
                  onOpenChat();
                }}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-lg flex flex-col items-center justify-center hover:opacity-90"
              >
                <i className="fas fa-comments text-lg mb-1"></i>
                <span className="text-xs font-medium">Live Chat</span>
              </button>
              
              <button className="bg-gradient-to-r from-green-600 to-green-700 text-white p-3 rounded-lg flex flex-col items-center justify-center hover:opacity-90">
                <i className="fas fa-envelope text-lg mb-1"></i>
                <span className="text-xs font-medium">Email Us</span>
              </button>
            </div>
          </div>

          {/* Emergency Notice */}
          <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <i className="fas fa-exclamation-triangle text-red-600 mt-0.5 mr-2"></i>
              <div className="text-xs text-red-700">
                <p className="font-semibold">Emergency Support</p>
                <p className="mt-1">For urgent account issues, contact support immediately through Live Chat.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
