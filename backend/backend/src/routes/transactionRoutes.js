const express = require('express');
const router = express.Router();
const transactions = require('../data/transactions');

// Get all transactions for user
router.get('/user/:userId', (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const userTransactions = transactions.filter(t => t.userId === userId);
    
    // Calculate totals
    const totalCredits = userTransactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalDebits = userTransactions
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const netBalance = totalCredits - totalDebits;
    
    // Group by year for filtering
    const years = [...new Set(userTransactions.map(t => t.year))].sort((a, b) => b - a);
    
    res.json({
      success: true,
      data: userTransactions,
      summary: {
        totalTransactions: userTransactions.length,
        totalCredits: totalCredits,
        totalDebits: totalDebits,
        netBalance: netBalance,
        years: years
      }
    });
    
  } catch (error) {
    console.error('Transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Filter transactions by year
router.get('/user/:userId/year/:year', (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const year = req.params.year;
    
    const filteredTransactions = transactions.filter(t => 
      t.userId === userId && t.year === year
    );
    
    res.json({
      success: true,
      data: filteredTransactions,
      year: year
    });
    
  } catch (error) {
    console.error('Filter transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get transaction by ID
router.get('/:transactionId', (req, res) => {
  try {
    const transactionId = req.params.transactionId;
    const transaction = transactions.find(t => t.transactionId === transactionId);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }
    
    res.json({
      success: true,
      data: transaction
    });
    
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
