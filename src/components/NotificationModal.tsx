import React from 'react';
import { useApp } from '../context/AppContext';

export const NotificationModal: React.FC = () => {
  const { isNotificationsOpen, setIsNotificationsOpen, navigateTo } = useApp();

  if (!isNotificationsOpen) return null;

  const notifications = [
    {
      id: 'n1',
      title: '£20.00 Deposit Received',
      desc: 'Charlotte Davies confirmed appointment via Apple Pay.',
      time: '10:14 AM',
      icon: 'verified',
      iconBg: 'bg-[#86f2e4] text-[#006f66]',
      action: () => {
        setIsNotificationsOpen(false);
        navigateTo('customer-checkout');
      }
    },
    {
      id: 'n2',
      title: 'Invoice #104 Overdue (8 days)',
      desc: 'Marcus Holloway owes £140.00 for Deep Clean on 12 Oct.',
      time: '09:00 AM',
      icon: 'warning',
      iconBg: 'bg-[#ffddb8] text-[#653e00]',
      action: () => {
        setIsNotificationsOpen(false);
        navigateTo('money');
      }
    },
    {
      id: 'n3',
      title: 'Booking Link Viewed',
      desc: 'Oliver Sterling opened their checkout link in Fulham.',
      time: 'Yesterday',
      icon: 'visibility',
      iconBg: 'bg-[#eaedff] text-[#3040b6]',
      action: () => {
        setIsNotificationsOpen(false);
        navigateTo('new-job');
      }
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-[#283044]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-[#eaedff] overflow-hidden">
        <div className="p-4 border-b border-[#eaedff] flex items-center justify-between bg-[#faf8ff]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#3040b6]">notifications</span>
            <h3 className="font-semibold text-[15px] text-[#131b2e]">Notifications</h3>
          </div>
          <button
            onClick={() => setIsNotificationsOpen(false)}
            className="w-8 h-8 rounded-full bg-[#f2f3ff] text-[#454653] hover:text-[#131b2e] flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="divide-y divide-[#eaedff] max-h-[380px] overflow-y-auto">
          {notifications.map(item => (
            <button
              key={item.id}
              onClick={item.action}
              className="w-full p-3.5 text-left hover:bg-[#f2f3ff] flex items-start gap-3 transition-colors"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${item.iconBg}`}>
                <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-1">
                  <p className="text-[13px] font-semibold text-[#131b2e] truncate">{item.title}</p>
                  <span className="text-[11px] text-[#757685] shrink-0">{item.time}</span>
                </div>
                <p className="text-[12px] text-[#454653] mt-0.5 line-clamp-2">{item.desc}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="p-3 bg-[#f2f3ff] text-center border-t border-[#eaedff]">
          <button
            onClick={() => setIsNotificationsOpen(false)}
            className="text-[12px] font-semibold text-[#3040b6] hover:underline"
          >
            Mark all as read
          </button>
        </div>
      </div>
    </div>
  );
};
