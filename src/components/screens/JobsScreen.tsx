import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const JobsScreen: React.FC = () => {
  const { navigateTo, markJobComplete, showToast } = useApp();
  const [activeSegment, setActiveSegment] = useState<'today' | 'upcoming' | 'completed'>('today');
  const [selectedDay, setSelectedDay] = useState<number>(24);

  const days = [
    { dayName: 'Mon', date: 21 },
    { dayName: 'Tue', date: 22 },
    { dayName: 'Wed', date: 23 },
    { dayName: 'Thu', date: 24, isDefault: true },
    { dayName: 'Fri', date: 25 },
    { dayName: 'Sat', date: 26 },
  ];

  return (
    <div className="flex flex-col w-full pb-28 max-w-lg mx-auto">
      {/* Page Header & New Job Action */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-semibold text-[#131b2e] tracking-tight">Jobs</h1>
          <p className="text-[13px] text-[#454653] mt-0.5">Thursday, 24 October</p>
        </div>
        <button
          onClick={() => navigateTo('new-job')}
          className="flex items-center gap-1.5 bg-[#3040b6] hover:bg-[#11249f] active:bg-[#2737ae] text-white text-[14px] font-medium px-4 h-12 rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            add
          </span>
          <span>New Job</span>
        </button>
      </div>

      {/* Segmented View Tabs */}
      <div className="px-4 pt-1 pb-2">
        <div className="grid grid-cols-3 p-1 bg-[#eaedff] rounded-xl text-[14px]">
          <button
            onClick={() => setActiveSegment('today')}
            className={`py-2 text-center rounded-lg font-medium transition-all cursor-pointer ${
              activeSegment === 'today'
                ? 'bg-white text-[#3040b6] shadow-sm font-semibold'
                : 'text-[#454653] hover:text-[#131b2e]'
            }`}
          >
            Today (3)
          </button>
          <button
            onClick={() => setActiveSegment('upcoming')}
            className={`py-2 text-center rounded-lg font-medium transition-all cursor-pointer ${
              activeSegment === 'upcoming'
                ? 'bg-white text-[#3040b6] shadow-sm font-semibold'
                : 'text-[#454653] hover:text-[#131b2e]'
            }`}
          >
            Upcoming (8)
          </button>
          <button
            onClick={() => setActiveSegment('completed')}
            className={`py-2 text-center rounded-lg font-medium transition-all cursor-pointer ${
              activeSegment === 'completed'
                ? 'bg-white text-[#3040b6] shadow-sm font-semibold'
                : 'text-[#454653] hover:text-[#131b2e]'
            }`}
          >
            Completed (14)
          </button>
        </div>
      </div>

      {/* Horizontal Week Strip */}
      <div className="pt-1 pb-3">
        <div className="flex items-center gap-2 px-4 overflow-x-auto no-scrollbar">
          {days.map(d => {
            const isSelected = selectedDay === d.date;
            return (
              <button
                key={d.date}
                onClick={() => setSelectedDay(d.date)}
                className={`flex flex-col items-center justify-center min-w-[52px] h-[66px] rounded-xl shadow-sm transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#3040b6] text-white shadow-md relative scale-105'
                    : 'bg-white text-[#131b2e] active:bg-[#eaedff] border border-[#eaedff]'
                }`}
              >
                <span className={`text-[12px] font-medium ${isSelected ? 'text-[#b4bcff]' : 'text-[#454653]'}`}>
                  {d.dayName}
                </span>
                <span className="text-[17px] font-semibold mt-0.5">{d.date}</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#86f2e4] mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Day Ticker / Stat Pill */}
      <div className="px-4 mb-2">
        <div className="bg-[#e2e7ff] rounded-xl p-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white text-[#3040b6]">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </span>
            <span className="text-[14px] font-medium text-[#131b2e]">
              {selectedDay === 24 ? '3 Jobs booked for today' : `2 Jobs booked for ${selectedDay} Oct`}
            </span>
          </div>
          <span className="text-[14px] font-semibold text-[#3040b6]">£245.00</span>
        </div>
      </div>

      {/* Job Cards Stack */}
      <div className="px-4 flex flex-col gap-3 pb-4">
        {/* Card 1: In Progress */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff] flex flex-col gap-3 relative overflow-hidden">
          {/* Accent strip */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#3040b6]"></div>

          <div className="flex items-start justify-between pl-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 bg-[#e2e7ff] text-[#454653] px-2.5 py-1 rounded-full text-[12px] font-medium">
                <span className="material-symbols-outlined text-[15px]">schedule</span>
                09:30 - 11:30 (2 hrs)
              </span>
              <span className="inline-flex items-center gap-1 bg-[#eaedff] text-[#3040b6] px-2.5 py-1 rounded-full text-[12px] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#3040b6] animate-pulse"></span>
                Started 09:35
              </span>
            </div>
            <span className="text-[20px] font-semibold text-[#131b2e] tabular-nums">£65.00</span>
          </div>

          <div
            className="pl-1 flex flex-col gap-1 cursor-pointer"
            onClick={() => navigateTo('job-detail', { jobId: 'job-1' })}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-[17px] font-semibold text-[#131b2e] hover:text-[#3040b6] transition-colors">
                Charlotte Davies
              </h2>
              <span className="text-[12px] text-[#006f66] bg-[#86f2e4]/40 px-2 py-0.5 rounded-full font-medium">
                Domestic
              </span>
            </div>
            <p className="text-[14px] text-[#454653] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#757685]">location_on</span>
              42 Crescent Gardens, Richmond, TW9
            </p>
            <p className="text-[13px] text-[#454653] mt-0.5">
              Standard Domestic Clean • Deep dusting & kitchen refresh
            </p>
          </div>

          <div className="pt-1">
            <button
              onClick={() => {
                markJobComplete('job-1');
                navigateTo('invoice-detail');
              }}
              className="w-full h-12 bg-[#006a61] text-white hover:bg-[#005049] active:bg-[#86f2e4] font-medium text-[14px] rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                task_alt
              </span>
              <span>Mark as Done & Invoice</span>
            </button>
          </div>
        </div>

        {/* Card 2: Oliver Sterling */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff] flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 bg-[#eaedff] text-[#454653] px-2.5 py-1 rounded-full text-[12px] font-medium">
                <span className="material-symbols-outlined text-[15px]">schedule</span>
                12:30 - 15:30 (3 hrs)
              </span>
              <span className="text-[12px] text-[#653e00] bg-[#ffddb8] px-2 py-0.5 rounded-full font-medium">
                Next Up
              </span>
            </div>
            <span className="text-[20px] font-semibold text-[#131b2e] tabular-nums">£120.00</span>
          </div>

          <div
            className="flex flex-col gap-1 cursor-pointer"
            onClick={() => navigateTo('job-detail', { jobId: 'job-2' })}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-[17px] font-semibold text-[#131b2e] hover:text-[#3040b6] transition-colors">
                Oliver Sterling
              </h2>
              <span className="text-[12px] text-[#11249f] bg-[#dfe0ff] px-2 py-0.5 rounded-full font-medium">
                Deep Clean
              </span>
            </div>
            <p className="text-[14px] text-[#454653] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#757685]">location_on</span>
              18 Hurlingham Rd, Fulham, SW6
            </p>
            <p className="text-[13px] text-[#131b2e] font-medium">End of Tenancy Deep Clean</p>
          </div>

          <div className="bg-[#f2f3ff] rounded-xl p-3 flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[20px] text-[#6f4500] mt-0.5">key</span>
            <div className="flex flex-col">
              <span className="text-[12px] font-semibold text-[#131b2e]">Lockbox Code: #5821</span>
              <span className="text-[13px] text-[#454653]">
                Cleaning supplies stored in utility cupboard next to kitchen.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <a
              className="h-11 bg-[#f2f3ff] hover:bg-[#eaedff] active:bg-[#e2e7ff] rounded-xl flex items-center justify-center gap-1.5 text-[#131b2e] text-[12px] font-medium transition-colors"
              href="tel:07700900123"
            >
              <span className="material-symbols-outlined text-[19px] text-[#11249f]">call</span>
              <span>Call</span>
            </a>
            <button
              onClick={() => {
                showToast('Opening directions to Fulham SW6...');
                window.open('https://maps.apple.com/?q=18+Hurlingham+Rd+Fulham', '_blank');
              }}
              className="h-11 bg-[#f2f3ff] hover:bg-[#eaedff] active:bg-[#e2e7ff] rounded-xl flex items-center justify-center gap-1.5 text-[#131b2e] text-[12px] font-medium transition-colors"
            >
              <span className="material-symbols-outlined text-[19px] text-[#006a61]">navigation</span>
              <span>Maps</span>
            </button>
            <button
              onClick={() => {
                showToast('Opening WhatsApp chat with Oliver Sterling...');
                window.open('https://wa.me/447700900123?text=Hi%20Oliver%2C%20on%20my%20way%20for%20the%20deep%20clean', '_blank');
              }}
              className="h-11 bg-[#f2f3ff] hover:bg-[#eaedff] active:bg-[#e2e7ff] rounded-xl flex items-center justify-center gap-1.5 text-[#131b2e] text-[12px] font-medium transition-colors"
            >
              <span className="material-symbols-outlined text-[19px] text-[#006f66]">chat</span>
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Card 3: Dr. James Aris */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff] flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <span className="inline-flex items-center gap-1 bg-[#eaedff] text-[#454653] px-2.5 py-1 rounded-full text-[12px] font-medium">
              <span className="material-symbols-outlined text-[15px]">schedule</span>
              16:30 - 18:00 (1.5 hrs)
            </span>
            <span className="text-[20px] font-semibold text-[#131b2e] tabular-nums">£60.00</span>
          </div>

          <div
            className="flex flex-col gap-1 cursor-pointer"
            onClick={() => navigateTo('job-detail', { jobId: 'job-3' })}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-[17px] font-semibold text-[#131b2e] hover:text-[#3040b6] transition-colors">
                Dr. James Aris
              </h2>
              <span className="text-[12px] text-[#006f66] bg-[#86f2e4]/40 px-2 py-0.5 rounded-full font-medium">
                Regular
              </span>
            </div>
            <p className="text-[14px] text-[#454653] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#757685]">location_on</span>
              87 Upper Richmond Rd, Putney, SW15
            </p>
            <p className="text-[13px] text-[#131b2e] font-medium">Fortnightly Regular Clean</p>
          </div>

          <div className="bg-[#f2f3ff] rounded-xl p-3 flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[20px] text-[#006a61] mt-0.5">pets</span>
            <div className="flex flex-col">
              <span className="text-[12px] font-semibold text-[#131b2e]">Friendly ginger cat in house</span>
              <span className="text-[13px] text-[#454653]">Please keep the back patio door firmly closed.</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <a
              className="h-11 bg-[#f2f3ff] hover:bg-[#eaedff] active:bg-[#e2e7ff] rounded-xl flex items-center justify-center gap-1.5 text-[#131b2e] text-[12px] font-medium transition-colors"
              href="tel:07700900456"
            >
              <span className="material-symbols-outlined text-[19px] text-[#11249f]">call</span>
              <span>Call</span>
            </a>
            <button
              onClick={() => {
                showToast('Opening directions to Putney SW15...');
                window.open('https://maps.apple.com/?q=87+Upper+Richmond+Rd+Putney', '_blank');
              }}
              className="h-11 bg-[#f2f3ff] hover:bg-[#eaedff] active:bg-[#e2e7ff] rounded-xl flex items-center justify-center gap-1.5 text-[#131b2e] text-[12px] font-medium transition-colors"
            >
              <span className="material-symbols-outlined text-[19px] text-[#006a61]">navigation</span>
              <span>Maps</span>
            </button>
            <button
              onClick={() => {
                showToast('Opening WhatsApp chat with Dr. James Aris...');
                window.open('https://wa.me/447700900456', '_blank');
              }}
              className="h-11 bg-[#f2f3ff] hover:bg-[#eaedff] active:bg-[#e2e7ff] rounded-xl flex items-center justify-center gap-1.5 text-[#131b2e] text-[12px] font-medium transition-colors"
            >
              <span className="material-symbols-outlined text-[19px] text-[#006f66]">chat</span>
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Summary Bar (Sticky Glance) */}
      <div className="px-4 pb-4">
        <div className="bg-[#283044] text-[#eef0ff] rounded-xl p-4 shadow-md flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[12px] text-[#bcc2ff] font-medium uppercase tracking-wider">
              Today's Dispatch
            </span>
            <span className="text-[13px] text-[#eef0ff] mt-0.5">3 jobs • 6.5 active hours</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[12px] text-[#bcc2ff] font-medium uppercase tracking-wider">Projected</span>
            <span className="text-[20px] text-white font-semibold tabular-nums">£245.00</span>
          </div>
        </div>
      </div>
    </div>
  );
};
