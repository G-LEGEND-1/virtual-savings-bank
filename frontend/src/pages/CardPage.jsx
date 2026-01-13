import React, { useState } from 'react';
import MobileTabs from "../components/Shared/MobileTabs";
import Footer from "../components/Shared/Footer";
import { useNavigate } from 'react-router-dom';

const CardPage = () => {
  const navigate = useNavigate();
  const [cardFlip, setCardFlip] = useState(false);
  const [showCVV, setShowCVV] = useState(false);

  const user = JSON.parse(localStorage.getItem('user')) || {};
  
  const cardDetails = {
    cardNumber: '4532 8765 4321 0987',
    expiryDate: '08/28',
    cvv: '123',
    cardHolder: user.fullName || 'MARK JACKSON FANSHAW',
    cardType: 'visa',
    status: 'active',
    issueDate: '2008-02-15',
    dailyLimit: 50000,
    availableLimit: 50000
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const recentTransactions = [
    { id: 1, merchant: 'AMAZON.COM', amount: 249.99, date: 'Jan 5, 2024', status: 'completed' },
    { id: 2, merchant: 'APPLE STORE', amount: 1299.00, date: 'Dec 28, 2023', status: 'completed' },
    { id: 3, merchant: 'UBER', amount: 45.50, date: 'Dec 25, 2023', status: 'completed' },
    { id: 4, merchant: 'STARBUCKS', amount: 6.75, date: 'Dec 20, 2023', status: 'pending' }
  ];

  const handleLockCard = () => {
    const action = cardDetails.status === 'active' ? 'lock' : 'unlock';
    if (window.confirm(`Are you sure you want to ${action} your card?`)) {
      alert(`Card ${action}ed successfully!`);
    }
  };

  const handleReportLost = () => {
    if (window.confirm('Report this card as lost or stolen? This will immediately block the card.')) {
      alert('Card reported as lost. A replacement will be issued within 5-7 business days.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50"> pb-16 pb-14
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
              <h1 className="text-xl font-bold text-gray-800">Virtual Bank Card</h1>
              <p className="text-gray-600 text-sm">Manage your debit card and transactions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
n      {/* Mobile Tabs */}
      <MobileTabs />
        {/* Card Display */}
        <div className="relative mb-6" style={{ height: '220px' }}>
          <div 
            className={`absolute w-full transition-all duration-500 ${cardFlip ? 'opacity-0' : 'opacity-100'}`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="text-xs opacity-80 mb-1">Virtual Savings Bank</div>
                  <div className="text-lg font-bold">PLATINUM CARD</div>
                </div>
                <div className="text-right">
                  <div className="text-xs opacity-80 mb-1">DEBIT CARD</div>
                  <div className="text-lg">
                    <i className="fab fa-cc-visa"></i>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="text-xs opacity-80 mb-1">Card Number</div>
                <div className="text-xl font-mono tracking-widest">
                  {cardDetails.cardNumber.match(/.{1,4}/g).join(' ')}
                </div>
              </div>
              
              <div className="flex justify-between">
                <div>
                  <div className="text-xs opacity-80 mb-1">Card Holder</div>
                  <div className="font-bold">{cardDetails.cardHolder}</div>
                </div>
                <div>
                  <div className="text-xs opacity-80 mb-1">Valid Thru</div>
                  <div className="font-bold">{cardDetails.expiryDate}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Back of card */}
          <div 
            className={`absolute w-full transition-all duration-500 ${cardFlip ? 'opacity-100' : 'opacity-0'}`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl shadow-xl p-6 text-white">
              <div className="h-10 bg-black mb-6"></div>
              
              <div className="mb-6">
                <div className="text-xs opacity-80 mb-1">CVV</div>
                <div className="flex items-center">
                  <div className="bg-gray-700 px-3 py-1 rounded font-mono">
                    {showCVV ? cardDetails.cvv : '•••'}
                  </div>
                  <button
                    onClick={() => setShowCVV(!showCVV)}
                    className="ml-3 text-xs bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded"
                  >
                    {showCVV ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              
              <div className="text-center text-xs opacity-80">
                For customer service, call: 1-800-VIRTUAL
              </div>
            </div>
          </div>
        </div>
        
        {/* Flip Card Button */}
        <div className="text-center mb-6">
          <button
            onClick={() => setCardFlip(!cardFlip)}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
          >
            <i className={`fas fa-${cardFlip ? 'undo' : 'redo'} mr-2`}></i>
            {cardFlip ? 'Show Front' : 'Show Back'}
          </button>
        </div>

        {/* Card Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-bold text-gray-800 mb-3">Card Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className={`font-semibold ${
                  cardDetails.status === 'active' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <i className={`fas fa-circle text-xs mr-1`}></i>
                  {cardDetails.status.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Issue Date</span>
                <span className="font-semibold">{cardDetails.issueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Daily Limit</span>
                <span className="font-semibold">{formatCurrency(cardDetails.dailyLimit)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Available Today</span>
                <span className="font-semibold">{formatCurrency(cardDetails.availableLimit)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Card Type</span>
                <span className="font-semibold">VISA Platinum</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-bold text-gray-800 mb-3">Card Controls</h3>
            <div className="space-y-3">
              <button
                onClick={handleLockCard}
                className="w-full flex items-center justify-between p-3 border border-gray-300 rounded hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                    <i className="fas fa-lock text-red-600"></i>
                  </div>
                  <span className="font-medium">
                    {cardDetails.status === 'active' ? 'Lock Card' : 'Unlock Card'}
                  </span>
                </div>
                <i className="fas fa-chevron-right text-gray-400"></i>
              </button>
              
              <button
                onClick={handleReportLost}
                className="w-full flex items-center justify-between p-3 border border-gray-300 rounded hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                    <i className="fas fa-exclamation-triangle text-orange-600"></i>
                  </div>
                  <span className="font-medium">Report Lost/Stolen</span>
                </div>
                <i className="fas fa-chevron-right text-gray-400"></i>
              </button>
              
              <button
                onClick={() => alert('Temporary limit change request sent to customer service')}
                className="w-full flex items-center justify-between p-3 border border-gray-300 rounded hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <i className="fas fa-sliders-h text-blue-600"></i>
                  </div>
                  <span className="font-medium">Adjust Limits</span>
                </div>
                <i className="fas fa-chevron-right text-gray-400"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-bold text-gray-800">Recent Card Transactions</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                      <i className="fas fa-shopping-bag text-gray-600"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{tx.merchant}</h4>
                      <div className="flex items-center text-sm text-gray-600">
                        <span>{tx.date}</span>
                        <span className="mx-2">•</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          tx.status === 'completed' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-red-600">-{formatCurrency(tx.amount)}</div>
                    <div className="text-xs text-gray-500">DEBIT</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-gray-200 text-center">
            <button
              onClick={() => navigate('/transactions')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View All Card Transactions →
            </button>
          </div>
        </div>

        {/* Security Tips */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-bold text-gray-800 mb-2 flex items-center">
            <i className="fas fa-shield-alt text-blue-600 mr-2"></i>
            Card Security Tips
          </h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Never share your CVV or PIN with anyone</li>
            <li>• Only use secure websites for online purchases</li>
            <li>• Report lost cards immediately</li>
            <li>• Review transactions regularly</li>
            <li>• Enable transaction alerts in your profile</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CardPage;
 
      {/* Footer */}
      <Footer />
