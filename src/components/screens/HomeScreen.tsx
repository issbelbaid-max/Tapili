import React from 'react';
import { useApp } from '../../context/AppContext';

export const HomeScreen: React.FC = () => {
  const { navigateTo, setIsLogExpenseOpen, setIsAddCustomerOpen, showToast } = useApp();

  return (
    <div className="flex flex-col w-full px-4 space-y-4 pb-28 pt-2 max-w-lg mx-auto">
      {/* Warm Greeting & Quick Action Hero */}
      <section className="flex flex-col space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[12px] font-medium text-[#454653] uppercase tracking-wider">
              Thursday, 24 Oct
            </p>
            <h1 className="text-[24px] font-semibold text-[#131b2e] tracking-tight">
              Good morning, Emma
            </h1>
          </div>
          <button
            onClick={() => navigateTo('calendar')}
            className="w-10 h-10 rounded-full bg-[#86f2e4] flex items-center justify-center shadow-sm active:scale-95 transition-transform"
            title="Calendar & Rounds"
          >
            <span
              className="material-symbols-outlined text-[#006f66] text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              calendar_month
            </span>
          </button>
        </div>

        {/* 1-Tap Fast Job Booking */}
        <button
          onClick={() => navigateTo('new-job')}
          className="w-full h-[52px] bg-[#3040b6] active:bg-[#11249f] text-white rounded-xl text-[14px] font-medium flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] touch-manipulation cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          <span>+ Book New Job</span>
        </button>
      </section>

      {/* 3-Second Business Snapshot Grid */}
      <section className="grid grid-cols-2 gap-3">
        {/* Snapshot Card 1: Today's Schedule */}
        <div
          onClick={() => navigateTo('jobs')}
          className="bg-white p-3.5 rounded-xl shadow-sm border border-[#eaedff] flex flex-col justify-between space-y-3 active:bg-[#f2f3ff] transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-[#454653]">Today's Jobs</span>
            <div className="w-6 h-6 rounded-full bg-[#dfe0ff] flex items-center justify-center text-[#2737ae]">
              <span className="material-symbols-outlined text-[15px]">event</span>
            </div>
          </div>
          <div>
            <div className="text-[18px] text-[#131b2e] font-semibold tracking-tight">£245</div>
            <p className="text-[13px] text-[#454653] mt-0.5">3 jobs scheduled</p>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#006a61]"></span>
            <span className="text-[11px] text-[#006a61] font-medium">On track</span>
          </div>
        </div>

        {/* Snapshot Card 2: Unpaid Invoices */}
        <div
          onClick={() => navigateTo('money')}
          className="bg-white p-3.5 rounded-xl shadow-sm border border-[#eaedff] flex flex-col justify-between space-y-3 active:bg-[#f2f3ff] transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-[#454653]">Unpaid Total</span>
            <div className="w-6 h-6 rounded-full bg-[#ffddb8] flex items-center justify-center text-[#653e00]">
              <span className="material-symbols-outlined text-[15px]">pending</span>
            </div>
          </div>
          <div>
            <div className="text-[18px] text-[#131b2e] font-semibold tracking-tight">£380</div>
            <p className="text-[13px] text-[#454653] mt-0.5">Awaiting payout</p>
          </div>
          <div className="inline-flex items-center gap-1 bg-[#ffddb8]/60 px-1.5 py-0.5 rounded-full w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-[#503000]"></span>
            <span className="text-[10px] text-[#503000] font-medium">2 overdue</span>
          </div>
        </div>
      </section>

      {/* Today's Jobs List */}
      <section className="flex flex-col space-y-3">
        <div className="flex items-center justify-between px-0.5">
          <h2 className="text-[17px] font-semibold text-[#131b2e]">Today's Schedule</h2>
          <span className="text-[12px] font-medium text-[#454653]">London & Surrey</span>
        </div>

        {/* Job 1: Next Up (Featured Card) */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff] space-y-3 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-[#86f2e4] text-[#006f66] px-2 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006a61] animate-pulse"></span> Next Up
              </span>
              <span className="text-[12px] text-[#454653] font-medium">09:30 – 11:30</span>
            </div>
            <span className="text-[20px] font-semibold text-[#131b2e]">£65</span>
          </div>

          <div
            className="space-y-1 cursor-pointer"
            onClick={() => navigateTo('job-detail', { jobId: 'job-1' })}
          >
            <div className="flex items-baseline justify-between">
              <h3 className="text-[17px] text-[#131b2e] font-semibold hover:text-[#3040b6] transition-colors">
                Mrs. Charlotte Davies
              </h3>
              <span className="text-[13px] text-[#454653]">Richmond (TW9)</span>
            </div>
            <p className="text-[14px] text-[#454653]">Weekly Domestic Clean (3 bed)</p>
          </div>

          {/* Payment & Method Indicator */}
          <div className="flex items-center gap-2 bg-[#f2f3ff] px-2.5 py-1.5 rounded-lg text-[#454653]">
            <span className="material-symbols-outlined text-[16px] text-[#006a61]">payments</span>
            <span className="text-[12px]">Cash on arrival</span>
          </div>

          {/* Quick Action Strip for On-Site Transit */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              className="h-11 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] rounded-xl flex items-center justify-center gap-1.5 text-[12px] font-medium transition-colors"
              href="tel:07700900123"
            >
              <span className="material-symbols-outlined text-[18px] text-[#3040b6]">call</span>
              <span>Call Client</span>
            </a>
            <button
              onClick={() => {
                showToast('Opening Google Maps route to 42 Crescent Gardens, Richmond...');
                window.open('https://maps.google.com/?q=42+Crescent+Gardens+Richmond', '_blank');
              }}
              className="h-11 bg-[#3040b6] text-white rounded-xl flex items-center justify-center gap-1.5 text-[12px] font-medium transition-colors active:bg-[#11249f]"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">near_me</span>
              <span>Directions</span>
            </button>
          </div>
        </div>

        {/* Job 2: Midday Slot */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff] space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-[#eaedff] text-[#454653] px-2 py-0.5 rounded-full text-[11px] font-medium">
                Scheduled
              </span>
              <span className="text-[12px] text-[#454653] font-medium">12:30 – 15:30</span>
            </div>
            <span className="text-[20px] font-semibold text-[#131b2e]">£120</span>
          </div>

          <div
            className="space-y-1 cursor-pointer"
            onClick={() => navigateTo('job-detail', { jobId: 'job-2' })}
          >
            <div className="flex items-baseline justify-between">
              <h3 className="text-[17px] text-[#131b2e] font-semibold hover:text-[#3040b6] transition-colors">
                Oliver Sterling
              </h3>
              <span className="text-[13px] text-[#454653]">Fulham (SW6)</span>
            </div>
            <p className="text-[14px] text-[#454653]">Deep End-of-Tenancy Clean</p>
          </div>

          {/* Crucial Access Note Highlight */}
          <div className="flex items-start gap-2 bg-[#e2e7ff]/60 p-2.5 rounded-lg text-[#131b2e]">
            <span className="material-symbols-outlined text-[18px] text-[#3040b6] shrink-0 mt-0.5">key</span>
            <div className="min-w-0">
              <p className="text-[12px] font-semibold text-[#3040b6]">Access Note</p>
              <p className="text-[13px] text-[#454653] truncate">Key under plant pot by front porch</p>
            </div>
          </div>

          {/* Payment Method Strip */}
          <div className="flex items-center justify-between pt-0.5 text-[#454653]">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#454653]">credit_card</span>
              <span className="text-[12px]">Card Payment setup</span>
            </div>
            <a
              href="tel:07820994112"
              aria-label="Call Oliver Sterling"
              className="w-9 h-9 rounded-full bg-[#f2f3ff] flex items-center justify-center text-[#131b2e] active:bg-[#eaedff]"
            >
              <span className="material-symbols-outlined text-[18px]">phone</span>
            </a>
          </div>
        </div>

        {/* Job 3: Late Afternoon Slot */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff] space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-[#eaedff] text-[#454653] px-2 py-0.5 rounded-full text-[11px] font-medium">
                Scheduled
              </span>
              <span className="text-[12px] text-[#454653] font-medium">16:30 – 18:00</span>
            </div>
            <span className="text-[20px] font-semibold text-[#131b2e]">£60</span>
          </div>

          <div
            className="space-y-1 cursor-pointer"
            onClick={() => navigateTo('job-detail', { jobId: 'job-3' })}
          >
            <div className="flex items-baseline justify-between">
              <h3 className="text-[17px] text-[#131b2e] font-semibold hover:text-[#3040b6] transition-colors">
                Dr. James Aris
              </h3>
              <span className="text-[13px] text-[#454653]">Putney (SW15)</span>
            </div>
            <p className="text-[14px] text-[#454653]">Fortnightly Maintenance Clean</p>
          </div>

          {/* Payment Method Strip */}
          <div className="flex items-center justify-between pt-0.5 text-[#454653]">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#006a61]">account_balance</span>
              <span className="text-[12px]">Bank Transfer • Auto-invoiced</span>
            </div>
            <a
              href="tel:07700900456"
              aria-label="Call Dr. James Aris"
              className="w-9 h-9 rounded-full bg-[#f2f3ff] flex items-center justify-center text-[#131b2e] active:bg-[#eaedff]"
            >
              <span className="material-symbols-outlined text-[18px]">phone</span>
            </a>
          </div>
        </div>
      </section>

      {/* Quick Utility Actions Grid */}
      <section className="flex flex-col space-y-2 pt-1">
        <span className="text-[12px] font-medium text-[#454653] uppercase tracking-wider px-0.5">
          Quick Ops
        </span>
        <div className="grid grid-cols-3 gap-2">
          {/* Action 1 */}
          <button
            onClick={() => navigateTo('new-invoice')}
            className="bg-white border border-[#eaedff] p-3 rounded-xl shadow-sm flex flex-col items-center justify-center text-center space-y-1.5 active:bg-[#f2f3ff] transition-colors touch-manipulation min-h-[82px] cursor-pointer"
            type="button"
          >
            <div className="w-8 h-8 rounded-full bg-[#dfe0ff] flex items-center justify-center text-[#11249f]">
              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            </div>
            <span className="text-[11px] leading-tight text-[#131b2e] font-medium">Send Quick Invoice</span>
          </button>

          {/* Action 2 */}
          <button
            onClick={() => setIsLogExpenseOpen(true)}
            className="bg-white border border-[#eaedff] p-3 rounded-xl shadow-sm flex flex-col items-center justify-center text-center space-y-1.5 active:bg-[#f2f3ff] transition-colors touch-manipulation min-h-[82px] cursor-pointer"
            type="button"
          >
            <div className="w-8 h-8 rounded-full bg-[#ffddb8] flex items-center justify-center text-[#503000]">
              <span className="material-symbols-outlined text-[18px]">payments</span>
            </div>
            <span className="text-[11px] leading-tight text-[#131b2e] font-medium">Record Cash Expense</span>
          </button>

          {/* Action 3 */}
          <button
            onClick={() => setIsAddCustomerOpen(true)}
            className="bg-white border border-[#eaedff] p-3 rounded-xl shadow-sm flex flex-col items-center justify-center text-center space-y-1.5 active:bg-[#f2f3ff] transition-colors touch-manipulation min-h-[82px] cursor-pointer"
            type="button"
          >
            <div className="w-8 h-8 rounded-full bg-[#89f5e7] flex items-center justify-center text-[#006a61]">
              <span className="material-symbols-outlined text-[18px]">person_add</span>
            </div>
            <span className="text-[11px] leading-tight text-[#131b2e] font-medium">Add New Client</span>
          </button>
        </div>
      </section>
    </div>
  );
};
