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
    cardNumber: '**** **** 4321 0987',
    expiryDate: '08/2011',
    cvv: '463',
    cardHolder: user.fullName || 'MARK JACKSON FANSHAW',
    cardType: 'visa',
    status: 'expired',  // CHANGED TO EXPIRED
    issueDate: '2008-02-15',
    expirationDate: '2011-08-31', // ADDED EXPIRATION DATE
    dailyLimit: 50000,
    availableLimit: 0,  // CHANGED TO 0
    reason: 'Card expired on August 31, 2011'  // ADDED REASON
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const recentTransactions = [
    { id: 1, merchant: 'AMAZON.COM', amount: 249.99, date: 'Jan 5, 2008', status: 'completed' },
    { id: 2, merchant: 'APPLE STORE', amount: 1299.00, date: 'Dec 28, 2008', status: 'completed' },
    { id: 3, merchant: 'UBER', amount: 45.50, date: 'Dec 25, 2009', status: 'completed' },
    { id: 4, merchant: 'STARBUCKS', amount: 6.75, date: 'Dec 20, 2009', status: 'completed', note: 'Last transaction before expiry' }
  ];

  const handleLockCard = () => {
    alert('This card has expired and cannot be locked/unlocked. Please contact customer service for a replacement card.');
  };

  const handleReportLost = () => {
    alert('This card expired on August 31, 2011. Reporting as lost is not applicable for expired cards. Please request a new card.');
  };

  const requestNewCard = () => {
    if (window.confirm('Request a new card replacement? Customer service will contact you for verification.')) {
      alert('New card request submitted. Customer service will contact you within 24 hours.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
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
        {/* Mobile Tabs */}
        <MobileTabs />
        
        {/* EXPIRED CARD WARNING */}
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
              <i className="fas fa-exclamation-triangle text-red-600 text-xl"></i>
            </div>
            <div>
              <h3 className="font-bold text-red-800 text-lg">CARD EXPIRED</h3>
              <p className="text-red-600 text-sm">
                This card expired on August 31, 2011. No transactions can be processed.
              </p>
            </div>
          </div>
          <button
            onClick={requestNewCard}
            className="mt-3 w-full py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium"
          >
            <i className="fas fa-credit-card mr-2"></i>
            Request New Card
          </button>
        </div>

        {/* Card Display */}
        <div className="relative mb-6" style={{ height: '220px' }}>
          <div 
            className={`absolute w-full transition-all duration-500 ${cardFlip ? 'opacity-0' : 'opacity-100'}`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="bg-gradient-to-r from-gray-500 to-gray-600 rounded-2xl shadow-xl p-6 text-white relative">
              {/* EXPIRED OVERLAY */}
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-2">EXPIRED</div>
                  <div className="text-sm opacity-80">Valid thru: 08/2011</div>
                </div>
              </div>
              
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
            <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl shadow-xl p-6 text-white relative">
              {/* EXPIRED OVERLAY */}
              <div className="absolute inset-0 bg-black bg-opacity-60 rounded-2xl flex items-center justify-center">
                <div className="text-center text-white">
                  <i className="fas fa-ban text-3xl mb-2"></i>
                  <div className="font-bold">NO LONGER VALID</div>
                </div>
              </div>
              
              <div className="h-10 bg-black mb-6"></div>
              
              <div className="mb-6">
                <div className="text-xs opacity-80 mb-1">CVV</div>
                <div className="flex items-center">
                  <div className="bg-gray-700 px-3 py-1 rounded font-mono">
                    {showCVV ? cardDetails.cvv : '•••'}
                  </div>
                  <button
                    onClick={() => setShowCVV(!showCVV)}
                    className="ml-3 text-xs bg-gray-600 hover:bg-gray-700 px-2 py-1 rounded"
                  >
                    {showCVV ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              
              <div className="text-center text-xs opacity-80">
                Card expired on August 31, 2011
              </div>
            </div>
          </div>
        </div>
        
        {/* Flip Card Button */}
        <div className="text-center mb-6">
          <button
            onClick={() => setCardFlip(!cardFlip)}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
          >
            <i className={`fas fa-${cardFlip ? 'undo' : 'redo'} mr-2`}></i>
            {cardFlip ? 'Show Front' : 'Show Back'}
          </button>
        </div>

        {/* Card Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-4 border border-red-200">
            <h3 className="font-bold text-gray-800 mb-3">Card Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className="font-semibold text-red-600">
                  <i className="fas fa-ban text-xs mr-1"></i>
                  EXPIRED
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Issue Date</span>
                <span className="font-semibold">{cardDetails.issueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Expiration Date</span>
                <span className="font-semibold text-red-600">{cardDetails.expirationDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Daily Limit</span>
                <span className="font-semibold line-through">{formatCurrency(cardDetails.dailyLimit)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Available Today</span>
                <span className="font-semibold text-red-600">{formatCurrency(cardDetails.availableLimit)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Card Type</span>
                <span className="font-semibold">VISA Platinum</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 border border-red-200">
            <h3 className="font-bold text-gray-800 mb-3">Card Actions</h3>
            <div className="space-y-3">
              <button
                onClick={requestNewCard}
                className="w-full flex items-center justify-between p-3 border border-gray-300 rounded hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <i className="fas fa-credit-card text-blue-600"></i>
                  </div>
                  <span className="font-medium">Request New Card</span>
                </div>
                <i className="fas fa-chevron-right text-gray-400"></i>
              </button>
              
              <button
                onClick={handleLockCard}
                className="w-full flex items-center justify-between p-3 border border-gray-300 rounded hover:bg-gray-50 opacity-50 cursor-not-allowed"
                disabled
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                    <i className="fas fa-lock text-gray-400"></i>
                  </div>
                  <span className="font-medium text-gray-400">Lock/Unlock Card</span>
                </div>
                <i className="fas fa-ban text-gray-400"></i>
              </button>
              
              <button
                onClick={handleReportLost}
                className="w-full flex items-center justify-between p-3 border border-gray-300 rounded hover:bg-gray-50 opacity-50 cursor-not-allowed"
                disabled
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                    <i className="fas fa-exclamation-triangle text-gray-400"></i>
                  </div>
                  <span className="font-medium text-gray-400">Report Lost/Stolen</span>
                </div>
                <i className="fas fa-ban text-gray-400"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-bold text-gray-800">Historical Card Transactions (2008-2009)</h3>
            <p className="text-sm text-gray-600">Last active before card expiration</p>
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
                        {tx.note && (
                          <>
                            <span className="mx-2">•</span>
                            <span className="text-red-600 text-xs font-medium">{tx.note}</span>
                          </>
                        )}
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
        </div>

        {/* Card Status Information */}
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-bold text-gray-800 mb-3 flex items-center">
            <i className="fas fa-info-circle text-blue-600 mr-2"></i>
            About Expired Cards
          </h4>
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Card Expiration:</strong> August 31, 2011</p>
            <p><strong>Status:</strong> No longer valid for transactions</p>
            <p><strong>Next Steps:</strong> Request a new card replacement</p>
            <p><strong>Contact:</strong> Customer service for assistance</p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CardPage;
