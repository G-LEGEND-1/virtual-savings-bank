import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileTabs from '../components/Shared/MobileTabs';

const API_BASE = 'https://virtual-savings-bank-backend.onrender.com/api';

const TransactionHistoryPage = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [years, setYears] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/');
      return;
    }
    
    fetchTransactions(user.id);
  }, [navigate]);

  const fetchTransactions = async (userId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/transactions/user/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setTransactions(data.data);
        setFilteredTransactions(data.data);
        setYears(data.summary?.years || []);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    let filtered = transactions;
    
    // Filter by year
    if (selectedYear !== 'all') {
      filtered = filtered.filter(tx => tx.year === selectedYear);
    }
    
    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(tx => tx.type === selectedType);
    }
    
    setFilteredTransactions(filtered);
    setExpandedId(null); // Close expanded view when filter changes
  }, [selectedYear, selectedType, transactions]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getTransactionIcon = (category) => {
    switch (category) {
      case 'transfer': return 'fas fa-exchange-alt text-blue-600';
      case 'investment': return 'fas fa-chart-line text-green-600';
      case 'real_estate': return 'fas fa-home text-purple-600';
      case 'safebox': return 'fas fa-vault text-yellow-600';
      case 'atm': return 'fas fa-money-bill-wave text-gray-600';
      case 'dividend': return 'fas fa-coins text-yellow-500';
      case 'interest': return 'fas fa-percentage text-green-500';
      case 'fee': return 'fas fa-file-invoice-dollar text-red-500';
      case 'donation': return 'fas fa-hand-holding-heart text-pink-500';
      case 'payment': return 'fas fa-credit-card text-indigo-600';
      default: return 'fas fa-exchange-alt text-gray-600';
    }
  };

  const getCategoryName = (category) => {
    const names = {
      'transfer': 'Bank Transfer',
      'investment': 'Investment',
      'real_estate': 'Real Estate',
      'safebox': 'Safe Box',
      'atm': 'ATM Withdrawal',
      'dividend': 'Dividend',
      'interest': 'Interest',
      'fee': 'Bank Fee',
      'donation': 'Donation',
      'payment': 'Payment'
    };
    return names[category] || category;
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transaction history...</p>
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
                <h1 className="text-xl font-bold text-gray-800">Transaction History</h1>
                <p className="text-gray-600 text-sm">
                  {transactions.length} transactions
                </p>
              </div>
            </div>
            
            <button
              onClick={() => fetchTransactions(JSON.parse(localStorage.getItem('user')).id)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              <i className="fas fa-sync-alt mr-2"></i>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-gray-700 text-sm mb-1">Filter by Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value="all">All Years (2008-2010)</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm mb-1">Filter by Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value="all">All Types</option>
                <option value="credit">Credits (Deposits)</option>
                <option value="debit">Debits (Withdrawals)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tabs */}
      <MobileTabs />

      {/* Transactions List */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="font-bold text-gray-800">
              Transaction Details {selectedYear !== 'all' && `(${selectedYear})`}
            </h2>
          </div>
          
          {filteredTransactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <i className="fas fa-search text-3xl mb-3"></i>
              <p>No transactions found for the selected filters</p>
              <button
                onClick={() => {
                  setSelectedYear('all');
                  setSelectedType('all');
                }}
                className="mt-2 text-blue-600 hover:text-blue-800"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredTransactions.map((tx) => (
                <div key={tx.id} className="transaction-card">
                  {/* Collapsed View */}
                  <div 
                    className="p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleExpand(tx.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center flex-1">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3">
                          <i className={`${getTransactionIcon(tx.category)} text-lg`}></i>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-gray-800">
                                {getCategoryName(tx.category)}
                              </h3>
                              <p className="text-gray-600 text-sm">{tx.bank}</p>
                            </div>
                            <div className={`text-lg font-bold ${
                              tx.type === 'credit' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                            </div>
                          </div>
                          
                          <div className="flex items-center mt-1">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold mr-2 ${
                              tx.type === 'credit' 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {tx.type === 'credit' ? 'CREDIT' : 'DEBIT'}
                            </span>
                            <span className="text-gray-500 text-xs">
                              {tx.displayTimestamp}
                            </span>
                            <button className="ml-auto text-gray-400">
                              <i className={`fas fa-chevron-${expandedId === tx.id ? 'up' : 'down'}`}></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded View */}
                  {expandedId === tx.id && (
                    <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
                      <div className="pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-gray-500 mb-1">Transaction ID</div>
                            <div className="font-mono font-medium bg-gray-100 p-2 rounded">
                              {tx.transactionId}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-500 mb-1">Account</div>
                            <div className="font-medium bg-gray-100 p-2 rounded">
                              {tx.accountNumber}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-500 mb-1">Sender/Recipient</div>
                            <div className="font-medium bg-gray-100 p-2 rounded">
                              {tx.sender}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-500 mb-1">Date & Time</div>
                            <div className="font-medium bg-gray-100 p-2 rounded">
                              {tx.displayTimestamp}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <div className="text-gray-500 mb-1">Remark</div>
                          <div className="font-medium bg-gray-100 p-2 rounded">
                            {tx.remark}
                          </div>
                        </div>
                        
                        {/* Special Highlights */}
                        {tx.type === 'credit' && tx.amount === 7500000 && (
                          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                            <div className="flex items-center text-blue-700 text-sm">
                              <i className="fas fa-star mr-2"></i>
                              <span className="font-semibold">Major Transaction:</span>
                              <span className="ml-2">$7.5M transfer from Washington Mutual Bank (2008)</span>
                            </div>
                          </div>
                        )}
                        
                        {tx.category === 'safebox' && (
                          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                            <div className="flex items-center text-green-700 text-sm">
                              <i className="fas fa-vault mr-2"></i>
                              <span className="font-semibold">Safe Box Deposit:</span>
                              <span className="ml-2">$4M securely stored in Safe Box (August 2008)</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistoryPage;
