const express = require('express');
const router = express.Router();

// Inline transaction data with updated bank names
const transactions = [
  // 2008 Transactions
  {
    id: 1,
    userId: 1,
    transactionId: "628258765420080217",
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
    transactionId: "62854637200802281001",
    type: "debit",
    amount: 2300.00,
    bank: "Virtual Savings Bank",
    sender: "VIRTUAL BANK",
    accountNumber: "****012345",
    date: "2008-02-28",
    time: "00:01",
    year: "2008",
    remark: "Monthly account maintenance fee",
    status: "completed",
    category: "fee",
    displayTimestamp: "Feb 28, 2008 • 12:01 AM",
    balanceAfter: 7490700.00
  },
  {
    id: 3,
    userId: 1,
    transactionId: "62500803150301",
    type: "debit",
    amount: 250000.00,
    bank: "Bank of America",
    sender: "Miami Properties Inc.",
    accountNumber: "*****982097",
    date: "2008-03-15",
    time: "14:30",
    year: "2008",
    remark: "Real estate down payment - Miami condo",
    status: "completed",
    category: "persinal transfer",
    displayTimestamp: "Mar 15, 2008 • 02:30 PM",
    balanceAfter: 7240700.00
  },
  {
    id: 4,
    userId: 1,
    transactionId: "565200804180401",
    type: "debit",
    amount: 2000000.00,
    bank: "Goldman Sachs",
    sender: "Goldman Sachs Investment",
    accountNumber: "*******4618",
    date: "2008-04-18",
    time: "10:15",
    year: "2008",
    remark: "Stock market investment",
    status: "completed",
    category: "persinal transfee",
    displayTimestamp: "Apr 18, 2008 • 10:15 AM",
    balanceAfter: 5490700.00
  },
  {
    id: 5,
    userId: 1,
    transactionId: "200808041001",
    type: "debit",
    amount: 400000.09,
    bank: "Virtual Savings Bank",
    sender: "Mark J. Fanshaw",
    accountNumber: "*****FE001",
    date: "2008-08-04",
    time: "10:30",
    year: "2008",
    remark: "Safe Box deposit - High security storage",
    status: "completed",
    category: "transfee",
    displayTimestamp: "Aug 4, 2008 • 10:30 AM",
    balanceAfter: 5090700.00
  },
  {
    id: 6,
    userId: 1,
    transactionId: "7875200808152001",
    type: "debit",
    amount: 500.00,
    bank: "Bank of America",
    sender: "ATM WITHDRAWAL",
    accountNumber: "ATM*****456",
    date: "2008-08-02",
    time: "16:45",
    year: "2008",
    remark: "Cash withdrawal - Miami Downtown",
    status: "completed",
    category: "atm",
    displayTimestamp: "Aug 02, 2008 • 04:45 PM",
    balanceAfter: 5090200.00
  },
  {
    id: 7,
    userId: 1,
    transactionId: "65500809220501",
    type: "debit",
    amount: 400000.00,
    bank: "SaveBox",
    sender: "",
    accountNumber: "****80922",
    date: "2008-08-04",
    time: "11:30",
    year: "2008",
    remark: "Business partnership investment",
    status: "completed",
    category: "investment",
    displayTimestamp: "Aug 04, 2008 • 11:30 AM",
    balanceAfter: 1090200.00
  },
  {
    id: 8,
    userId: 1,
    transactionId: "TX200810150601",
    type: "debit",
    amount: 150000.00,
    bank: "Citibank",
    sender: "Red Cross International",
    accountNumber: "*******081015",
    date: "2008-10-15",
    time: "09:00",
    year: "2008",
    remark: "Charitable donation for disaster relief",
    status: "completed",
    category: "transfer",
    displayTimestamp: "Oct 15, 2008 • 09:00 AM",
    balanceAfter: 940200.00
  },
  {
    id: 9,
    userId: 1,
    transactionId: "TX200811200701",
    type: "debit",
    amount: 200000.00,
    bank: "Wells Fargo",
    sender: "Lamborghini Miami",
    accountNumber: "*****081120",
    date: "2008-11-20",
    time: "15:45",
    year: "2008",
    remark: "Vehicle purchase - Lamborghini Gallardo",
    status: "completed",
    category: "payment",
    displayTimestamp: "Nov 20, 2008 • 03:45 PM",
    balanceAfter: 740200.00
  },
  {
    id: 10,
    userId: 1,
    transactionId: "55550812100801",
    type: "debit",
    amount: 50000.00,
    bank: "HSBC Bank",
    sender: "Bank of England",
    accountNumber: "*******81210",
    date: "2008-12-10",
    time: "13:30",
    year: "2008",
    remark: "International wire transfer to UK account",
    status: "completed",
    category: "transfer",
    displayTimestamp: "Dec 10, 2008 • 01:30 PM",
    balanceAfter: 690200.00
  },
  {
    id: 11,
    userId: 1,
    transactionId: "TX200812311001",
    type: "debit",
    amount: 8425.75,
    bank: "Virtual Savings Bank",
    sender: "samuel john thomas",
    accountNumber: "*******012345",
    date: "2008-12-31",
    time: "23:59",
    year: "2008",
    remark: "Quarterly interest payment",
    status: "completed",
    category: "transfer",
    displayTimestamp: "Dec 31, 2008 • 11:59 PM",
    balanceAfter: 681774.25
  },
  
  // 2009 Transactions
  {
    id: 12,
    userId: 1,
    transactionId: "65500903310901",
    type: "debit",
    amount: 12500.50,
    bank: "Virtual Savings Bank",
    sender: "QUARTERLY INTEREST",
    accountNumber: "*******40012345",
    date: "2009-03-31",
    time: "23:59",
    year: "2009",
    remark: "Quarterly interest payment",
    status: "completed",
    category: "transfer",
    displayTimestamp: "Mar 31, 2009 • 11:59 PM",
    balanceAfter: 669273.75
  },
  {
    id: 13,
    userId: 1,
    transactionId: "TX200904150001",
    type: "debit",
    amount: 300000.00,
    bank: "SunTrust Bank",
    sender: "Florida Properties Group",
    accountNumber: "******0415",
    date: "2009-04-15",
    time: "10:00",
    year: "2009",
    remark: "Vacation home down payment - Key West",
    status: "completed",
    category: "real_estate",
    displayTimestamp: "Apr 15, 2009 • 10:00 AM",
    balanceAfter: 369273.75
  },
  {
    id: 14,
    userId: 1,
    transactionId: "TX200906300001",
    type: "credit",
    amount: 15275.00,
    bank: "Virtual Savings Bank",
    sender: "MARK M, JOHNSON",
    accountNumber: "******40012345",
    date: "2009-06-30",
    time: "23:59",
    year: "2009",
    remark: "Annual dividend payment",
    status: "completed",
    category: "payment",
    displayTimestamp: "Jun 30, 2009 • 11:59 PM",
    balanceAfter: 353998.75
  },
  {
    id: 15,
    userId: 1,
    transactionId: "7655200907200001",
    type: "debit",
    amount: 100000.00,
    bank: "Bank of the West",
    sender: "Miami Yacht Sales",
    accountNumber: "*****0720",
    date: "2009-07-20",
    time: "14:30",
    year: "2009",
    remark: "Yacht down payment",
    status: "completed",
    category: "payment",
    displayTimestamp: "Jul 20, 2009 • 02:30 PM",
    balanceAfter: 253998.75
  },
  {
    id: 16,
    userId: 1,
    transactionId: "67654200908150001",
    type: "debit",
    amount: 25000.00,
    bank: "PNC Bank",
    sender: "Various Vendors",
    accountNumber: "******090815",
    date: "2009-08-15",
    time: "18:00",
    year: "2009",
    remark: "Birthday party expenses",
    status: "completed",
    category: "payment",
    displayTimestamp: "Aug 15, 2009 • 06:00 PM",
    balanceAfter: 228998.75
  },
  {
    id: 17,
    userId: 1,
    transactionId: "33233200912310001",
    type: "credit",
    amount: 10.09,
    bank: "Virtual Savings Bank",
    sender: "YEAR-END INTEREST",
    accountNumber: "*****0012345",
    date: "2009-12-31",
    time: "23:59",
    year: "2009",
    remark: "Annual interest earned",
    status: "completed",
    category: "interest",
    displayTimestamp: "Dec 31, 2009 • 11:59 PM",
    balanceAfter: 229008.84
  },
  
  // 2010 Transactions
  {
    id: 18,
    userId: 1,
    transactionId: "675201001150001",
    type: "debit",
    amount: 50000.00,
    bank: "Royal Bank of Canada",
    sender: "Royal Caribbean",
    accountNumber: "******100115",
    date: "2010-01-15",
    time: "12:00",
    year: "2010",
    remark: "Luxury cruise vacation package",
    status: "completed",
    category: "payment",
    displayTimestamp: "Jan 15, 2010 • 12:00 PM",
    balanceAfter: 179008.84
  },
  {
    id: 19,
    userId: 1,
    transactionId: "666555201002280001",
    type: "debit",
    amount: 100000.00,
    bank: "Sotheby's Financial Services",
    sender: "Sotheby's Auction",
    accountNumber: "******100228",
    date: "2010-02-28",
    time: "19:30",
    year: "2010",
    remark: "Art purchase at auction",
    status: "completed",
    category: "payment",
    displayTimestamp: "Feb 28, 2010 • 07:30 PM",
    balanceAfter: 79008.84
  },
  {
    id: 20,
    userId: 1,
    transactionId: "8755201005150001",
    type: "debit",
    amount: 25000.00,
    bank: "Morgan Stanley",
    sender: "Morgan Stanley Investment",
    accountNumber: "******0100515",
    date: "2010-05-15",
    time: "09:45",
    year: "2010",
    remark: "Blue chip stock investment",
    status: "completed",
    category: "investment",
    displayTimestamp: "May 15, 2010 • 09:45 AM",
    balanceAfter: 54008.84
  },
  {
    id: 21,
    userId: 1,
    transactionId: "94322201007300001",
    type: "debit",
    amount: 50000.00,
    bank: "Bank of New York Mellon",
    sender: "Bill & Melinda Gates Foundation",
    accountNumber: "******0730",
    date: "2010-07-30",
    time: "11:00",
    year: "2010",
    remark: "Charitable donation",
    status: "completed",
    category: "donation",
    displayTimestamp: "Jul 30, 2010 • 11:00 AM",
    balanceAfter: 4008.84
  },
  {
    id: 22,
    userId: 1,
    transactionId: "6854201008150001",
    type: "debit",
    amount: 1007.00,
    bank: "Fifth Third Bank",
    sender: "Various Vendors",
    accountNumber: "*****00815",
    date: "2010-08-15",
    time: "20:00",
    year: "2010",
    remark: "Birthday celebration and gifts",
    status: "completed",
    category: "payment",
    displayTimestamp: "Aug 15, 2010 • 08:00 PM",
    balanceAfter: 3008.14
  },
  {
    id: 23,
    userId: 1,
    transactionId: "6556201010100001",
    type: "debit",
    amount: 200.00,
    bank: "Scotiabank",
    sender: "Bahamas Properties Ltd.",
    accountNumber: "******01010",
    date: "2010-10-10",
    time: "15:30",
    year: "2010",
    remark: "Beachfront property deposit - Bahamas",
    status: "completed",
    category: "real_estate",
    displayTimestamp: "Oct 10, 2010 • 03:30 PM",
    balanceAfter: 2808.14
  },
  {
    id: 24,
    userId: 1,
    transactionId: "764201011250001",
    type: "debit",
    amount: 1000.00,
    bank: "Capital One",
    sender: "NetJets",
    accountNumber: "******0101125",
    date: "2010-11-25",
    time: "16:45",
    year: "2010",
    remark: "Private jet charter service",
    status: "completed",
    category: "payment",
    displayTimestamp: "Nov 25, 2010 • 04:45 PM",
    balanceAfter: 1808.14
  },
  {
    id: 25,
    userId: 1,
    transactionId: "7666201012310001",
    type: "credit",
    amount: 10.95,
    bank: "Virtual Savings Bank",
    sender: "YEAR-END INTEREST",
    accountNumber: "*****0012345",
    date: "2010-12-31",
    time: "23:59",
    year: "2010",
    remark: "Annual interest earned",
    status: "completed",
    category: "interest",
    displayTimestamp: "Dec 31, 2010 • 11:59 PM",
    balanceAfter: 1819.09
  },
  
  // Additional debit to reach $204,000 balance
  {
    id: 26,
    userId: 1,
    transactionId: "767201012311001",
    type: "debit",
    amount: 1809.00,
    bank: "UBS Wealth Management",
    sender: "Wealth Management Division",
    accountNumber: "*****101231",
    date: "2010-12-31",
    time: "23:59",
    year: "2010",
    remark: "Portfolio rebalancing and final adjustment",
    status: "completed",
    category: "investment",
    displayTimestamp: "Dec 31, 2010 • 11:59 PM",
    balanceAfter: 10.09
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
