import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import pages
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import CustomerServicePage from './pages/CustomerServicePage';
import CardPage from './pages/CardPage';
import TransactionHistoryPage from './pages/TransactionHistoryPage';
import SafeBoxPage from './pages/SafeBoxPage';

// Debug component
const DebugPage = () => {
  console.log('🔍 Debug page rendered!');
  return (
    <div style={{
      padding: '50px',
      backgroundColor: '#4CAF50',
      color: 'white',
      textAlign: 'center',
      minHeight: '100vh'
    }}>
      <h1 style={{ fontSize: '2.5em' }}>✅ DEBUG PAGE IS WORKING!</h1>
      <p style={{ fontSize: '1.2em' }}>React Router is functioning correctly</p>
      
      <div style={{ marginTop: '40px', backgroundColor: 'rgba(0,0,0,0.2)', padding: '20px' }}>
        <h2>Test Routes:</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' }}>
          <a href="/" style={linkStyle}>Home/Login</a>
          <a href="/dashboard" style={linkStyle}>Dashboard</a>
          <a href="/notifications" style={linkStyle}>Notifications</a>
          <a href="/debug" style={linkStyle}>This Page</a>
        </div>
      </div>
      
      <div style={{ marginTop: '40px', textAlign: 'left', maxWidth: '600px', margin: '40px auto' }}>
        <h3>Debug Info:</h3>
        <ul style={{ textAlign: 'left', listStylePosition: 'inside' }}>
          <li>Current path: {window.location.pathname}</li>
          <li>User in localStorage: {localStorage.getItem('user') ? 'Exists' : 'Not found'}</li>
          <li>React version: {React.version}</li>
        </ul>
      </div>
    </div>
  );
};

const linkStyle = {
  display: 'inline-block',
  padding: '12px 24px',
  backgroundColor: 'white',
  color: '#4CAF50',
  textDecoration: 'none',
  borderRadius: '5px',
  fontWeight: 'bold',
  transition: 'transform 0.2s'
};

// API base URL
const API_BASE = 'https://virtual-savings-bank-backend.onrender.com/api';

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  console.log('🎯 App rendering, user:', user);

  return (
    <Router>
      <Routes>
        <Route path="/" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
        <Route path="/dashboard" element={user ? <UserDashboard /> : <Navigate to="/" />} />
        <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/" />} />
        <Route path="/notifications" element={user ? <NotificationsPage /> : <Navigate to="/" />} />
        <Route path="/customer-service" element={user ? <CustomerServicePage /> : <Navigate to="/" />} />
        <Route path="/card" element={user ? <CardPage /> : <Navigate to="/" />} />
        <Route path="/transactions" element={user ? <TransactionHistoryPage /> : <Navigate to="/" />} />
        <Route path="/safebox" element={user ? <SafeBoxPage /> : <Navigate to="/" />} />
        
        {/* Add debug route - accessible without login */}
        <Route path="/debug" element={<DebugPage />} />
        
        {/* 404 route */}
        <Route path="*" element={
          <div style={{ padding: '50px', textAlign: 'center' }}>
            <h1>404 - Page Not Found</h1>
            <p>Current URL: {window.location.pathname}</p>
            <p>Go to: <a href="/debug">Debug Page</a></p>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;