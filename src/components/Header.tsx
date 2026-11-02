import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const { navigateTo, setIsNotificationsOpen } = useApp();
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-40 pt-safe bg-[#ffffff]/85 backdrop-blur-xl border-b border-[#eaedff] shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      <div className="h-16 px-4 max-w-lg mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('home')}
            className="font-semibold text-[20px] text-[#3040b6] tracking-tight hover:opacity-90 flex items-center gap-1"
          >
            Tapili
          </button>
          <span className="h-4 w-px bg-[#dae2fd] mx-0.5"></span>
          <div className="relative">
            <button
              onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
              className="text-[12px] font-medium bg-[#f2f3ff] text-[#454653] px-2.5 py-1 rounded-full max-w-[140px] truncate flex items-center gap-1 hover:bg-[#eaedff] transition-colors"
            >
              <span>Sparkle & Shine</span>
              <span className="material-symbols-outlined text-[14px]">expand_more</span>
            </button>

            {isCompanyDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#eaedff] py-1 z-50 animate-in fade-in slide-in-from-top-1">
                <div className="px-3 py-1.5 border-b border-[#eaedff]">
                  <p className="text-[11px] font-semibold text-[#757685] uppercase">Active Organisation</p>
                  <p className="text-[13px] font-semibold text-[#131b2e] truncate">Sparkle & Shine Co.</p>
                  <p className="text-[11px] text-[#006a61]">UK Micro-Entity • Solopreneur</p>
                </div>
                <button
                  onClick={() => {
                    setIsCompanyDropdownOpen(false);
                    navigateTo('stripe-settings');
                  }}
                  className="w-full text-left px-3 py-2 text-[12px] text-[#131b2e] hover:bg-[#f2f3ff] flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#3040b6]">settings</span>
                  <span>Payment & Stripe Settings</span>
                </button>
                <button
                  onClick={() => {
                    setIsCompanyDropdownOpen(false);
                    navigateTo('calendar');
                  }}
                  className="w-full text-left px-3 py-2 text-[12px] text-[#131b2e] hover:bg-[#f2f3ff] flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#006a61]">calendar_month</span>
                  <span>Calendar & Rounds</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            aria-label="Notifications"
            onClick={() => setIsNotificationsOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-full text-[#454653] hover:bg-[#f2f3ff] active:bg-[#eaedff] transition-colors relative"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ba1a1a]"></span>
          </button>
          
          <button
            onClick={() => navigateTo('stripe-settings')}
            className="w-8 h-8 rounded-full bg-[#11249f] flex items-center justify-center text-white shadow-sm active:scale-95 transition-transform"
            title="Emma - Account Settings"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </button>
        </div>
      </div>
    </header>
  );
};
