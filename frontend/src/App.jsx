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
import SafeBoxPage from './pages/SafeBoxPage'; // Add this import

// API base URL
const API_BASE = 'https://virtual-savings-bank-backend.onrender.com/api';

function App() {
  const [user, setUser] = React.useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

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
        <Route path="/safebox" element={user ? <SafeBoxPage /> : <Navigate to="/" />} /> {/* Add this route */}
      </Routes>
    </Router>
  );
}

export default App;
