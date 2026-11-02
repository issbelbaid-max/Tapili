import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export const CustomerProfileScreen: React.FC = () => {
  const { navigateTo, showToast, selectedCustomerId, customers } = useApp();
  const [isRevealed, setIsRevealed] = useState(false);
  const [hideSeconds, setHideSeconds] = useState(60);

  const currentCustomer = customers.find(c => c.id === selectedCustomerId) || customers[0];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRevealed) {
      setHideSeconds(60);
      interval = setInterval(() => {
        setHideSeconds(prev => {
          if (prev <= 1) {
            setIsRevealed(false);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRevealed]);

  return (
    <div className="flex flex-col w-full px-4 pb-28 pt-2 max-w-lg mx-auto">
      {/* Top Navigation & Profile Header */}
      <div className="flex items-center justify-between py-2 mb-2">
        <button
          onClick={() => navigateTo('customers')}
          aria-label="Back to Customers list"
          className="w-11 h-11 -ml-1 flex items-center justify-center rounded-full bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff] transition-colors active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">arrow_back</span>
        </button>
        <div className="flex items-center gap-1">
          <button
            onClick={() => showToast('Customer options')}
            aria-label="Customer Options"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f2f3ff] text-[#454653] hover:text-[#131b2e] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">more_vert</span>
          </button>
        </div>
      </div>

      {/* Profile Identity Card */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff] mb-3">
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <img
              className="w-16 h-16 rounded-full object-cover shadow-sm ring-2 ring-[#eaedff]"
              alt={currentCustomer?.name || 'Customer'}
              src={currentCustomer?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
            />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#89f5e7] flex items-center justify-center text-[#00201d] shadow-sm">
              <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
            </span>
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <h1 className="text-[24px] font-semibold text-[#131b2e] truncate leading-tight">
              {currentCustomer?.name || 'Customer'}
            </h1>
            <p className="text-[13px] text-[#454653] truncate mt-0.5">
              Client since {currentCustomer?.clientSince || 'Recent'}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              <span className="inline-flex items-center gap-1 h-7 px-2.5 rounded-full bg-[#e2e7ff] text-[#454653] text-[12px] font-medium">
                <span className="material-symbols-outlined text-[14px]">event_repeat</span>
                {currentCustomer?.cadenceLabel || 'Regular'}
              </span>
              <span className="inline-flex items-center gap-1 h-7 px-2.5 rounded-full bg-[#86f2e4] text-[#006f66] text-[12px] font-medium">
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                {currentCustomer?.isRegular ? 'Regular Client' : 'Ad-Hoc Client'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action Strip */}
        <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-[#eaedff]">
          <a
            className="flex flex-col items-center justify-center py-2.5 px-1 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] active:scale-95 transition-all text-center"
            href={`tel:${currentCustomer?.phone || ''}`}
          >
            <span className="material-symbols-outlined text-[#3040b6] text-[20px] mb-1">call</span>
            <span className="text-[12px] font-medium text-[#131b2e]">Call</span>
          </a>
          <a
            className="flex flex-col items-center justify-center py-2.5 px-1 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] active:scale-95 transition-all text-center"
            href={`https://wa.me/${(currentCustomer?.phone || '').replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="material-symbols-outlined text-[#006a61] text-[20px] mb-1">chat</span>
            <span className="text-[12px] font-medium text-[#131b2e]">WhatsApp</span>
          </a>
          <a
            className="flex flex-col items-center justify-center py-2.5 px-1 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] active:scale-95 transition-all text-center"
            href={`mailto:${currentCustomer?.email || ''}`}
          >
            <span className="material-symbols-outlined text-[#757685] text-[20px] mb-1">mail</span>
            <span className="text-[12px] font-medium text-[#131b2e]">Email</span>
          </a>
          <button
            onClick={() => navigateTo('new-job')}
            className="flex flex-col items-center justify-center py-2.5 px-1 rounded-lg bg-[#dfe0ff] hover:bg-[#e2e7ff] active:scale-95 transition-all text-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[#3040b6] text-[20px] mb-1">calendar_add_on</span>
            <span className="text-[12px] font-semibold text-[#000b62]">Book</span>
          </button>
        </div>

        {/* Address Anchor */}
        <div className="flex items-center justify-between gap-2 mt-3 p-2.5 rounded-lg bg-[#f2f3ff]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#dae2fd] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#454653] text-[18px]">location_on</span>
            </div>
            <div className="min-w-0">
              <p className="text-[13px] text-[#131b2e] font-medium truncate">
                {currentCustomer?.addressLine1 || 'Property Address'}
              </p>
              <p className="text-[12px] text-[#454653] truncate">
                {currentCustomer?.addressLine2 ? `${currentCustomer.addressLine2}, ` : ''}{currentCustomer?.postcode || ''}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              showToast('Opening navigation map...');
              window.open(`https://maps.apple.com/?q=${encodeURIComponent(`${currentCustomer?.addressLine1 || ''} ${currentCustomer?.postcode || ''}`)}`, '_blank');
            }}
            className="h-8 px-3 shrink-0 rounded-full bg-white text-[#3040b6] text-[12px] font-medium flex items-center gap-1 shadow-sm active:scale-95 transition-transform"
          >
            <span>Map</span>
            <span className="material-symbols-outlined text-[14px]">directions</span>
          </button>
        </div>
      </div>

      {/* Financial Summary Card */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff] mb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#3040b6] text-[20px]">payments</span>
            <h2 className="text-[17px] font-semibold text-[#131b2e]">Financial Summary</h2>
          </div>
          <span className={`text-[12px] px-2.5 py-0.5 rounded-full font-medium ${
            (currentCustomer?.outstandingBalance || 0) > 0 ? 'bg-[#ffddb8] text-[#503000]' : 'bg-[#89f5e7] text-[#005049]'
          }`}>
            {(currentCustomer?.outstandingBalance || 0) > 0 ? `£${currentCustomer?.outstandingBalance?.toFixed(2)} Due` : 'All Settled'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="p-3 rounded-lg bg-[#f2f3ff] flex flex-col justify-between">
            <span className="text-[12px] text-[#454653]">Total Paid</span>
            <div className="mt-1">
              <div className="text-[28px] font-semibold text-[#131b2e] leading-none">
                £{(currentCustomer?.totalPaidLifetime || 0).toLocaleString()}
              </div>
              <span className="text-[13px] text-[#006a61] font-medium mt-1 inline-block">
                {currentCustomer?.cleansCompleted || 0} cleans done
              </span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-[#f2f3ff] flex flex-col justify-between">
            <span className="text-[12px] text-[#454653]">Outstanding</span>
            <div className="mt-1">
              <div className="text-[28px] font-semibold text-[#131b2e] leading-none">
                £{(currentCustomer?.outstandingBalance || 0).toFixed(2)}
              </div>
              <span className="text-[13px] text-[#006a61] font-medium mt-1 inline-flex items-center gap-1">
                {(currentCustomer?.outstandingBalance || 0) > 0 ? (
                  <span className="text-[#ba1a1a]">Action required</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    All caught up!
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#f2f3ff]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#454653] text-[18px]">receipt_long</span>
            <span className="text-[13px] text-[#454653]">Standard rate</span>
          </div>
          <span className="text-[20px] font-semibold text-[#131b2e]">
            £{(currentCustomer?.standardRate || 65.00).toFixed(2)} <span className="text-[13px] font-normal text-[#454653]">/ clean</span>
          </span>
        </div>
      </div>

      {/* Property Access Protocol (Masked / Revealed) */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff] mb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#6f4500] text-[20px]">shield_lock</span>
            <h2 className="text-[17px] font-semibold text-[#131b2e]">Property Access Protocol</h2>
          </div>
          <span className={`text-[12px] px-2 py-0.5 rounded font-medium ${
            isRevealed ? 'bg-[#89f5e7] text-[#005049]' : 'bg-[#ffddb8] text-[#653e00]'
          }`}>
            {isRevealed ? 'Revealed' : 'Masked'}
          </span>
        </div>

        {/* Masked Box */}
        <div className="rounded-lg p-3 bg-[#f2f3ff] transition-all">
          {!isRevealed ? (
            <div className="flex flex-col items-center text-center py-2">
              <div className="w-10 h-10 rounded-full bg-[#e2e7ff] flex items-center justify-center text-[#3040b6] mb-2">
                <span className="material-symbols-outlined text-[22px]">key</span>
              </div>
              <p className="text-[13px] text-[#454653] max-w-[240px] mb-3">
                Hidden for customer privacy. Contains key safe combination & alarm code.
              </p>
              <button
                onClick={() => {
                  setIsRevealed(true);
                  showToast('Security protocol unlocked');
                }}
                className="h-11 px-4 rounded-lg bg-[#3040b6] text-white text-[14px] font-medium flex items-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">visibility</span>
                <span>Reveal Lockbox & Alarm</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 py-1 animate-in fade-in">
              <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-[#eaedff]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#757685] text-[18px]">lock</span>
                  <span className="text-[13px] text-[#454653]">{currentCustomer?.lockboxLocation || 'Lockbox / Access'}</span>
                </div>
                <span className="text-[18px] text-[#3040b6] tracking-widest font-mono font-bold">
                  {currentCustomer?.lockboxCode || '#0000'}
                </span>
              </div>
              {currentCustomer?.alarmCode && (
                <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-[#eaedff]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#757685] text-[18px]">notifications_active</span>
                    <span className="text-[13px] text-[#454653]">Alarm Panel</span>
                  </div>
                  <span className="text-[18px] text-[#3040b6] tracking-widest font-mono font-bold">
                    {currentCustomer.alarmCode}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[12px] text-[#454653] italic">Auto-hides in {hideSeconds}s</span>
                <button
                  onClick={() => setIsRevealed(false)}
                  className="text-[12px] text-[#3040b6] font-medium hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">visibility_off</span>
                  Hide now
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Client Special Instructions */}
        <div className="mt-3 p-3 rounded-lg bg-[#e2e7ff]/60">
          <div className="flex items-center gap-1.5 text-[#454653] mb-1.5">
            <span className="material-symbols-outlined text-[18px] text-[#503000]">cruelty_free</span>
            <span className="text-[12px] text-[#131b2e] font-medium">Household & Access Notes</span>
          </div>
          <p className="text-[13px] text-[#454653] leading-relaxed">
            {currentCustomer?.householdNotes || currentCustomer?.keysHeldNote || 'Standard domestic access on file.'}
          </p>
        </div>
      </div>

      {/* Job History Timeline */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff] mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#3040b6] text-[20px]">history</span>
            <h2 className="text-[17px] font-semibold text-[#131b2e]">Job History</h2>
          </div>
          <button
            onClick={() => showToast('Displaying complete history of 22 cleans')}
            className="text-[12px] text-[#3040b6] hover:underline font-medium"
          >
            View all (22)
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {/* Item 1: 24 Oct */}
          <div
            onClick={() => navigateTo('job-detail', { jobId: 'job-1' })}
            className="flex items-center justify-between p-2.5 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#e2e7ff] flex items-center justify-center shrink-0">
                <span
                  className="material-symbols-outlined text-[#006a61] text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  task_alt
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-[14px] text-[#131b2e] font-medium">24 Oct 2024</p>
                <p className="text-[12px] text-[#454653]">Weekly Standard • 2h 30m</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-[17px] font-semibold text-[#131b2e]">£65.00</span>
              <span className="h-6 px-2 rounded-full bg-[#86f2e4] text-[#006f66] text-[11px] leading-tight flex items-center font-medium">
                Completed
              </span>
            </div>
          </div>

          {/* Item 2: 17 Oct */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#e2e7ff] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#006a61] text-[18px]">done_all</span>
              </div>
              <div className="min-w-0">
                <p className="text-[14px] text-[#131b2e] font-medium">17 Oct 2024</p>
                <p className="text-[12px] text-[#454653]">Weekly Standard • 2h 30m</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-[17px] font-semibold text-[#131b2e]">£65.00</span>
              <span className="h-6 px-2 rounded-full bg-[#dae2fd] text-[#454653] text-[11px] leading-tight flex items-center font-medium">
                Paid
              </span>
            </div>
          </div>

          {/* Item 3: 10 Oct */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#e2e7ff] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#006a61] text-[18px]">done_all</span>
              </div>
              <div className="min-w-0">
                <p className="text-[14px] text-[#131b2e] font-medium">10 Oct 2024</p>
                <p className="text-[12px] text-[#454653]">Deep Clean Oven add-on</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-[17px] font-semibold text-[#131b2e]">£65.00</span>
              <span className="h-6 px-2 rounded-full bg-[#dae2fd] text-[#454653] text-[11px] leading-tight flex items-center font-medium">
                Paid
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Group */}
      <div className="flex items-center gap-2 mt-auto">
        <button
          onClick={() => showToast('Editing Charlotte Davies contact & rates')}
          className="h-12 px-4 rounded-xl bg-[#f2f3ff] text-[#131b2e] text-[14px] font-medium flex items-center justify-center gap-2 hover:bg-[#eaedff] active:scale-95 transition-all shadow-sm cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">edit</span>
          <span>Edit</span>
        </button>
        <button
          onClick={() => navigateTo('new-job')}
          className="h-12 px-4 flex-1 rounded-xl bg-[#3040b6] text-white text-[14px] font-medium flex items-center justify-center gap-2 hover:bg-[#11249f] active:scale-95 transition-all shadow-md cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>Schedule New Job</span>
        </button>
      </div>
    </div>
  );
};
