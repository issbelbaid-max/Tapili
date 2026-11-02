import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const CalendarScreen: React.FC = () => {
  const { navigateTo, showToast } = useApp();
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('month');
  const [selectedDay, setSelectedDay] = useState(24);

  return (
    <div className="flex flex-col w-full px-4 pb-28 pt-2 gap-3 max-w-lg mx-auto">
      {/* Top Meta Bar & Action */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#3040b6] text-[18px]">calendar_today</span>
            <span className="text-[17px] font-semibold text-[#131b2e]">Calendar & Bookings</span>
          </div>
          <span className="text-[13px] text-[#454653]">Manage rounds & client access</span>
        </div>
        <button
          onClick={() => navigateTo('new-job')}
          className="flex items-center gap-1.5 bg-[#3040b6] hover:bg-[#11249f] text-white text-[14px] font-medium px-3.5 py-2 rounded-xl shadow-sm transition-all active:scale-[0.98] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Book Job</span>
        </button>
      </div>

      {/* Segmented View Switcher */}
      <div className="bg-[#e2e7ff] p-1 rounded-xl flex items-center justify-between shadow-inner">
        <button
          onClick={() => setViewMode('day')}
          className={`flex-1 py-1.5 text-center text-[12px] font-medium rounded-lg transition-colors cursor-pointer ${
            viewMode === 'day' ? 'bg-white text-[#3040b6] font-semibold shadow-sm' : 'text-[#454653]'
          }`}
        >
          Day
        </button>
        <button
          onClick={() => setViewMode('week')}
          className={`flex-1 py-1.5 text-center text-[12px] font-medium rounded-lg transition-colors cursor-pointer ${
            viewMode === 'week' ? 'bg-white text-[#3040b6] font-semibold shadow-sm' : 'text-[#454653]'
          }`}
        >
          Week
        </button>
        <button
          onClick={() => setViewMode('month')}
          className={`flex-1 py-1.5 text-center text-[12px] font-medium rounded-lg transition-colors cursor-pointer ${
            viewMode === 'month' ? 'bg-white text-[#3040b6] font-semibold shadow-sm' : 'text-[#454653]'
          }`}
        >
          Month
        </button>
      </div>

      {/* Month Navigator & Mini Calendar Strip */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[17px] font-semibold text-[#131b2e]">October 2024</span>
            <span className="text-[12px] px-2 py-0.5 rounded-full bg-[#86f2e4] text-[#006f66] font-medium">
              18 Active Days
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => showToast('Previous month')}
              aria-label="Previous month"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#454653] bg-[#f2f3ff] hover:bg-[#eaedff] transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button
              onClick={() => showToast('Next month')}
              aria-label="Next month"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#454653] bg-[#f2f3ff] hover:bg-[#eaedff] transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Mini Month Matrix */}
        <div className="grid grid-cols-7 gap-y-2 text-center pt-1">
          <span className="text-[11px] font-medium text-[#757685]">M</span>
          <span className="text-[11px] font-medium text-[#757685]">T</span>
          <span className="text-[11px] font-medium text-[#757685]">W</span>
          <span className="text-[11px] font-medium text-[#757685]">T</span>
          <span className="text-[11px] font-medium text-[#757685]">F</span>
          <span className="text-[11px] font-medium text-[#757685]">S</span>
          <span className="text-[11px] font-medium text-[#757685]">S</span>

          {[21, 22, 23, 24, 25, 26, 27].map(d => {
            const isSelected = selectedDay === d;
            return (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                className={`flex flex-col items-center justify-center py-1 rounded-lg cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#3040b6] text-white shadow-sm font-semibold'
                    : 'text-[#131b2e] hover:bg-[#f2f3ff]'
                }`}
              >
                <span className="text-[13px]">{d}</span>
                <span
                  className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                    isSelected ? 'bg-[#86f2e4]' : d === 27 ? 'bg-transparent' : 'bg-[#006a61]'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Banner & Day Totals */}
      <div className="bg-[#f2f3ff] rounded-xl p-3 flex flex-col gap-2 border border-[#eaedff]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#006a61]"></span>
            <span className="text-[17px] font-semibold text-[#131b2e]">
              Thursday, {selectedDay} October
            </span>
          </div>
          <span className="text-[12px] font-semibold bg-white text-[#3040b6] px-2.5 py-1 rounded-full shadow-xs">
            3 Jobs
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="bg-white rounded-lg p-2.5 flex items-center gap-2.5 border border-[#eaedff]">
            <div className="w-8 h-8 rounded-full bg-[#eaedff] flex items-center justify-center text-[#3040b6]">
              <span className="material-symbols-outlined text-[18px]">schedule</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-[#454653] leading-none">Billable Time</span>
              <span className="text-[17px] font-semibold text-[#131b2e] mt-0.5">6.5 hrs</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-2.5 flex items-center gap-2.5 border border-[#eaedff]">
            <div className="w-8 h-8 rounded-full bg-[#86f2e4] flex items-center justify-center text-[#006f66]">
              <span className="material-symbols-outlined text-[18px]">payments</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-[#006f66] leading-none">Estimated Day</span>
              <span className="text-[17px] font-semibold text-[#131b2e] mt-0.5">£245.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scheduled Jobs Chronological Timeline */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-0.5">
          <span className="text-[12px] font-medium text-[#454653] uppercase tracking-wider">Today's Schedule</span>
          <button
            onClick={() => showToast('Rounds optimized: Route re-sequenced by driving proximity')}
            className="text-[12px] text-[#3040b6] font-medium flex items-center gap-0.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[14px]">tune</span>
            <span>Map Order</span>
          </button>
        </div>

        {/* Job 1 */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff] flex flex-col gap-2.5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#3040b6]"></div>
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[17px] font-semibold text-[#131b2e]">Charlotte Davies</span>
                <span className="w-2 h-2 rounded-full bg-[#006a61] animate-pulse"></span>
              </div>
              <span className="text-[13px] text-[#454653]">Standard Domestic Clean (3 bed)</span>
            </div>
            <span className="text-[12px] px-2.5 py-1 rounded-full bg-[#eaedff] text-[#3040b6] font-medium">
              In Progress
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 bg-[#f2f3ff] rounded-lg p-2 text-[#131b2e]">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#757685] text-[16px]">schedule</span>
              <span className="text-[12px]">09:30 – 11:30</span>
            </div>
            <div className="flex items-center justify-end font-semibold text-[#11249f]">
              <span className="text-[18px]">£65.00</span>
            </div>
          </div>

          <div className="flex flex-col gap-1 text-[#454653] text-[13px]">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#006a61] text-[16px]">pin_drop</span>
              <span className="font-medium text-[#131b2e]">Richmond TW9</span>
              <span className="text-[#757685]">•</span>
              <span>14 Albany Gardens</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#e2e7ff]/60 px-2 py-1 rounded-md text-[#131b2e]">
              <span className="material-symbols-outlined text-[16px] text-[#6f4500]">key</span>
              <span className="text-[12px] font-medium">Lockbox #5821</span>
              <span className="text-[#454653] text-[11px]">(Left of storm porch)</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <a
              className="flex-1 h-11 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] rounded-lg flex items-center justify-center gap-1.5 text-[12px] font-medium transition-colors"
              href="tel:+447700900123"
            >
              <span className="material-symbols-outlined text-[18px] text-[#006a61]">call</span>
              <span>Call</span>
            </a>
            <a
              className="flex-1 h-11 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] rounded-lg flex items-center justify-center gap-1.5 text-[12px] font-medium transition-colors"
              href="https://wa.me/447700900123"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="material-symbols-outlined text-[18px] text-[#3040b6]">chat</span>
              <span>Message</span>
            </a>
            <button
              onClick={() => {
                showToast('Launching GPS Route for Richmond TW9');
                window.open('https://maps.apple.com/?q=14+Albany+Gardens+Richmond', '_blank');
              }}
              className="h-11 px-3 bg-[#3040b6] text-white rounded-lg flex items-center justify-center gap-1 text-[12px] font-medium cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">directions</span>
              <span>Route</span>
            </button>
          </div>
        </div>

        {/* Job 2 */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff] flex flex-col gap-2.5">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[17px] font-semibold text-[#131b2e]">Oliver Sterling</span>
              <span className="text-[13px] text-[#454653]">Deep Clean (Oven & Interior Windows)</span>
            </div>
            <span className="text-[12px] px-2.5 py-1 rounded-full bg-[#eaedff] text-[#454653] font-medium">
              Scheduled
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 bg-[#f2f3ff] rounded-lg p-2 text-[#131b2e]">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#757685] text-[16px]">schedule</span>
              <span className="text-[12px]">12:30 – 15:30</span>
            </div>
            <div className="flex items-center justify-end font-semibold text-[#11249f]">
              <span className="text-[18px]">£120.00</span>
            </div>
          </div>

          <div className="flex flex-col gap-1 text-[#454653] text-[13px]">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#006a61] text-[16px]">pin_drop</span>
              <span className="font-medium text-[#131b2e]">Fulham SW6</span>
              <span className="text-[#757685]">•</span>
              <span>88 Hurlingham Rd</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#e2e7ff]/60 px-2 py-1 rounded-md text-[#131b2e]">
              <span className="material-symbols-outlined text-[16px] text-[#6f4500]">vpn_key</span>
              <span className="text-[12px] font-medium">Key under porch pot</span>
              <span className="text-[#454653] text-[11px]">(Blue glazed pot)</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <a
              className="flex-1 h-11 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] rounded-lg flex items-center justify-center gap-1.5 text-[12px] font-medium transition-colors"
              href="tel:+447700900456"
            >
              <span className="material-symbols-outlined text-[18px] text-[#006a61]">call</span>
              <span>Call</span>
            </a>
            <a
              className="flex-1 h-11 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] rounded-lg flex items-center justify-center gap-1.5 text-[12px] font-medium transition-colors"
              href="https://wa.me/447700900456"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="material-symbols-outlined text-[18px] text-[#3040b6]">chat</span>
              <span>Message</span>
            </a>
            <button
              onClick={() => {
                showToast('Opening Navigation for Fulham SW6');
                window.open('https://maps.apple.com/?q=88+Hurlingham+Rd+Fulham', '_blank');
              }}
              className="h-11 px-3 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] rounded-lg flex items-center justify-center gap-1 text-[12px] font-medium cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-[#3040b6]">map</span>
              <span>Nav</span>
            </button>
          </div>
        </div>

        {/* Job 3 */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff] flex flex-col gap-2.5">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[17px] font-semibold text-[#131b2e]">Dr. James Aris</span>
              <span className="text-[13px] text-[#454653]">Fortnightly Regular Clean</span>
            </div>
            <span className="text-[12px] px-2.5 py-1 rounded-full bg-[#eaedff] text-[#454653] font-medium">
              Scheduled
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 bg-[#f2f3ff] rounded-lg p-2 text-[#131b2e]">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#757685] text-[16px]">schedule</span>
              <span className="text-[12px]">16:30 – 18:00</span>
            </div>
            <div className="flex items-center justify-end font-semibold text-[#11249f]">
              <span className="text-[18px]">£60.00</span>
            </div>
          </div>

          <div className="flex flex-col gap-1 text-[#454653] text-[13px]">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#006a61] text-[16px]">pin_drop</span>
              <span className="font-medium text-[#131b2e]">Putney SW15</span>
              <span className="text-[#757685]">•</span>
              <span>32 Disraeli Rd</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#e2e7ff]/60 px-2 py-1 rounded-md text-[#131b2e]">
              <span className="material-symbols-outlined text-[16px] text-[#006a61]">pets</span>
              <span className="text-[12px] font-medium">Friendly cat inside</span>
              <span className="text-[#454653] text-[11px]">(Keep kitchen door closed)</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <a
              className="flex-1 h-11 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] rounded-lg flex items-center justify-center gap-1.5 text-[12px] font-medium transition-colors"
              href="tel:+447700900789"
            >
              <span className="material-symbols-outlined text-[18px] text-[#006a61]">call</span>
              <span>Call</span>
            </a>
            <a
              className="flex-1 h-11 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] rounded-lg flex items-center justify-center gap-1.5 text-[12px] font-medium transition-colors"
              href="https://wa.me/447700900789"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="material-symbols-outlined text-[18px] text-[#3040b6]">chat</span>
              <span>Message</span>
            </a>
            <button
              onClick={() => {
                showToast('Opening Navigation for Putney SW15');
                window.open('https://maps.apple.com/?q=32+Disraeli+Rd+Putney', '_blank');
              }}
              className="h-11 px-3 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] rounded-lg flex items-center justify-center gap-1 text-[12px] font-medium cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-[#3040b6]">map</span>
              <span>Nav</span>
            </button>
          </div>
        </div>
      </div>

      {/* End of Day Note Card */}
      <div className="bg-[#f2f3ff] rounded-xl p-3 flex items-center justify-between border border-[#eaedff]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#006a61] text-[20px]">task_alt</span>
          <span className="text-[13px] text-[#131b2e]">All client supplies stocked for SW round</span>
        </div>
        <button
          onClick={() => showToast('Kit verified: microfibres, neutral spray, caddy full')}
          className="text-[12px] text-[#3040b6] font-semibold hover:underline"
        >
          Verify Kit
        </button>
      </div>
    </div>
  );
};
