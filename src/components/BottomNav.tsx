import React from 'react';
import { useApp } from '../context/AppContext';
import { TabType } from '../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const navItems: { tab: TabType; label: string; icon: string }[] = [
    { tab: 'home', label: 'Home', icon: 'home' },
    { tab: 'jobs', label: 'Jobs', icon: 'event_available' },
    { tab: 'customers', label: 'Customers', icon: 'group' },
    { tab: 'money', label: 'Money', icon: 'account_balance_wallet' },
    { tab: 'more', label: 'More', icon: 'more_horiz' },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-40 pb-safe bg-[#ffffff]/92 backdrop-blur-xl border-t border-[#eaedff] shadow-[0_-2px_12px_rgba(0,0,0,0.03)]">
      <div className="h-16 px-1 max-w-lg mx-auto grid grid-cols-5 items-center">
        {navItems.map(item => {
          const isActive = activeTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`flex flex-col items-center justify-center h-full transition-colors relative ${
                isActive ? 'text-[#3040b6] font-semibold' : 'text-[#757685] hover:text-[#131b2e]'
              }`}
            >
              <span
                className="material-symbols-outlined text-[24px]"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span className="text-[11px] leading-tight mt-0.5">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#3040b6]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
