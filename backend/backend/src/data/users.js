const users = [
  {
    id: 0,
    email: 'admin@virtualbank.com',
    password: 'admin123',
    role: 'admin',
    fullName: 'System Administrator',
    accountNumber: 'ADM001',
    joinDate: '2008-01-01'
  },
  {
    id: 1,
    email: 'fanshawmarkk@yahoo.com',
    password: 'Fanshawsadday1956',
    role: 'user',
    fullName: 'Mark Jackson Fanshaw',
    dateOfBirth: '1956-08-15',
    gender: 'Male',
    address: '123 Ocean Drive, Miami Beach, FL 33139',
    phone: '+1 (305) 555-0198',
    accountNumber: 'VSB20240012345',
    routingNumber: '021000021',
    accountType: 'Premium Savings',
    joinDate: '2008-02-01',
    status: 'active',
    kycVerified: true,
    totalBalance: 204000.00,
    availableBalance: 204000.00,
    safeBoxBalance: 4000000.00,
    lastLogin: new Date().toISOString()
  }
];

module.exports = users;
