const express = require('express');
const router = express.Router();

// Inline transaction data with updated bank names
const transactions = [
  // 2008 Transactions
  {
    id: 1,
    userId: 1,
    transactionId: "TX200802152367",
    type: "credit",
    amount: 7500000.00,
    bank: "Washington Mutual Bank",
    sender: "Washington Mutual Trust",
    accountNumber: "********2367",
    date: "2008-02-15",
    time: "09:45",
    year: "2008",
    remark: "Account consolidation transfer",
    status: "completed",
    category: "transfer",
    displayTimestamp: "Feb 15, 2008 • 09:45 AM",
    balanceAfter: 7500000.00
  },
  {
    id: 2,
    userId: 1,
    transactionId: "TX200802281001",
    type: "debit",
    amount: 25.00,
    bank: "Virtual Savings Bank",
    sender: "VIRTUAL BANK",
    accountNumber: "VSB20240012345",
    date: "2008-02-28",
    time: "00:01",
    year: "2008",
    remark: "Monthly account maintenance fee",
    status: "completed",
    category: "fee",
    displayTimestamp: "Feb 28, 2008 • 12:01 AM",
    balanceAfter: 7499975.00
  },
  {
    id: 3,
    userId: 1,
    transactionId: "TX200803150301",
    type: "debit",
    amount: 250000.00,
    bank: "Bank of America",
    sender: "Miami Properties Inc.",
    accountNumber: "REI-20080315",
    date: "2008-03-15",
    time: "14:30",
    year: "2008",
    remark: "Real estate down payment - Miami condo",
    status: "completed",
    category: "real_estate",
    displayTimestamp: "Mar 15, 2008 • 02:30 PM",
    balanceAfter: 7249975.00
  },
  {
    id: 4,
    userId: 1,
    transactionId: "TX200804180401",
    type: "debit",
    amount: 100000.00,
    bank: "Goldman Sachs",
    sender: "Goldman Sachs Investment",
    accountNumber: "GS-20080418",
    date: "2008-04-18",
    time: "10:15",
    year: "2008",
    remark: "Stock market investment",
    status: "completed",
    category: "investment",
    displayTimestamp: "Apr 18, 2008 • 10:15 AM",
    balanceAfter: 7149975.00
  },
  {
    id: 5,
    userId: 1,
    transactionId: "TX200808041001",
    type: "debit",
    amount: 4000000.00,
    bank: "Virtual Savings Bank",
    sender: "Mark J. Fanshaw",
    accountNumber: "VSB-SAFE001",
    date: "2008-08-04",
    time: "10:30",
    year: "2008",
    remark: "Safe Box deposit - High security storage",
    status: "completed",
    category: "safebox",
    displayTimestamp: "Aug 4, 2008 • 10:30 AM",
    balanceAfter: 3149975.00
  },
  {
    id: 6,
    userId: 1,
    transactionId: "TX200808152001",
    type: "debit",
    amount: 500.00,
    bank: "Bank of America",
    sender: "ATM WITHDRAWAL",
    accountNumber: "ATM*****456",
    date: "2008-08-15",
    time: "16:45",
    year: "2008",
    remark: "Cash withdrawal - Miami Downtown",
    status: "completed",
    category: "atm",
    displayTimestamp: "Aug 15, 2008 • 04:45 PM",
    balanceAfter: 3149475.00
  },
  {
    id: 7,
    userId: 1,
    transactionId: "TX200809220501",
    type: "debit",
    amount: 500000.00,
    bank: "JPMorgan Chase",
    sender: "Startup Ventures LLC",
    accountNumber: "SV-20080922",
    date: "2008-09-22",
    time: "11:20",
    year: "2008",
    remark: "Business partnership investment",
    status: "completed",
    category: "investment",
    displayTimestamp: "Sep 22, 2008 • 11:20 AM",
    balanceAfter: 2649475.00
  },
  {
    id: 8,
    userId: 1,
    transactionId: "TX200810150601",
    type: "debit",
    amount: 150000.00,
    bank: "Citibank",
    sender: "Red Cross International",
    accountNumber: "RCI-20081015",
    date: "2008-10-15",
    time: "09:00",
    year: "2008",
    remark: "Charitable donation for disaster relief",
    status: "completed",
    category: "donation",
    displayTimestamp: "Oct 15, 2008 • 09:00 AM",
    balanceAfter: 2499475.00
  },
  {
    id: 9,
    userId: 1,
    transactionId: "TX200811200701",
    type: "debit",
    amount: 200000.00,
    bank: "Wells Fargo",
    sender: "Lamborghini Miami",
    accountNumber: "LM-20081120",
    date: "2008-11-20",
    time: "15:45",
    year: "2008",
    remark: "Vehicle purchase - Lamborghini Gallardo",
    status: "completed",
    category: "payment",
    displayTimestamp: "Nov 20, 2008 • 03:45 PM",
    balanceAfter: 2299475.00
  },
  {
    id: 10,
    userId: 1,
    transactionId: "TX200812100801",
    type: "debit",
    amount: 50000.00,
    bank: "HSBC Bank",
    sender: "Bank of England",
    accountNumber: "BOE-20081210",
    date: "2008-12-10",
    time: "13:30",
    year: "2008",
    remark: "International wire transfer to UK account",
    status: "completed",
    category: "transfer",
    displayTimestamp: "Dec 10, 2008 • 01:30 PM",
    balanceAfter: 2249475.00
  },
  {
    id: 11,
    userId: 1,
    transactionId: "TX200812311001",
    type: "credit",
    amount: 8425.75,
    bank: "Virtual Savings Bank",
    sender: "QUARTERLY INTEREST",
    accountNumber: "VSB20240012345",
    date: "2008-12-31",
    time: "23:59",
    year: "2008",
    remark: "Quarterly interest payment",
    status: "completed",
    category: "interest",
    displayTimestamp: "Dec 31, 2008 • 11:59 PM",
    balanceAfter: 2257900.75
  },
  
  // 2009 Transactions
  {
    id: 12,
    userId: 1,
    transactionId: "TX200903310901",
    type: "credit",
    amount: 12500.50,
    bank: "Virtual Savings Bank",
    sender: "QUARTERLY INTEREST",
    accountNumber: "VSB20240012345",
    date: "2009-03-31",
    time: "23:59",
    year: "2009",
    remark: "Quarterly interest payment",
    status: "completed",
    category: "interest",
    displayTimestamp: "Mar 31, 2009 • 11:59 PM",
    balanceAfter: 2270401.25
  },
  {
    id: 13,
    userId: 1,
    transactionId: "TX200904150001",
    type: "debit",
    amount: 300000.00,
    bank: "SunTrust Bank",
    sender: "Florida Properties Group",
    accountNumber: "FPG-20090415",
    date: "2009-04-15",
    time: "10:00",
    year: "2009",
    remark: "Vacation home down payment - Key West",
    status: "completed",
    category: "real_estate",
    displayTimestamp: "Apr 15, 2009 • 10:00 AM",
    balanceAfter: 1970401.25
  },
  {
    id: 14,
    userId: 1,
    transactionId: "TX200906300001",
    type: "credit",
    amount: 15275.00,
    bank: "Virtual Savings Bank",
    sender: "ANNUAL DIVIDEND",
    accountNumber: "VSB20240012345",
    date: "2009-06-30",
    time: "23:59",
    year: "2009",
    remark: "Annual dividend payment",
    status: "completed",
    category: "dividend",
    displayTimestamp: "Jun 30, 2009 • 11:59 PM",
    balanceAfter: 1985676.25
  },
  {
    id: 15,
    userId: 1,
    transactionId: "TX200907200001",
    type: "debit",
    amount: 100000.00,
    bank: "Bank of the West",
    sender: "Miami Yacht Sales",
    accountNumber: "MYS-20090720",
    date: "2009-07-20",
    time: "14:30",
    year: "2009",
    remark: "Yacht down payment",
    status: "completed",
    category: "payment",
    displayTimestamp: "Jul 20, 2009 • 02:30 PM",
    balanceAfter: 1885676.25
  },
  {
    id: 16,
    userId: 1,
    transactionId: "TX200908150001",
    type: "debit",
    amount: 25000.00,
    bank: "PNC Bank",
    sender: "Various Vendors",
    accountNumber: "BD-20090815",
    date: "2009-08-15",
    time: "18:00",
    year: "2009",
    remark: "Birthday party expenses",
    status: "completed",
    category: "payment",
    displayTimestamp: "Aug 15, 2009 • 06:00 PM",
    balanceAfter: 1860676.25
  },
  {
    id: 17,
    userId: 1,
    transactionId: "TX200912310001",
    type: "credit",
    amount: 16500.25,
    bank: "Virtual Savings Bank",
    sender: "YEAR-END INTEREST",
    accountNumber: "VSB20240012345",
    date: "2009-12-31",
    time: "23:59",
    year: "2009",
    remark: "Annual interest earned",
    status: "completed",
    category: "interest",
    displayTimestamp: "Dec 31, 2009 • 11:59 PM",
    balanceAfter: 1877176.50
  },
  
  // 2010 Transactions
  {
    id: 18,
    userId: 1,
    transactionId: "TX201001150001",
    type: "debit",
    amount: 50000.00,
    bank: "Royal Bank of Canada",
    sender: "Royal Caribbean",
    accountNumber: "RC-20100115",
    date: "2010-01-15",
    time: "12:00",
    year: "2010",
    remark: "Luxury cruise vacation package",
    status: "completed",
    category: "payment",
    displayTimestamp: "Jan 15, 2010 • 12:00 PM",
    balanceAfter: 1827176.50
  },
  {
    id: 19,
    userId: 1,
    transactionId: "TX201002280001",
    type: "debit",
    amount: 100000.00,
    bank: "Sotheby's Financial Services",
    sender: "Sotheby's Auction",
    accountNumber: "SA-20100228",
    date: "2010-02-28",
    time: "19:30",
    year: "2010",
    remark: "Art purchase at auction",
    status: "completed",
    category: "payment",
    displayTimestamp: "Feb 28, 2010 • 07:30 PM",
    balanceAfter: 1727176.50
  },
  {
    id: 20,
    userId: 1,
    transactionId: "TX201005150001",
    type: "debit",
    amount: 250000.00,
    bank: "Morgan Stanley",
    sender: "Morgan Stanley Investment",
    accountNumber: "MS-20100515",
    date: "2010-05-15",
    time: "09:45",
    year: "2010",
    remark: "Blue chip stock investment",
    status: "completed",
    category: "investment",
    displayTimestamp: "May 15, 2010 • 09:45 AM",
    balanceAfter: 1477176.50
  },
  {
    id: 21,
    userId: 1,
    transactionId: "TX201007300001",
    type: "debit",
    amount: 50000.00,
    bank: "Bank of New York Mellon",
    sender: "Bill & Melinda Gates Foundation",
    accountNumber: "BMGF-20100730",
    date: "2010-07-30",
    time: "11:00",
    year: "2010",
    remark: "Charitable donation",
    status: "completed",
    category: "donation",
    displayTimestamp: "Jul 30, 2010 • 11:00 AM",
    balanceAfter: 1427176.50
  },
  {
    id: 22,
    userId: 1,
    transactionId: "TX201008150001",
    type: "debit",
    amount: 50000.00,
    bank: "Fifth Third Bank",
    sender: "Various Vendors",
    accountNumber: "BD-20100815",
    date: "2010-08-15",
    time: "20:00",
    year: "2010",
    remark: "Birthday celebration and gifts",
    status: "completed",
    category: "payment",
    displayTimestamp: "Aug 15, 2010 • 08:00 PM",
    balanceAfter: 1377176.50
  },
  {
    id: 23,
    userId: 1,
    transactionId: "TX201010100001",
    type: "debit",
    amount: 200000.00,
    bank: "Scotiabank",
    sender: "Bahamas Properties Ltd.",
    accountNumber: "BPL-20101010",
    date: "2010-10-10",
    time: "15:30",
    year: "2010",
    remark: "Beachfront property deposit - Bahamas",
    status: "completed",
    category: "real_estate",
    displayTimestamp: "Oct 10, 2010 • 03:30 PM",
    balanceAfter: 1177176.50
  },
  {
    id: 24,
    userId: 1,
    transactionId: "TX201011250001",
    type: "debit",
    amount: 50000.00,
    bank: "Capital One",
    sender: "NetJets",
    accountNumber: "NJ-20101125",
    date: "2010-11-25",
    time: "16:45",
    year: "2010",
    remark: "Private jet charter service",
    status: "completed",
    category: "payment",
    displayTimestamp: "Nov 25, 2010 • 04:45 PM",
    balanceAfter: 1127176.50
  },
  {
    id: 25,
    userId: 1,
    transactionId: "TX201012310001",
    type: "credit",
    amount: 22823.50,
    bank: "Virtual Savings Bank",
    sender: "YEAR-END INTEREST",
    accountNumber: "VSB20240012345",
    date: "2010-12-31",
    time: "23:59",
    year: "2010",
    remark: "Annual interest earned",
    status: "completed",
    category: "interest",
    displayTimestamp: "Dec 31, 2010 • 11:59 PM",
    balanceAfter: 1150000.00
  },
  
  // Additional debit to reach $204,000 balance
  {
    id: 26,
    userId: 1,
    transactionId: "TX201012311001",
    type: "debit",
    amount: 946000.00,
    bank: "UBS Wealth Management",
    sender: "Wealth Management Division",
    accountNumber: "WMD-20101231",
    date: "2010-12-31",
    time: "23:59",
    year: "2010",
    remark: "Portfolio rebalancing and final adjustment",
    status: "completed",
    category: "investment",
    displayTimestamp: "Dec 31, 2010 • 11:59 PM",
    balanceAfter: 204000.00
  }
];

// Get all transactions for user
router.get('/user/:userId', (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const userTransactions = transactions.filter(t => t.userId === userId);
    
    // Sort by date (newest first)
    userTransactions.sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time));
    
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

module.exports = router;
