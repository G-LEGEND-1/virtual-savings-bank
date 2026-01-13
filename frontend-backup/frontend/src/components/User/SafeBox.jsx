import React, { useState, useEffect } from 'react';

const SafeBox = ({ isOpen, onClose }) => {
  const [safeBoxData, setSafeBoxData] = useState({
    balance: 1500.00,
    goal: 5000.00,
    transactions: [
      { id: 1, type: 'deposit', amount: 500.00, date: '2023-12-10', time: '10:30', year: '2023', adminNote: 'Monthly savings' },
      { id: 2, type: 'deposit', amount: 1000.00, date: '2023-12-05', time: '14:15', year: '2023', adminNote: 'Bonus savings' },
    ]
  });

  const [showWithdrawMessage, setShowWithdrawMessage] = useState(false);
  const [showDepositMessage, setShowDepositMessage] = useState(false);

  if (!isOpen) return null;

  const progress = (safeBoxData.balance / safeBoxData.goal) * 100;

  const handleWithdraw = () => {
    setShowWithdrawMessage(true);
    setTimeout(() => setShowWithdrawMessage(false), 3000);
  };

  const handleDeposit = () => {
    setShowDepositMessage(true);
    setTimeout(() => setShowDepositMessage(false), 3000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Safe Box</h2>
            <p className="text-gray-600 text-sm">Secure savings with admin control</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Balance Display */}
        <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50">
          <div className="text-center">
            <div className="text-gray-600 mb-1">Current Balance</div>
            <div className="text-4xl font-bold text-gray-800 mb-2">${safeBoxData.balance.toFixed(2)}</div>
            <div className="text-gray-600 text-sm">
              Goal: ${safeBoxData.goal.toFixed(2)} • {progress.toFixed(1)}% complete
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full safe-progress rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 grid grid-cols-2 gap-4">
          <button
            onClick={handleDeposit}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-xl flex flex-col items-center justify-center hover:opacity-90 transition-opacity"
          >
            <i className="fas fa-plus-circle text-2xl mb-2"></i>
            <span className="font-semibold">Add Money</span>
            <span className="text-xs opacity-90 mt-1">Admin controlled</span>
          </button>

          <button
            onClick={handleWithdraw}
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 rounded-xl flex flex-col items-center justify-center hover:opacity-90 transition-opacity"
          >
            <i className="fas fa-minus-circle text-2xl mb-2"></i>
            <span className="font-semibold">Withdraw</span>
            <span className="text-xs opacity-90 mt-1">Admin controlled</span>
          </button>
        </div>

        {/* Messages */}
        {showWithdrawMessage && (
          <div className="mx-4 p-3 bg-red-100 border border-red-200 rounded-lg text-red-700">
            <i className="fas fa-ban mr-2"></i>
            Unable to withdraw from Safe Box. Contact admin for assistance.
          </div>
        )}

        {showDepositMessage && (
          <div className="mx-4 p-3 bg-yellow-100 border border-yellow-200 rounded-lg text-yellow-700">
            <i className="fas fa-ban mr-2"></i>
            Unable to add money to Safe Box. Only admin can make deposits.
          </div>
        )}

        {/* Transaction History */}
        <div className="p-4">
          <h3 className="font-bold text-gray-800 mb-3">Recent Transactions</h3>
          <div className="space-y-3">
            {safeBoxData.transactions.map((tx) => (
              <div key={tx.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-gray-800">
                      {tx.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {tx.date} {tx.time} • {tx.year}
                    </div>
                    <div className="text-gray-500 text-sm mt-1">
                      {tx.adminNote}
                    </div>
                  </div>
                  <div className={`text-lg font-bold ${
                    tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {safeBoxData.transactions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <i className="fas fa-piggy-bank text-4xl mb-4"></i>
              <p>No transactions yet</p>
            </div>
          )}
        </div>

        {/* Info Notice */}
        <div className="p-4 bg-gray-50 border-t">
          <div className="flex items-start">
            <i className="fas fa-info-circle text-blue-600 mt-1 mr-2"></i>
            <div className="text-sm text-gray-600">
              <p className="font-semibold">Safe Box Information</p>
              <p className="mt-1">Only administrators can add or withdraw funds from your Safe Box. Contact support for assistance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafeBox;
