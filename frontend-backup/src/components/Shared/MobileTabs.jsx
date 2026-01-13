import React from 'react';

const MobileTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', icon: 'fas fa-home', label: 'Home' },
    { id: 'transactions', icon: 'fas fa-exchange-alt', label: 'Transactions' },
    { id: 'services', icon: 'fas fa-concierge-bell', label: 'Services' },
  ];

  return (
    <div className="bg-white border-b shadow-xs">
      <div className="max-w-7xl mx-auto">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-1 flex flex-col items-center ${activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
            >
              <i className={`${tab.icon} text-base mb-0.5`}></i>
              <span className="text-[10px] font-medium truncate w-full text-center">
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileTabs;
