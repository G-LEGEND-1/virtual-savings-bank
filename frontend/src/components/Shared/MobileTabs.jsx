import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const MobileTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const tabs = [
    { id: 'home', icon: 'fas fa-home', label: 'Home', path: '/dashboard' },
    { id: 'transactions', icon: 'fas fa-exchange-alt', label: 'Transactions', path: '/transactions' },
    { id: 'card', icon: 'fas fa-credit-card', label: 'Card', path: '/card' },
    { id: 'profile', icon: 'fas fa-user', label: 'Profile', path: '/profile' },
    { id: 'support', icon: 'fas fa-headset', label: 'Support', path: '/customer-service' }
  ];

  return (
    <div className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-50">
      <div className="flex justify-around">
        {tabs.map((item) => {
          const isActive = currentPath === item.path || 
                          (item.path === '/dashboard' && currentPath === '/');
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`tab-item ${isActive ? 'active' : ''}`}
            >
              <i className={`icon ${item.icon}`}></i>
              <span className="label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileTabs;
