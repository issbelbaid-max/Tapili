import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const MoneyScreen: React.FC = () => {
  const { navigateTo, setIsLogExpenseOpen, showToast } = useApp();
  const [eleanorPaid, setEleanorPaid] = useState(false);
  const [marcusReminded, setMarcusReminded] = useState(false);
  const [julianReminded, setJulianReminded] = useState(false);

  return (
    <div className="flex flex-col w-full px-4 pb-28 pt-2 gap-4 max-w-lg mx-auto">
      {/* Header Title */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h1 className="text-[24px] font-semibold text-[#131b2e] tracking-tight">Money</h1>
          <p className="text-[13px] text-[#454653]">Simple view of your cash and earnings</p>
        </div>
        <div className="flex items-center gap-1.5 bg-[#e2e7ff] px-3 py-1.5 rounded-full text-[#454653]">
          <span className="material-symbols-outlined text-[16px] text-[#006a61]">verified</span>
          <span className="text-[12px] font-medium">Oct 2024</span>
        </div>
      </div>

      {/* Hero Take-Home Earnings Card */}
      <div className="relative overflow-hidden rounded-xl bg-white p-4 shadow-sm border border-[#eaedff] flex flex-col gap-3">
        <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-[#86f2e4]/30 blur-2xl pointer-events-none"></div>

        <div className="flex items-start justify-between relative z-10">
          <div>
            <span className="text-[12px] uppercase tracking-wider text-[#454653] font-medium">
              Your Take-Home This Month
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-[32px] font-semibold text-[#131b2e] tracking-tight">£3,240.00</span>
            </div>
          </div>
          <div className="bg-[#86f2e4] text-[#006f66] px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
            <span className="material-symbols-outlined text-[15px]">trending_up</span>
            <span className="text-[12px] font-semibold">88% kept</span>
          </div>
        </div>

        {/* Plain-English Breakdown Strip */}
        <div className="bg-[#f2f3ff] rounded-lg p-3 flex flex-col gap-1.5 relative z-10">
          <div className="flex items-center justify-between text-[13px]">
            <div className="flex items-center gap-1.5 text-[#131b2e]">
              <span className="material-symbols-outlined text-[16px] text-[#006a61]">arrow_circle_down</span>
              <span>Earned from cleans</span>
            </div>
            <span className="text-[14px] font-semibold text-[#131b2e]">£3,680.00</span>
          </div>
          <div className="flex items-center justify-between text-[13px]">
            <div className="flex items-center gap-1.5 text-[#454653]">
              <span className="material-symbols-outlined text-[16px] text-[#ba1a1a]">arrow_circle_up</span>
              <span>Fuel, cloths & supplies</span>
            </div>
            <span className="text-[14px] font-medium text-[#ba1a1a]">-£440.00</span>
          </div>
          <div className="h-px bg-[#eaedff] my-0.5"></div>
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-[#454653]">In your pocket</span>
            <span className="text-[#006a61] font-semibold">Net Profit: £3,240.00</span>
          </div>
        </div>

        {/* Visual Gauge */}
        <div className="flex flex-col gap-1.5 relative z-10">
          <div className="flex justify-between items-center text-[12px] text-[#454653]">
            <span>Cleaned 48 homes</span>
            <span>Avg £76 / booking</span>
          </div>
          <div className="w-full bg-[#eaedff] h-2 rounded-full overflow-hidden flex">
            <div className="bg-[#006a61] h-full rounded-full" style={{ width: '88%' }}></div>
            <div className="bg-[#ffb95f] h-full" style={{ width: '12%' }}></div>
          </div>
        </div>
      </div>

      {/* Primary Quick Actions Strip */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => navigateTo('new-invoice')}
          className="h-12 px-3 bg-[#3040b6] text-white rounded-xl flex items-center justify-center gap-1.5 shadow-sm hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer font-medium text-[14px]"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          <span>Create Invoice</span>
        </button>
        <button
          onClick={() => setIsLogExpenseOpen(true)}
          className="h-12 px-3 bg-white border border-[#eaedff] text-[#131b2e] rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:bg-[#f2f3ff] transition-all cursor-pointer font-medium text-[14px]"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px] text-[#454653]">receipt_long</span>
          <span>Log Expense</span>
        </button>
      </div>

      {/* Urgent Action Section: Who Owes You */}
      <div className="flex flex-col gap-3">
        <div className="bg-[#ffddb8] text-[#2a1700] p-3 rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#ffb95f]/60 flex items-center justify-center text-[#2a1700]">
              <span className="material-symbols-outlined text-[20px]">notification_important</span>
            </div>
            <div>
              <h2 className="text-[17px] font-semibold tracking-tight text-[#2a1700]">Who Owes You</h2>
              <p className="text-[13px] text-[#653e00]">
                {eleanorPaid ? '£320.00 unpaid across 2 clients' : '£380.00 unpaid across 3 clients'}
              </p>
            </div>
          </div>
          <span className="text-[20px] font-bold tracking-tight text-[#2a1700]">
            {eleanorPaid ? '£320' : '£380'}
          </span>
        </div>

        {/* Client Debt Cards */}
        <div className="flex flex-col gap-3">
          {/* Card 1: Marcus Holloway */}
          <div className="bg-white rounded-xl p-3.5 shadow-sm border border-[#eaedff] flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-11 h-11 rounded-full overflow-hidden bg-[#f2f3ff] shrink-0">
                  <img
                    className="w-full h-full object-cover"
                    alt="Marcus Holloway"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcx7LsFBCzqPFxiuIDtiKkCjDtyaOukmCk8XBqIwc4vpGeuAtzL-yOsVKeFYn3ShHmrXuEl181H8aU5reVKSifsOCTPlqoA-aBRX4ocYTScfGRGKzAUVMOo2VJU9y0FT8ehcGBPkerCMypyBXGlBJ60TVFzg8O8mFlqoZfJXIrtKHt7EDOk_yexyXhcjhwGVX3NqSNtWw_36rqOBOekPMvsQ5htVV5duI9Kf6nYsU"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-[17px] font-semibold text-[#131b2e] truncate">Marcus Holloway</h3>
                  <p className="text-[13px] text-[#454653] truncate">Deep Clean • Inv #104 (12 Oct)</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[20px] font-semibold text-[#131b2e]">£140.00</span>
                <div className="mt-0.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[12px] bg-[#ffdad6] text-[#93000a] font-medium">
                    7 days overdue
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setMarcusReminded(true);
                showToast('1-Tap SMS reminder sent to Marcus Holloway (+44 7700 900456)');
              }}
              className={`w-full h-11 rounded-lg flex items-center justify-center gap-1.5 text-[14px] font-medium shadow-sm transition-colors cursor-pointer ${
                marcusReminded
                  ? 'bg-[#e2e7ff] text-[#3040b6]'
                  : 'bg-[#3040b6] text-white active:bg-[#11249f]'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">
                {marcusReminded ? 'done_all' : 'sms'}
              </span>
              <span>{marcusReminded ? 'Reminder Sent via SMS' : 'Send 1-Tap SMS Reminder'}</span>
            </button>
          </div>

          {/* Card 2: Julian Thorne */}
          <div className="bg-white rounded-xl p-3.5 shadow-sm border border-[#eaedff] flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-11 h-11 rounded-full overflow-hidden bg-[#f2f3ff] shrink-0">
                  <img
                    className="w-full h-full object-cover"
                    alt="Julian Thorne"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAU4shFSPMq8S7vLW-KzZJ8RV3uXLKOT440v4rLXoKkN2sviU6Bu67MHzTpLBr0slsnjABybi0nf6lCG2Erpmb4iLkDNID3OUBfM1INYXfi1sLpBEWRY9LWJYLxQMBVqdXgO2ywu9mAkpU2a6B7BrYFdj0Q2PoKBg8MfRO-U23zqIYejZSERwtNTEkxS1eXpGUTDV8XIx1mC9pm2lr7xWopp-dRer74qdUQ80ShEKA"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-[17px] font-semibold text-[#131b2e] truncate">Julian Thorne</h3>
                  <p className="text-[13px] text-[#454653] truncate">Fortnightly Clean • Inv #105 (18 Oct)</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[20px] font-semibold text-[#131b2e]">£180.00</span>
                <div className="mt-0.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[12px] bg-[#ffdad6] text-[#93000a] font-medium">
                    3 days overdue
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setJulianReminded(true);
                showToast('WhatsApp invoice link opened for Julian Thorne');
                window.open('https://wa.me/447700900331?text=Hi%20Julian%2C%20here%20is%20your%20invoice%20%23105%20for%20%C2%A3180.00%20(due%20now)', '_blank');
              }}
              className={`w-full h-11 rounded-lg flex items-center justify-center gap-1.5 text-[14px] font-medium shadow-sm transition-opacity cursor-pointer ${
                julianReminded ? 'bg-[#86f2e4] text-[#006f66]' : 'bg-[#006a61] text-white active:opacity-90'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">
                {julianReminded ? 'done' : 'chat'}
              </span>
              <span>{julianReminded ? 'WhatsApp Sent' : 'Send WhatsApp Link'}</span>
            </button>
          </div>

          {/* Card 3: Eleanor Vance */}
          {!eleanorPaid && (
            <div className="bg-white rounded-xl p-3.5 shadow-sm border border-[#eaedff] flex flex-col gap-3 transition-all animate-in fade-in">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden bg-[#f2f3ff] shrink-0">
                    <img
                      className="w-full h-full object-cover"
                      alt="Eleanor Vance"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHYyEbBONmHc_2inT6mDCGOI4n5j_qtKnc1HcxmZc2xQzvP4F3oF8zhZQkZarqT9GZ1M6OgTuj3L_QRk2I5S_IRfuYfvYHzlNU2JKJ5pOh2aPmOmCQEz7AHz0FvUY_pxhMB7tKD16dmKV25xWsa1yENyB6fiq5wDhxllqtMokKu718elxXvxHDkRU7FPf_N1f02WKCpZwbHrcHd9eLQT-4pNyS2kZltlO8gt1W2Dk"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[17px] font-semibold text-[#131b2e] truncate">Eleanor Vance</h3>
                    <p className="text-[13px] text-[#454653] truncate">Standard Tidy • Inv #106 (Today)</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[20px] font-semibold text-[#131b2e]">£60.00</span>
                  <div className="mt-0.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[12px] bg-[#eaedff] text-[#454653] font-medium">
                      Due today
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setEleanorPaid(true);
                  showToast('£60.00 from Eleanor Vance marked as paid!');
                }}
                className="w-full h-11 bg-[#eaedff] text-[#3040b6] rounded-lg flex items-center justify-center gap-1.5 text-[14px] font-medium active:bg-[#e2e7ff] transition-colors cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>Mark as Paid</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity Strip */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] font-semibold text-[#131b2e] tracking-tight">Recent Cash In & Out</h2>
          <button
            onClick={() => showToast('Opening complete financial audit trail')}
            className="text-[12px] text-[#3040b6] font-medium"
          >
            View all
          </button>
        </div>

        <div className="bg-white rounded-xl p-3.5 shadow-sm border border-[#eaedff] flex flex-col gap-3">
          {/* Item 1: Inflow */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[#86f2e4]/70 text-[#006f66] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">south_west</span>
              </div>
              <div className="min-w-0">
                <h4 className="text-[14px] font-semibold text-[#131b2e] truncate">Charlotte Davies</h4>
                <p className="text-[13px] text-[#454653] truncate">Bank Transfer • Today, 11:20</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[14px] font-semibold text-[#006a61]">+£65.00</span>
              <p className="text-[12px] text-[#454653]">Cleared</p>
            </div>
          </div>

          <div className="h-px bg-[#f2f3ff]"></div>

          {/* Item 2: Outflow */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[#eaedff] text-[#454653] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">north_east</span>
              </div>
              <div className="min-w-0">
                <h4 className="text-[14px] font-semibold text-[#131b2e] truncate">Screwfix</h4>
                <p className="text-[13px] text-[#454653] truncate">Microfibres & spray bottles • Yesterday</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[14px] font-semibold text-[#131b2e]">-£24.50</span>
              <p className="text-[12px] text-[#454653]">Supplies</p>
            </div>
          </div>

          <div className="h-px bg-[#f2f3ff]"></div>

          {/* Item 3: Inflow */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[#86f2e4]/70 text-[#006f66] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">south_west</span>
              </div>
              <div className="min-w-0">
                <h4 className="text-[14px] font-semibold text-[#131b2e] truncate">Oliver Sterling</h4>
                <p className="text-[13px] text-[#454653] truncate">Card Payment • Yesterday, 16:45</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[14px] font-semibold text-[#006a61]">+£120.00</span>
              <p className="text-[12px] text-[#454653]">Cleared</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
