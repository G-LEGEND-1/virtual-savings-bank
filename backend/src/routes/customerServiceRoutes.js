const express = require('express');
const router = express.Router();

// In-memory chat messages
let conversations = [
  {
    id: 1,
    userId: 1,
    userName: 'Mark Jackson Fanshaw',
    userEmail: 'fanshawmarkk@yahoo.com',
    messages: [
      {
        id: 1,
        sender: 'user',
        message: 'Hello, I need help with my Safe Box withdrawal process.',
        timestamp: '2026-01-09T10:30:00Z',
        read: true
      },
      {
        id: 2,
        sender: 'customer service ',
        message: 'hello Mr Fanshaw kindly provide us your full name and save box numner.',
        timestamp: '2026-01-09T10:35:00Z',
        read: true
      },
      {
        id: 3,
        sender: 'user',
        message: 'Safe Box #VSB-SAFE166, I want to withdraw my balance.',
        timestamp: '2026-01-09T10:40:00Z',
        read: true
      },
      {
        id: 4,
        sender: 'customer service',
        message: 'thank you for your request we will send you a mail as soon as we check your infirmation .',
        timestamp: '2026-01-09T10:45:00Z',
        read: false
      },
      {
        id: 5,
        sender: 'user',
        message: 'Hello there',
        timestamp: '2026-01-09T22:52:00Z',
        read: true
      },
      {
        id: 6,
        sender: 'user',
        message: 'How can I withdraw money sir',
        timestamp: '2026-01-09T22:52:00Z',
        read: true
      },
      {
        id: 7,
        sender: 'user',
        message: 'Pls. Check out the detail and let us know the pending tax etc',
        timestamp: '2026-01-09T23:11:00Z',
        read: true
      },
      {
        id: 8,
        sender: 'user',
        message: 'Sharon is waiting at your branch office in Texas',
        timestamp: '2026-01-09T23:13:00Z',
        read: true
      },
      {
        id: 9,
        sender: 'user',
        message: 'Her phone',
        timestamp: '2026-01-09T23:16:00Z',
        read: true
      },
      {
        id: 10,
        sender: 'user',
        message: '+16056558277',
        timestamp: '2026-01-09T23:16:00Z',
        read: true
      },
      {
        id: 11,
        sender: 'user',
        message: 'Name Mark Jackson Fenshaw',
        timestamp: '2026-01-09T23:25:00Z',
        read: true
      },
      {
        id: 12,
        sender: 'user',
        message: 'VSB-SAFE 001',
        timestamp: '2026-01-09T23:27:00Z',
        read: true
      },
      {
        id: 13,
        sender: 'customer service',
        message: 'Dear Mr. Fenshaw,\nWe sincerely apologize for any inconvenience caused and appreciate your patience. Please be advised that your SafeBox account is currently under review. Our team has forwarded your SafeBox ID to the Administration Department for verification, as the system currently indicates that the SafeBox is inactive.\nKindly allow 2–3 business days for the verification process. Our Customer Service team will notify you immediately once the administrator has completed the cross-check and your account status has been updated.\nWe value your trust in our services and remain committed to ensuring a secure and seamless banking experience for you.\nThank you for your understanding.',
        timestamp: '2026-01-10T02:05:00Z',
        read: false
      },
      {
        id: 14,
        sender: 'user',
        message: 'Can you please get back to us with positive solution at the earliest. Father died now I\'m Sharon fanshaw has the access to this AC and I\'m now the a. Owner. We can continue do Bo\'ness with you if you support. We have list of inheritance property to be reclaimed and we sure this fund to get those inheritance. Please support us with all your highlevel authority thanks',
        timestamp: '2026-01-10T03:47:00Z',
        read: true
      },
      {
        id: 15,
        sender: 'customer service',
        message: 'Dear Ms. Sharon Fanshaw,\n\nWe write to you on behalf of Virtual Savings Bank (VSB) regarding the SaveBox account opened by your late father, Mr. Fanshaw, with our institution.\n\nAccording to our records, on February 6, 2008, Mr. Fanshaw successfully opened an account with Virtual Savings Bank (VSB). At the time of account creation, he was introduced to our savings plans, namely SaveBox (Lifetime Savings for Future Use) and SaveInterest (Investment Savings Plan). He voluntarily chose the SaveBox plan.\n\nDuring the account setup, the terms and conditions of the SaveBox plan were clearly explained. These included a monthly tax/maintenance fee, and the requirement that sufficient balance must always be maintained in the SaveBox account. In the event of insufficient balance, the applicable fees would be deducted directly from the SaveBox savings.\n\nMr. Fanshaw informed the bank that the purpose of this savings was to secure the future of his daughter, Ms. Sharon Fanshaw, in case of any unforeseen circumstances. Consequently, a total amount of Four Million United States Dollars (USD 4,000,000) was deposited into the SaveBox account under this arrangement.\n\nOur system indicates that the required tax/maintenance fees, amounting to One Hundred and Nine Thousand United States Dollars (USD 209,000), have remained unpaid. Additionally, the account has been inactive since 2011, which led to the account being temporarily frozen in accordance with VSB security and compliance policies.\n\nFor security and regulatory reasons, our system requires that all outstanding tax/maintenance fees be fully settled before the SaveBox account can be reactivated. Once the account is reactivated, authorized withdrawal or further processing can proceed accordingly.\n\nPlease note that this procedure is strictly based on our internal banking system protocols and is applied uniformly to all SaveBox accounts.\nAnd to pay this tax fee Ms Sharon Fanshaw will have to visite any of our branch to identify her self \nBefore paying the tax fee\n\nShould you require clarification, verification, or guidance on the next steps, please do not hesitate to contact our support team. We are available to assist you professionally and transparently throughout this process.\n\nThank you for your understanding and cooperation.\n\nYours sincerely,\nVSB Support Team\nVirtual Savings Bank (VSB)',
        timestamp: '2026-01-10T07:22:00Z',
        read: false
      },
      {
        id: 16,
        sender: 'user',
        message: 'Thank you for writing to us and appreciate your speedy reply. I don\'t know how come the amount became so much high! I could read some of the messages written in 2008 stating that usd 8000 then after few years later it was showing 18000$. Since now I\'m the beneficiary/or the owner of the AC legally, I can give you an authorisation to debit due amount form the AC. Mean time kindly send the details tax statement particulars in my registered account mail ID. What about the interest on 4m deposit ? I can\'t see any interest accumulation since 18 years for that deposit of 4m. Please let me know',
        timestamp: '2026-01-10T09:29:00Z',
        read: true
      },
      {
        id: 17,
        sender: 'customer service',
        message: 'Dear Ms. Fanshaw,\n\nThank you for your response and for your continued communication with Virtual Savings Bank (VSB).\n\nWe acknowledge your concerns regarding the outstanding charges, interest expectations, and authorization request. Kindly allow us to clarify the situation based on our official records and the SaveBox Lifetime Savings Plan selected by your late father, Mr. Fanshaw, at the time of account opening.\n\nSaveBox Lifetime Plan Explanation\n\nIn February 2008, Mr. Fanshaw voluntarily enrolled in the SaveBox Lifetime Savings Plan, which is strictly designed for future security and preservation of funds, not for investment or interest generation. During enrollment, Mr. Fanshaw expressly confirmed and agreed that:\n\n- The SaveBox Lifetime plan does not attract interest, regardless of the deposited amount.\n- The funds were reserved specifically for beneficiary protection (in this case, you), not for profit growth.\n- A mandatory monthly tax/maintenance fee applies to the account for security, preservation, and lifetime holding.\n\nThis decision was made by Mr. Fanshaw because he stated clearly that the funds were to be preserved intact for his daughter\'s future use.\n\nReason for Increase in Charges\n\nThe tax/maintenance charges increased over time due to:\n\n- Long-term account inactivity since 2011\n- Accumulated unpaid monthly fees\n- Security preservation and regulatory holding costs over multiple years\n\nAs of today, the total outstanding tax/maintenance fee is USD 209,000.\n\nAccount Status & Authorization Request\n\nAlthough you are the legal beneficiary, our system does not permit debiting any fees directly from a frozen SaveBox account. For security and compliance reasons, the SaveBox must first be reactivated before any internal transaction or withdrawal can occur.\n\n⚠️ Reactivation is only possible after full settlement of the outstanding tax fee.\nThis is a fixed system protocol and cannot be overridden manually.\n\nTax Statement & Interest Inquiry\n\n- A detailed tax statement will be generated and sent to your registered email after the SaveBox is reactivated, as inactive accounts do not allow statement generation.\n- Regarding interest on the USD 4,000,000 deposit: no interest accrual exists on SaveBox Lifetime accounts, as agreed at the time of enrollment.\n\nOnce the outstanding USD 209,000 tax/maintenance fee is settled, the account will be:\n\n1. Reactivated\n2. Fully accessible\n3. Eligible for authorized withdrawal or restructuring\n\nWe appreciate your understanding that these procedures are strictly governed by our internal banking system and security policies, which apply uniformly to all SaveBox Lifetime accounts.\n\nShould you require further clarification, our support team remains available to assist you.\n\nKind regards,\nVSB Support Team\nVirtual Savings Bank (VSB)',
        timestamp: '2026-01-10T12:29:00Z',
        read: false
      }
    ],
    status: 'open',
    createdAt: '2026-01-09T10:30:00Z',
    updatedAt: '2026-01-10T12:29:00Z'
  }
];

// Get all conversations (admin only)
router.get('/conversations', (req, res) => {
  try {
    res.json({
      success: true,
      data: conversations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get conversation for user
router.get('/user/:userId', (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const conversation = conversations.find(c => c.userId === userId);
    
    if (!conversation) {
      // Create new conversation if none exists
      const newConversation = {
        id: conversations.length + 1,
        userId: userId,
        userName: 'Mark Jackson Fanshaw',
        userEmail: 'fanshawmarkk@yahoo.com',
        messages: [],
        status: 'open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      conversations.push(newConversation);
      return res.json({
        success: true,
        data: newConversation
      });
    }
    
    res.json({
      success: true,
      data: conversation
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Send message
router.post('/message', (req, res) => {
  try {
    const { userId, sender, message } = req.body;
    
    let conversation = conversations.find(c => c.userId === userId);
    
    if (!conversation) {
      conversation = {
        id: conversations.length + 1,
        userId: userId,
        userName: 'Mark Jackson Fanshaw',
        userEmail: 'fanshawmarkk@yahoo.com',
        messages: [],
        status: 'open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      conversations.push(conversation);
    }
    
    const newMessage = {
      id: conversation.messages.length + 1,
      sender: sender,
      message: message,
      timestamp: new Date().toISOString(),
      read: sender === 'user' // Admin messages are unread until user sees them
    };
    
    conversation.messages.push(newMessage);
    conversation.updatedAt = new Date().toISOString();
    
    res.json({
      success: true,
      data: newMessage,
      message: 'Message sent'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Mark messages as read
router.patch('/mark-read/:userId', (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const conversation = conversations.find(c => c.userId === userId);
    
    if (conversation) {
      conversation.messages.forEach(msg => {
        if (msg.sender === 'admin') {
          msg.read = true;
        }
      });
    }
    
    res.json({
      success: true,
      message: 'Messages marked as read'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;