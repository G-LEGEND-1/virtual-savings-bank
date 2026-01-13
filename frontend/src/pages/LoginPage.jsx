import React, { useState } from 'react';

const API_BASE = 'http://localhost:5001/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isOTP, setIsOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [loginAttempt, setLoginAttempt] = useState(null);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!data.success) {
        setError(data.message || 'Failed to authenticate');
        setLoading(false);
        return;
      }
      
      // ADMIN: Login directly
      if (data.user && data.user.role === 'admin') {
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/admin';
        return;
      }
      
      // USER: Show OTP input
      setMaskedEmail(data.maskedEmail || maskEmail(email));
      setIsOTP(true);
      setLoginAttempt(data);
      setLoading(false);
      
      // Show email sent confirmation
      alert(`📧 OTP SENT!\n\nAn OTP has been sent to your email.\n\n✅ Check your email for the 6-digit code\n✅ Enter it below to login`);
      
    } catch (err) {
      console.error('OTP send error:', err);
      setError('Failed to connect to server');
      setLoading(false);
    }
  };

  const maskEmail = (email) => {
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 2) {
      return `${localPart[0]}***@${domain}`;
    }
    return `${localPart[0]}${'*'.repeat(localPart.length - 2)}${localPart.slice(-1)}@${domain}`;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!isOTP) {
      await handleSendOTP(e);
      return;
    }
    
    if (!otp || otp.length !== 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      
      const data = await response.json();
      
      if (!data.success) {
        setError(data.message || 'Invalid OTP');
        setLoading(false);
        return;
      }
      
      // Successful login
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Show welcome message
      alert(`🎉 WELCOME BACK!\n\n${data.user.fullName}\n\n✅ Login successful!`);
      
      window.location.href = '/dashboard';
      
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE}/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (!data.success) {
        setError(data.message || 'Failed to resend OTP');
        setLoading(false);
        return;
      }
      
      // OTP resent successfully
      setLoading(false);
      
      // Update masked email if provided
      if (data.maskedEmail) {
        setMaskedEmail(data.maskedEmail);
      }
      
      alert(`📧 OTP RESENT!\n\nNew OTP has been sent to your email.\n\n✅ Check your email for the new 6-digit code`);
      
    } catch (err) {
      console.error('Resend OTP error:', err);
      setError('Failed to resend OTP');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 text-center">
          <div className="text-4xl mb-4">
            <i className="fas fa-university"></i>
          </div>
          <h1 className="text-2xl font-bold">VIRTUAL SAVINGS BANK</h1>
          <p className="opacity-90 mt-2">Secure Digital Banking Since 2008</p>
        </div>

        <div className="p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Secure Login</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin}>
            {!isOTP ? (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                  />
                </div>
              </>
            ) : (
              <div className="mb-4">
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center">
                    <i className="fas fa-envelope text-blue-600 mr-2"></i>
                    <div>
                      <p className="text-sm font-medium text-blue-800">OTP sent to your email</p>
                      <p className="text-blue-600 font-bold">{maskedEmail}</p>
                    </div>
                  </div>
                </div>
                
                <label className="block text-gray-700 mb-2">
                  6-Digit OTP Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-2xl text-center tracking-widest"
                  placeholder="123456"
                  maxLength={6}
                  required
                  disabled={loading}
                  autoFocus
                />
                <div className="text-sm text-gray-500 mt-2 text-center">
                  Enter the 6-digit OTP sent to your email
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}`}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  {isOTP ? 'Verifying...' : 'Processing...'}
                </>
              ) : (
                <>
                  <i className="fas fa-lock mr-2"></i>
                  {isOTP ? 'Verify OTP & Login' : 'Send OTP & Continue'}
                </>
              )}
            </button>
          </form>

          {isOTP && (
            <div className="mt-4 text-center">
              <button
                onClick={handleResendOTP}
                disabled={loading}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                <i className="fas fa-redo mr-1"></i>
                Resend OTP
              </button>
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setEmail('');
                setPassword('');
                setOtp('');
                setIsOTP(false);
                setError('');
                setMaskedEmail('');
                setLoginAttempt(null);
              }}
              className="text-blue-600 hover:text-blue-800"
            >
              <i className="fas fa-redo mr-1"></i>
              {isOTP ? 'Back to Login' : 'Reset Form'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
