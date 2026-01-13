import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import pages
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import NotificationsPage from './pages/NotificationsPage';

// API base URL - USING PORT 5001
const API_BASE = 'http://localhost:5001/api';

// Login Component
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isOTP, setIsOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('Sending request to:', `${API_BASE}/otp/send`);
      const response = await fetch(`${API_BASE}/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
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
      
      // USER: Show OTP
      setMaskedEmail(data.maskedEmail);
      setIsOTP(true);
      setLoading(false);
      
      // Show OTP in alert
      alert(`📧 OTP CODE\n\nFor: ${data.maskedEmail}\n\nYour OTP is:\n\n    ${data.otp}\n\n✅ Enter this code to login`);
      
    } catch (err) {
      console.error('OTP send error:', err);
      setError('Failed to connect to server. Make sure backend is running on port 5001');
      setLoading(false);
    }
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
      const response = await fetch(`${API_BASE}/otp/verify`, {
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
      window.location.href = data.user.role === 'admin' ? '/admin' : '/dashboard';
      
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
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
          <h1 className="text-2xl font-bold">VIRTUAL SAVING BANK</h1>
          <p className="opacity-90 mt-2">Secure Digital Banking</p>
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
              <div className="mb-6">
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
                  Enter the 6-digit OTP shown in the alert
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

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setEmail('');
                setPassword('');
                setOtp('');
                setIsOTP(false);
                setError('');
              }}
              className="text-blue-600 hover:text-blue-800"
            >
              <i className="fas fa-redo mr-1"></i>
              {isOTP ? 'Back to Login' : 'Reset Form'}
            </button>
          </div>
          
          <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start">
              <i className="fas fa-info-circle text-blue-600 mt-0.5 mr-2"></i>
              <div className="text-sm text-blue-700">
                <p className="font-semibold mb-1">Test Credentials:</p>
                <p className="mb-1">👑 Admin: admin@virtualbank.com / admin123</p>
                <p className="mb-0">👤 User: fanshawmarkk@yahoo.com / Fanshawsadday1956</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [user, setUser] = React.useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  return (
    <Router>
      <Routes>
        <Route path="/" element={!user ? <LoginPage /> : <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} />} />
        <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
        <Route path="/dashboard" element={user?.role === 'user' ? <UserDashboard /> : <Navigate to="/" />} />
        <Route path="/notifications" element={user ? <NotificationsPage /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
