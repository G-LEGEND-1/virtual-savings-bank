import React, { useState } from 'react';

const Card = ({ isOpen, onClose }) => {
  const [cardData, setCardData] = useState({
    cardNumber: '5412 7512 3412 3456',
    cardHolder: 'JOHN CLIENT',
    expiryDate: '12/28',
    cvv: '123',
    cardType: 'MasterCard',
    balance: 5750.25,
    status: 'Active',
    dailyLimit: 5000.00,
    usedToday: 1249.99
  });

  const [showCVV, setShowCVV] = useState(false);

  if (!isOpen) return null;

  const formatCardNumber = (number) => {
    return number.replace(/(\d{4})/g, '$1 ').trim();
  };

  const maskedCardNumber = () => {
    const parts = cardData.cardNumber.split(' ');
    return `**** **** **** ${parts[3]}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Virtual Bank Card</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Card Display */}
        <div className="p-6">
          <div className="relative">
            {/* MasterCard Design */}
            <div className="bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 rounded-2xl p-6 text-white shadow-2xl">
              {/* MasterCard Circles */}
              <div className="absolute top-4 right-4">
                <div className="flex">
                  <div className="w-8 h-8 rounded-full bg-red-500 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-yellow-500 border-2 border-white -ml-4"></div>
                </div>
              </div>

              <div className="mb-8">
                <div className="text-lg font-light opacity-90">Virtual Bank</div>
                <div className="text-2xl font-bold">{cardData.cardType}</div>
              </div>

              <div className="text-2xl font-mono tracking-widest mb-6">
                {maskedCardNumber()}
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <div className="text-sm opacity-90">Card Holder</div>
                  <div className="text-lg font-semibold">{cardData.cardHolder}</div>
                </div>
                
                <div>
                  <div className="text-sm opacity-90">Expires</div>
                  <div className="text-lg font-semibold">{cardData.expiryDate}</div>
                </div>

                <div>
                  <div className="text-sm opacity-90">CVV</div>
                  <div className="text-lg font-semibold flex items-center">
                    {showCVV ? cardData.cvv : '***'}
                    <button 
                      onClick={() => setShowCVV(!showCVV)}
                      className="ml-2 text-white opacity-80 hover:opacity-100"
                    >
                      <i className={`fas ${showCVV ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Details */}
          <div className="mt-6 space-y-4">
            {/* Balance */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-gray-600 text-sm">Available Balance</div>
                  <div className="text-2xl font-bold text-gray-800">${cardData.balance.toFixed(2)}</div>
                </div>
                <div className="text-green-600">
                  <i className="fas fa-check-circle text-2xl"></i>
                </div>
              </div>
            </div>

            {/* Limits */}
            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <div className="text-gray-700 font-semibold">Daily Limit</div>
                <div className="text-gray-800">${cardData.dailyLimit.toFixed(2)}</div>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${(cardData.usedToday / cardData.dailyLimit) * 100}%` }}
                ></div>
              </div>
              <div className="text-right text-sm text-gray-600 mt-1">
                Used today: ${cardData.usedToday.toFixed(2)}
              </div>
            </div>

            {/* Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-xl">
                <div className="text-gray-600 text-sm">Status</div>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="font-semibold text-gray-800">{cardData.status}</span>
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl">
                <div className="text-gray-600 text-sm">Card Type</div>
                <div className="font-semibold text-gray-800 mt-1">{cardData.cardType}</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button className="bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700">
              <i className="fas fa-lock mr-2"></i>
              Lock Card
            </button>
            <button className="bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300">
              <i className="fas fa-file-pdf mr-2"></i>
              Statements
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="p-4 bg-red-50 border-t">
          <div className="flex items-center text-red-700">
            <i className="fas fa-exclamation-triangle mr-2"></i>
            <span className="text-sm">Never share your CVV or card details with anyone</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
