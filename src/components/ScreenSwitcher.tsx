import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ScreenId } from '../types';

export const ScreenSwitcher: React.FC = () => {
  const { currentScreen, navigateTo, setIsLogExpenseOpen } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const screens: { id: ScreenId; label: string; tag: string; action?: () => void }[] = [
    { id: 'home', label: '1. Home Dashboard', tag: 'Today Schedule' },
    { id: 'jobs', label: '2. Jobs List', tag: 'Weekly Strip' },
    { id: 'job-detail', label: '3. Job Detail (Charlotte)', tag: 'Checklist & Access' },
    { id: 'customer-profile', label: '4. Customer Profile (Charlotte)', tag: 'Lockbox & History' },
    { id: 'customers', label: '5. Customers List', tag: '28 Regulars' },
    { id: 'new-job', label: '6. Fast 30s New Job Booking', tag: 'Step 1 of 5' },
    { id: 'money', label: '7. Money & Take-Home', tag: 'Who Owes You' },
    { id: 'money', label: '8. Log New Expense Modal', tag: 'Bottom Sheet', action: () => { navigateTo('money'); setIsLogExpenseOpen(true); } },
    { id: 'invoice-detail', label: '9. Invoice #INV-1082 View', tag: 'Itemized Breakdown' },
    { id: 'new-invoice', label: '10. New Invoice Builder', tag: 'Fast WhatsApp Pay' },
    { id: 'calendar', label: '11. Calendar & Bookings', tag: 'October Rounds' },
    { id: 'stripe-settings', label: '12. Stripe Connect & Settings', tag: 'Direct Payouts' },
    { id: 'customer-checkout', label: '13. Client Deposit Checkout', tag: 'Customer Link' },
    { id: 'booking-confirmed', label: '14. Booking Confirmed Screen', tag: 'Elena V. Lead' },
  ];

  return (
    <>
      {/* Floating Demo Pills */}
      <div className="fixed bottom-20 right-3 z-40 flex items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="h-9 px-3 rounded-full bg-[#11249f] text-white shadow-lg flex items-center gap-1.5 text-[11px] font-semibold border border-white/20 active:scale-95 transition-all hover:bg-[#3040b6]"
          title="Switch between all 15 app screens"
        >
          <span className="material-symbols-outlined text-[16px]">layers</span>
          <span>Screens ({screens.length})</span>
          <span className="material-symbols-outlined text-[14px]">
            {isOpen ? 'expand_less' : 'expand_more'}
          </span>
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-x-0 bottom-16 z-50 p-4 max-w-lg mx-auto bg-white/95 backdrop-blur-xl rounded-t-2xl shadow-2xl border-t border-[#eaedff] animate-in slide-in-from-bottom duration-200 max-h-[75vh] flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
            <div>
              <h4 className="font-semibold text-[14px] text-[#131b2e]">All 15 Screens Gallery</h4>
              <p className="text-[11px] text-[#757685]">Instant preview of every designed screen</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-[#f2f3ff] text-[#454653] hover:text-[#131b2e] flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>

          <div className="overflow-y-auto py-2 divide-y divide-[#eaedff]">
            {screens.map((s, idx) => {
              const isSelected = currentScreen === s.id && !s.action;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (s.action) {
                      s.action();
                    } else {
                      navigateTo(s.id);
                    }
                    setIsOpen(false);
                  }}
                  className={`w-full py-2.5 px-2 flex items-center justify-between text-left rounded-lg transition-colors ${
                    isSelected ? 'bg-[#eaedff] text-[#11249f] font-semibold' : 'hover:bg-[#f2f3ff] text-[#131b2e]'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[12px] truncate">{s.label}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f2f3ff] text-[#454653] shrink-0 font-medium">
                    {s.tag}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};
