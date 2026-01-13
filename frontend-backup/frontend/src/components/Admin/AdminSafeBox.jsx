import React, { useState } from 'react';

const AdminSafeBox = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('deposit');
  const [formData, setFormData] = useState({
    userId: '1',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    time: '14:30',
    year: new Date().getFullYear(),
    note: ''
  });

  const [safeBoxUsers, setSafeBoxUsers] = useState([
    { id: 1, name: 'John Client', email: 'user@example.com', balance: 1500.00, goal: 5000.00 },
    { id: 2, name: 'Jane Doe', email: 'jane@email.com', balance: 2500.00, goal: 10000.00 },
    { id: 3, name: 'Michael Smith', email: 'michael@domain.com', balance: 500.00, goal: 2000.00 },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const user = safeBoxUsers.find(u => u.id === parseInt(formData.userId));
    const newBalance = activeTab === 'deposit' 
      ? user.balance + parseFloat(formData.amount)
      : user.balance - parseFloat(formData.amount);

    if (activeTab === 'withdraw' && newBalance < 0) {
      alert('Insufficient funds in Safe Box!');
      return;
    }

    alert(`${activeTab === 'deposit' ? 'Deposit' : 'Withdrawal'} successful!\nAmount: $${formData.amount}\nUser: ${user.name}\nNew Balance: $${newBalance.toFixed(2)}`);
    
    // Update user balance
    setSafeBoxUsers(prev => 
      prev.map(u => 
        u.id === parseInt(formData.userId) 
          ? { ...u, balance: newBalance }
          : u
      )
    );

    // Reset form
    setFormData({
      userId: '1',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      time: '14:30',
      year: new Date().getFullYear(),
      note: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Safe Box Management</h2>
            <p className="text-gray-600 text-sm">Admin control for user Safe Boxes</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex">
            <button
              onClick={() => setActiveTab('deposit')}
              className={`flex-1 py-3 font-semibold ${activeTab === 'deposit' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
            >
              <i className="fas fa-plus-circle mr-2"></i>
              Add Money
            </button>
            <button
              onClick={() => setActiveTab('withdraw')}
              className={`flex-1 py-3 font-semibold ${activeTab === 'withdraw' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
            >
              <i className="fas fa-minus-circle mr-2"></i>
              Withdraw Money
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 py-3 font-semibold ${activeTab === 'users' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
            >
              <i className="fas fa-users mr-2"></i>
              View Users
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'deposit' || activeTab === 'withdraw' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2">Select User</label>
                  <select
                    value={formData.userId}
                    onChange={(e) => setFormData({...formData, userId: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-3"
                  >
                    {safeBoxUsers.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} (${user.balance.toFixed(2)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Amount (USD)</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-3"
                    placeholder="500.00"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-3"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Time</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-3"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Year</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-3"
                    min="2000"
                    max="2030"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2">Note / Description</label>
                  <input
                    type="text"
                    value={formData.note}
                    onChange={(e) => setFormData({...formData, note: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-3"
                    placeholder={`${activeTab === 'deposit' ? 'Deposit' : 'Withdrawal'} reason`}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-3 px-4 rounded-lg font-semibold text-lg ${
                  activeTab === 'deposit'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                <i className={`fas ${activeTab === 'deposit' ? 'fa-plus-circle' : 'fa-minus-circle'} mr-2`}></i>
                {activeTab === 'deposit' ? 'Add to Safe Box' : 'Withdraw from Safe Box'}
              </button>
            </form>
          ) : (
            /* Users Tab */
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Safe Box Users</h3>
              <div className="space-y-4">
                {safeBoxUsers.map(user => (
                  <div key={user.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-gray-800">{user.name}</h4>
                        <p className="text-gray-600 text-sm">{user.email}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-800">${user.balance.toFixed(2)}</div>
                        <div className="text-gray-600 text-sm">Goal: ${user.goal.toFixed(2)}</div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${(user.balance / user.goal) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-right text-sm text-gray-600 mt-1">
                        {((user.balance / user.goal) * 100).toFixed(1)}% complete
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSafeBox;
