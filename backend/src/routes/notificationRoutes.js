const express = require('express');
const router = express.Router();

// In-memory notifications - Updated with all messages
let notifications = [
  // 2026 Notifications (Newest at the top)
  {
    id: 1,
    userId: 1,
    type: 'urgent',
    title: 'FINAL URGENT NOTICE - 18 Year Settlement',
    content: 'After 18 years of weekly accruals, compounded interest, penalties, and accumulated fees on your Save Box "Sean\'s 2008," the final settlement amount has been calculated as $209,000. You must contact us immediately at 1-800-VIRTUALS to arrange payment or discuss limited settlement options.',
    isRead: false,
    timestamp: '2026-03-01T09:00:00Z',
    icon: 'fas fa-exclamation-triangle'
  },

  // 2025 Notifications
  {
    id: 2,
    userId: 1,
    type: 'info',
    title: 'Happy Birthday! Final Pre-Collection Amount',
    content: 'Happy Birthday! Final pre-collection amount: $205,890.75.',
    isRead: false,
    timestamp: '2025-08-15T10:00:00Z',
    icon: 'fas fa-birthday-cake'
  },

  // 2024 Notifications
  {
    id: 3,
    userId: 1,
    type: 'info',
    title: 'Happy New Year - Settlement Offer',
    content: 'Happy New Year. Current debt: $192,380.95. Settlement offer: 15% discount if paid in full by March 2024.',
    isRead: false,
    timestamp: '2024-01-01T00:00:00Z',
    icon: 'fas fa-calendar-alt'
  },
  {
    id: 4,
    userId: 1,
    type: 'info',
    title: 'Happy Birthday 2024',
    content: 'Happy Birthday! Outstanding: $198,760.50.',
    isRead: false,
    timestamp: '2024-08-15T10:00:00Z',
    icon: 'fas fa-birthday-cake'
  },

  // 2023 Notifications
  {
    id: 5,
    userId: 1,
    type: 'info',
    title: 'Happy Birthday 2023',
    content: 'Happy Birthday! Amount due: $185,670.40.',
    isRead: false,
    timestamp: '2023-08-15T10:00:00Z',
    icon: 'fas fa-birthday-cake'
  },

  // 2022 Notifications
  {
    id: 6,
    userId: 1,
    type: 'info',
    title: 'Happy New Year 2022',
    content: 'Happy New Year. Total due: $152,380.80.',
    isRead: false,
    timestamp: '2022-01-01T00:00:00Z',
    icon: 'fas fa-calendar-alt'
  },
  {
    id: 7,
    userId: 1,
    type: 'info',
    title: 'Happy Birthday 2022',
    content: 'Happy Birthday! Balance: $168,945.25.',
    isRead: false,
    timestamp: '2022-08-15T10:00:00Z',
    icon: 'fas fa-birthday-cake'
  },

  // 2021 Notifications
  {
    id: 8,
    userId: 1,
    type: 'info',
    title: 'Happy Birthday 2021',
    content: 'Happy Birthday! Outstanding: $135,760.35.',
    isRead: false,
    timestamp: '2021-08-15T10:00:00Z',
    icon: 'fas fa-birthday-cake'
  },

  // 2020 Notifications
  {
    id: 9,
    userId: 1,
    type: 'urgent',
    title: 'COVID-19 Advisory - Payment Plans Available',
    content: 'While we understand these are difficult times, your outstanding balance remains at $98,760.45. Payment plans available.',
    isRead: false,
    timestamp: '2020-03-15T09:30:00Z',
    icon: 'fas fa-virus'
  },
  {
    id: 10,
    userId: 1,
    type: 'info',
    title: 'Happy Birthday 2020',
    content: 'Happy Birthday! Amount due: $110,850.90.',
    isRead: false,
    timestamp: '2020-08-15T10:00:00Z',
    icon: 'fas fa-birthday-cake'
  },

  // 2019 Notifications
  {
    id: 11,
    userId: 1,
    type: 'info',
    title: 'Happy New Year 2019',
    content: 'Happy New Year. Current due: $79,380.75.',
    isRead: false,
    timestamp: '2019-01-01T00:00:00Z',
    icon: 'fas fa-calendar-alt'
  },
  {
    id: 12,
    userId: 1,
    type: 'info',
    title: 'Happy Birthday 2019',
    content: 'Happy Birthday! Balance: $89,650.30.',
    isRead: false,
    timestamp: '2019-08-15T10:00:00Z',
    icon: 'fas fa-birthday-cake'
  },

  // 2018 Notifications
  {
    id: 13,
    userId: 1,
    type: 'info',
    title: 'Happy Birthday 2018',
    content: 'Happy Birthday! Accumulated amount: $68,945.60.',
    isRead: false,
    timestamp: '2018-08-15T10:00:00Z',
    icon: 'fas fa-birthday-cake'
  },

  // 2017 Notifications
  {
    id: 14,
    userId: 1,
    type: 'info',
    title: 'New Year Greetings 2017',
    content: 'A new year is here, bringing fresh goals, new plans, and endless possibilities. As you move through the year ahead, QuickCheck is here to help you stay prepared, handle the unexpected, and keep your plans moving forward with financial support when you need it. Happy New Year from all of us at VSB.',
    isRead: false,
    timestamp: '2017-01-01T00:00:00Z',
    icon: 'fas fa-calendar-alt'
  },
  {
    id: 15,
    userId: 1,
    type: 'urgent',
    title: 'Legal Notice - Potential Litigation',
    content: 'Legal Notice: Account marked for potential litigation. Balance: $45,380.90.',
    isRead: false,
    timestamp: '2017-03-15T09:30:00Z',
    icon: 'fas fa-gavel'
  },
  {
    id: 16,
    userId: 1,
    type: 'info',
    title: 'Happy Birthday 2017',
    content: 'Hey Fanshaw, Today, may you experience joy and laughter. And may your new year be full of opportunities. Thanks for being a part of our community; we are grateful for you. Have a beautiful celebration!',
    isRead: false,
    timestamp: '2017-08-15T10:00:00Z',
    icon: 'fas fa-birthday-cake'
  },

  // 2016 Notifications
  {
    id: 17,
    userId: 1,
    type: 'info',
    title: 'Happy New Year 2016',
    content: 'Happy New Year. Outstanding debt: $28,760.40.',
    isRead: false,
    timestamp: '2016-01-05T09:00:00Z',
    icon: 'fas fa-calendar-alt'
  },
  {
    id: 18,
    userId: 1,
    type: 'urgent',
    title: 'Account Inactivity Warning',
    content: 'We noticed your account have been inactive for 4 years ago and we\'ve mail you several times. Your monthly maintenance fees is accommodating and we are unable to withdraw it from your save box in this case your account will be inactive and unable to withdraw, pay bill, transfer, until the fees are paid.',
    isRead: false,
    timestamp: '2016-01-05T10:30:00Z',
    icon: 'fas fa-exclamation-circle'
  },
  {
    id: 19,
    userId: 1,
    type: 'info',
    title: 'Happy Birthday 2016',
    content: 'Celebrate it\'s your birthday. Wishing you all the best on this special day enjoy your moment! From all of us at VSB.',
    isRead: false,
    timestamp: '2016-08-15T10:00:00Z',
    icon: 'fas fa-birthday-cake'
  },

  // 2015 Notifications
  {
    id: 20,
    userId: 1,
    type: 'urgent',
    title: 'Final Warning - Collections Referral',
    content: 'Final Warning: Total due: $18,650.30. This account will be referred to collections if not settled within 90 days.',
    isRead: false,
    timestamp: '2015-06-15T09:30:00Z',
    icon: 'fas fa-exclamation-triangle'
  },
  {
    id: 21,
    userId: 1,
    type: 'info',
    title: 'Happy Birthday 2015',
    content: 'Happy Birthday! Balance: $21,340.85.',
    isRead: false,
    timestamp: '2015-08-15T10:00:00Z',
    icon: 'fas fa-birthday-cake'
  },

  // 2014 Notifications
  {
    id: 22,
    userId: 1,
    type: 'urgent',
    title: 'Urgent Notice - Legal Proceedings',
    content: 'Urgent Notice: Your accumulated fees have reached $8,945.20. Legal proceedings may commence if unresolved.',
    isRead: false,
    timestamp: '2014-01-10T09:30:00Z',
    icon: 'fas fa-balance-scale'
  },
  {
    id: 23,
    userId: 1,
    type: 'info',
    title: 'Happy Birthday 2014',
    content: 'Happy Birthday! Current debt: $12,380.75.',
    isRead: false,
    timestamp: '2014-08-15T10:00:00Z',
    icon: 'fas fa-birthday-cake'
  },

  // 2013 Notifications
  {
    id: 24,
    userId: 1,
    type: 'urgent',
    title: 'Tax Withholding Notice',
    content: 'Tax Withholding Notice: Unpaid tax on accrued interest estimated at $300/year has been added to your outstanding balance.',
    isRead: false,
    timestamp: '2013-03-30T09:30:00Z',
    icon: 'fas fa-file-invoice-dollar'
  },
  {
    id: 25,
    userId: 1,
    type: 'info',
    title: 'Happy Birthday 2013',
    content: 'Happy Birthday! Outstanding balance: $5,672.35.',
    isRead: false,
    timestamp: '2013-08-15T10:00:00Z',
    icon: 'fas fa-birthday-cake'
  },

  // 2012 Notifications
  {
    id: 26,
    userId: 1,
    type: 'info',
    title: 'Annual Fee Update 2012',
    content: 'Annual Fee Update: 2012 maintenance fee ($500) added. Dormancy fee ($200) applied. Total due: $2,425.78.',
    isRead: false,
    timestamp: '2012-01-15T09:30:00Z',
    icon: 'fas fa-coins'
  },
  {
    id: 27,
    userId: 1,
    type: 'info',
    title: 'Happy Birthday 2012',
    content: 'Happy Birthday! Current outstanding balance: $3,189.42.',
    isRead: false,
    timestamp: '2012-08-15T10:00:00Z',
    icon: 'fas fa-birthday-cake'
  },

  // 2011 Notifications
  {
    id: 28,
    userId: 1,
    type: 'info',
    title: 'Claim Your Virtual Credit Card',
    content: 'Important notices: You can now claim your virtual credit card for free now for online shipping.',
    isRead: false,
    timestamp: '2011-01-02T09:00:00Z',
    icon: 'fas fa-credit-card'
  },
  {
    id: 29,
    userId: 1,
    type: 'info',
    title: 'New Features Available',
    content: 'Did you know you can now pay Bill buy, airtime, data in just a sec. Hurry up don\'t miss out.',
    isRead: false,
    timestamp: '2011-01-02T14:30:00Z',
    icon: 'fas fa-bolt'
  },
  {
    id: 30,
    userId: 1,
    type: 'info',
    title: 'Annual Fee Notice 2011',
    content: 'Annual Fee Notice: The 2011 annual maintenance fee of $500 is now due. Previous balance: $525. New total: $1,025.',
    isRead: false,
    timestamp: '2011-01-03T09:30:00Z',
    icon: 'fas fa-file-invoice'
  },
  {
    id: 31,
    userId: 1,
    type: 'urgent',
    title: 'Important Alert - Account Inactivity',
    content: 'Important Alert: Your account has shown no customer-initiated transactions for 12 months. After 24 months, a dormancy fee of $200 per year will apply.',
    isRead: false,
    timestamp: '2011-03-15T09:30:00Z',
    icon: 'fas fa-exclamation-circle'
  },
  {
    id: 32,
    userId: 1,
    type: 'info',
    title: 'Happy Birthday 2011',
    content: 'It\'s your special day, and we couldn\'t let it pass without sending our best wishes your way! As our esteemed customer, we wanted to take a moment to wish you a very happy birthday. May today bring you all the things that make you smile, and We hope you\'re feeling extra special today and celebrating in style. From all of us at VSB, Happy Birthday!',
    isRead: false,
    timestamp: '2011-08-15T10:00:00Z',
    icon: 'fas fa-birthday-cake'
  },
  {
    id: 33,
    userId: 1,
    type: 'info',
    title: 'Account Inactivity Reminder',
    content: 'We noticed your account is not active for the past 12 month please don\'t forget to check our new update. Thanks for banking with us.',
    isRead: false,
    timestamp: '2011-08-16T09:00:00Z',
    icon: 'fas fa-info-circle'
  },
  {
    id: 34,
    userId: 1,
    type: 'info',
    title: 'New Service Available',
    content: 'Did you know you can buy airtime to your loves one pay there bill with VSB. Hurry up now check you dashboard. Don\'t miss out.',
    isRead: false,
    timestamp: '2011-08-17T09:00:00Z',
    icon: 'fas fa-gift'
  },
  {
    id: 35,
    userId: 1,
    type: 'info',
    title: 'Year-End Summary 2011',
    content: 'Year-End Summary: Total fees and penalties due: $1,580.50 (including compounded interest at 8% annually).',
    isRead: false,
    timestamp: '2011-12-31T23:59:00Z',
    icon: 'fas fa-chart-bar'
  },

  // 2010 Notifications
  {
    id: 36,
    userId: 1,
    type: 'info',
    title: 'Happy New Year 2010',
    content: 'Happy New Year! Welcome to a new decade of saving with us.',
    isRead: false,
    timestamp: '2010-01-01T00:00:00Z',
    icon: 'fas fa-calendar-alt'
  },
  {
    id: 37,
    userId: 1,
    type: 'urgent',
    title: 'Annual Fee Notice 2010',
    content: 'Annual Fee Notice: Your Save Box annual maintenance fee of $500 is now due for the 2009-2010 period. Please visit any branch to settle.',
    isRead: false,
    timestamp: '2010-03-15T09:30:00Z',
    icon: 'fas fa-file-invoice'
  },
  {
    id: 38,
    userId: 1,
    type: 'urgent',
    title: 'Late Fee Reminder 2010',
    content: 'Reminder: The annual maintenance fee of $500 remains unpaid. A 5% late penalty ($25) has been applied. Total due: $525.',
    isRead: false,
    timestamp: '2010-06-30T09:30:00Z',
    icon: 'fas fa-exclamation-circle'
  },
  {
    id: 39,
    userId: 1,
    type: 'info',
    title: 'Happy Birthday 2010',
    content: 'Happy Birthday! Best wishes on your special day.',
    isRead: false,
    timestamp: '2010-08-15T10:00:00Z',
    icon: 'fas fa-birthday-cake'
  },
  {
    id: 40,
    userId: 1,
    type: 'urgent',
    title: 'Final Notice for 2010',
    content: 'Final Notice for 2010: Unpaid fees are accumulating. Current total due: $525.',
    isRead: false,
    timestamp: '2010-12-01T09:30:00Z',
    icon: 'fas fa-exclamation-triangle'
  },
  {
    id: 41,
    userId: 1,
    type: 'info',
    title: 'Merry Christmas 2010',
    content: 'Merry Christmas! Please note that unresolved fees continue to accrue interest.',
    isRead: false,
    timestamp: '2010-12-25T00:00:00Z',
    icon: 'fas fa-tree'
  },

  // 2009 Notifications
  {
    id: 42,
    userId: 1,
    type: 'info',
    title: 'Happy New Year 2009',
    content: 'Happy New Year! May this year bring you prosperity, health, and happiness. We appreciate your continued trust in our services.',
    isRead: false,
    timestamp: '2009-01-01T00:00:00Z',
    icon: 'fas fa-calendar-alt'
  },
  {
    id: 43,
    userId: 1,
    type: 'info',
    title: 'Happy Birthday 2009',
    content: 'Happy Birthday! Wishing you a wonderful celebration and a year filled with blessings and joy.',
    isRead: false,
    timestamp: '2009-08-15T10:00:00Z',
    icon: 'fas fa-birthday-cake'
  },
  {
    id: 44,
    userId: 1,
    type: 'info',
    title: 'Merry Christmas 2009',
    content: 'Merry Christmas! Season\'s greetings from all of us at Virtual Saving Bank.',
    isRead: false,
    timestamp: '2009-12-25T00:00:00Z',
    icon: 'fas fa-tree'
  },

  // 2008 Notifications (Oldest at the bottom)
  {
    id: 45,
    userId: 1,
    type: 'welcome',
    title: 'Save Box Successfully Opened',
    content: 'Dear Mr. Fanshaw, Welcome to Virtual Saving Bank. Your Save Box "Sean\'s 2008" has been successfully opened. This special savings product offers secure storage with manual fee management requirements. Your save box balance are save with us. Thank for banking with us.',
    isRead: false,
    timestamp: '2008-01-04T10:00:00Z',
    icon: 'fas fa-vault'
  },
  {
    id: 46,
    userId: 1,
    type: 'info',
    title: 'Weekly Account Confirmation',
    content: 'Dear Mr. Fanshaw, Weekly account confirmation: Your Save Box balance is secure and growing. Remember that this account type requires manual fee settlement annually to protect your money if not interested you can withdraw your funds immediately.',
    isRead: false,
    timestamp: '2008-01-11T09:00:00Z',
    icon: 'fas fa-check-circle'
  },
  {
    id: 47,
    userId: 1,
    type: 'warning',
    title: 'System Maintenance Notice',
    content: 'Dear Mr. Fanshaw, Weekly update: All systems are down at this moment. Transaction and withdrawal may be delayed from 9am to 10pm.',
    isRead: false,
    timestamp: '2008-01-18T09:00:00Z',
    icon: 'fas fa-tools'
  },
  {
    id: 48,
    userId: 1,
    type: 'transaction',
    title: 'Large Deposit Received',
    content: '$7,500,000.00 has been deposited to your account from Washington Mutual Bank. The funds are now available for your use.',
    isRead: false,
    timestamp: '2008-02-15T09:45:00Z',
    icon: 'fas fa-money-bill-wave'
  },
  {
    id: 49,
    userId: 1,
    type: 'safebox',
    title: 'Safe Box Deposit Confirmed',
    content: '$4,000,000.00 has been securely deposited in your Safe Box #VSB-SAFE001. Your assets are protected with 256-bit encryption and 24/7 monitoring.',
    isRead: false,
    timestamp: '2008-08-04T10:30:00Z',
    icon: 'fas fa-vault'
  },
  {
    id: 50,
    userId: 1,
    type: 'transaction',
    title: 'ATM Withdrawal Completed',
    content: '$500.00 has been withdrawn from your account via Bank of America ATM at Miami Downtown location. Receipt number: ATM-456789.',
    isRead: true,
    timestamp: '2008-08-15T16:45:00Z',
    icon: 'fas fa-money-bill-wave'
  },
  {
    id: 51,
    userId: 1,
    type: 'info',
    title: 'Interest Payment Processed',
    content: 'Your quarterly interest payment of $8,425.75 has been credited to your account. Total interest earned this year: $15,275.00.',
    isRead: false,
    timestamp: '2009-03-31T23:59:00Z',
    icon: 'fas fa-percentage'
  },
  {
    id: 52,
    userId: 1,
    type: 'info',
    title: 'Merry Christmas 2008',
    content: 'Dear Mr. Fanshaw, Merry Christmas! Wishing you and your family a blessed holiday season filled with joy and peace. Thank you for choosing Virtual Saving Bank.',
    isRead: false,
    timestamp: '2008-12-25T00:00:00Z',
    icon: 'fas fa-tree'
  },
  {
    id: 53,
    userId: 1,
    type: 'info',
    title: 'Account Statement Ready 2010',
    content: 'Your 2010 annual statement is now available for download. It includes all transactions from January to December 2010 with detailed summaries.',
    isRead: true,
    timestamp: '2011-01-15T14:20:00Z',
    icon: 'fas fa-file-invoice-dollar'
  },
  {
    id: 54,
    userId: 1,
    type: 'welcome',
    title: 'Welcome to Virtual Savings Bank',
    content: 'Your premium savings account has been successfully activated. You can now access all banking features including Safe Box storage and investment options.',
    isRead: false,
    timestamp: '2008-02-01T10:00:00Z',
    icon: 'fas fa-user-plus'
  }
];

// Get notifications for user
router.get('/user/:userId', (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const userNotifications = notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    const unreadCount = userNotifications.filter(n => !n.isRead).length;
    
    res.json({
      success: true,
      data: userNotifications,
      unreadCount: unreadCount
    });
    
  } catch (error) {
    console.error('Notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Mark notification as read
router.patch('/:id/read', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const userId = parseInt(req.query.userId);
    
    const notification = notifications.find(n => n.id === id && n.userId === userId);
    
    if (notification) {
      notification.isRead = true;
      res.json({
        success: true,
        message: 'Notification marked as read'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Mark all notifications as read
router.patch('/mark-all-read/:userId', (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    notifications = notifications.map(n => 
      n.userId === userId ? { ...n, isRead: true } : n
    );
    
    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
    
  } catch (error) {
    console.error('Mark all read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Create notification (for customer service)
router.post('/', (req, res) => {
  try {
    const { userId, type, title, content, icon } = req.body;
    
    const newNotification = {
      id: notifications.length + 1,
      userId: parseInt(userId),
      type: type || 'message',
      title: title || 'New Message',
      content: content || '',
      isRead: false,
      timestamp: new Date().toISOString(),
      icon: icon || 'fas fa-envelope'
    };
    
    notifications.push(newNotification);
    
    res.json({
      success: true,
      data: newNotification,
      message: 'Notification created'
    });
    
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
