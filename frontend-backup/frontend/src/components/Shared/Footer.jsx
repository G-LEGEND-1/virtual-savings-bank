import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');

  const navItems = [
    { id: 'me', icon: 'fas fa-user', label: 'Me', page: 'profile' },
    { id: 'card', icon: 'fas fa-credit-card', label: 'Card', page: 'card' },
    { id: 'home', icon: 'fas fa-home', label: 'Home', page: 'home' },
    { id: 'safebox', icon: 'fas fa-vault', label: 'Safe', page: 'safebox' },
  ];

  const handleNavigation = (item) => {
    setActiveTab(item.id);
    
    if (item.page === 'home') {
      navigate('/dashboard');
      window.location.reload(); // Refresh to show home tab
    } else if (item.page === 'profile') {
      if (window.showProfileModal) {
        window.showProfileModal();
      }
    } else if (item.page === 'card') {
      if (window.showCardModal) {
        window.showCardModal();
      }
    } else if (item.page === 'safebox') {
      if (window.showSafeBoxModal) {
        window.showSafeBoxModal();
      }
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-1 px-2 z-50 shadow">
      <div className="flex justify-around items-center">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item)}
            className={`flex flex-col items-center p-1 rounded transition-all ${
              activeTab === item.id 
                ? 'text-blue-600' 
                : 'text-gray-500 hover:text-blue-500'
            }`}
          >
            <i className={`${item.icon} text-sm mb-0.5`}></i>
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Footer;
