import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';

export const CustomersScreen: React.FC = () => {
  const { customers, navigateTo, showToast, setIsAddCustomerOpen } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'weekly' | 'fortnightly' | 'owing'>('all');

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      // Filter tab
      if (activeFilter === 'weekly' && c.cadence !== 'weekly') return false;
      if (activeFilter === 'fortnightly' && c.cadence !== 'fortnightly') return false;
      if (activeFilter === 'owing' && (!c.overdueInvoice || c.overdueInvoice.amount <= 0)) return false;

      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.addressLine1.toLowerCase().includes(q) ||
        c.postcode.toLowerCase().includes(q) ||
        c.householdNotes.toLowerCase().includes(q)
      );
    });
  }, [customers, activeFilter, searchQuery]);

  return (
    <div className="flex flex-col w-full px-4 space-y-3 pb-28 pt-2 max-w-lg mx-auto">
      {/* Top Utility Header & Creation Action */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <div className="flex items-baseline gap-1.5">
            <h1 className="text-[24px] font-semibold text-[#131b2e] tracking-tight">Customers</h1>
            <span className="text-[12px] font-semibold text-[#11249f]">{customers.length} Clients</span>
          </div>
          <p className="text-[13px] text-[#454653]">Tap to contact, view keys, or log payment</p>
        </div>
        <button
          onClick={() => setIsAddCustomerOpen(true)}
          className="h-10 px-3.5 rounded-full bg-[#3040b6] text-white text-[14px] font-medium flex items-center gap-1.5 shadow-sm active:bg-[#11249f] hover:bg-[#2031a7] transition-all cursor-pointer"
          type="button"
          aria-label="Add New Client"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          <span>Add</span>
        </button>
      </div>

      {/* High-Precision Instant Search Field */}
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#757685]">
          <span className="material-symbols-outlined text-[20px]">search</span>
        </div>
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search clients by name, street, or postcode"
          className="w-full h-12 pl-10 pr-10 rounded-xl bg-[#f2f3ff] text-[#131b2e] placeholder:text-[#757685] text-[14px] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3040b6]/20 transition-all border border-transparent focus:border-[#3040b6]"
          placeholder="Search by name, street, or postcode..."
          type="text"
        />
        {searchQuery.length > 0 && (
          <button
            onClick={() => setSearchQuery('')}
            aria-label="Clear search"
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#757685] hover:text-[#131b2e] transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">cancel</span>
          </button>
        )}
      </div>

      {/* Operational Filter Strip (Horizontal Scroll) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar -mx-4 px-4 py-0.5" role="tablist">
        <button
          onClick={() => setActiveFilter('all')}
          className={`shrink-0 h-8 px-3 rounded-full text-[12px] font-medium flex items-center gap-1 transition-colors cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-[#3040b6] text-white shadow-xs'
              : 'bg-[#e2e7ff] text-[#454653] hover:bg-[#dae2fd]'
          }`}
          type="button"
        >
          <span>All</span>
          <span className="opacity-80 text-[11px] font-normal">(28)</span>
        </button>

        <button
          onClick={() => setActiveFilter('weekly')}
          className={`shrink-0 h-8 px-3 rounded-full text-[12px] font-medium flex items-center gap-1 transition-colors cursor-pointer ${
            activeFilter === 'weekly'
              ? 'bg-[#3040b6] text-white shadow-xs'
              : 'bg-[#e2e7ff] text-[#454653] hover:bg-[#dae2fd]'
          }`}
          type="button"
        >
          <span>Weekly</span>
          <span className="opacity-75 text-[11px] font-normal">(16)</span>
        </button>

        <button
          onClick={() => setActiveFilter('fortnightly')}
          className={`shrink-0 h-8 px-3 rounded-full text-[12px] font-medium flex items-center gap-1 transition-colors cursor-pointer ${
            activeFilter === 'fortnightly'
              ? 'bg-[#3040b6] text-white shadow-xs'
              : 'bg-[#e2e7ff] text-[#454653] hover:bg-[#dae2fd]'
          }`}
          type="button"
        >
          <span>Fortnightly</span>
          <span className="opacity-75 text-[11px] font-normal">(9)</span>
        </button>

        <button
          onClick={() => setActiveFilter('owing')}
          className={`shrink-0 h-8 px-3 rounded-full text-[12px] font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
            activeFilter === 'owing'
              ? 'bg-[#503000] text-white shadow-sm'
              : 'bg-[#ffddb8] text-[#653e00] hover:opacity-95'
          }`}
          type="button"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#6f4500] animate-pulse"></span>
          <span className="font-semibold">Owing</span>
          <span className="font-bold text-[11px]">(3)</span>
        </button>
      </div>

      {/* Customer Cards Stack */}
      <div className="flex flex-col space-y-3">
        {filteredCustomers.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-8 bg-[#f2f3ff] rounded-2xl space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#e2e7ff] flex items-center justify-center text-[#11249f]">
              <span className="material-symbols-outlined text-[28px]">search_off</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-[17px] font-semibold text-[#131b2e]">No regulars found</h3>
              <p className="text-[13px] text-[#454653] max-w-[220px]">
                Try searching by postcode like "SW6" or clear active filters
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }}
              className="h-10 px-4 rounded-full bg-[#dae2fd] text-[#131b2e] text-[12px] font-medium cursor-pointer"
              type="button"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredCustomers.map(customer => {
            const hasOverdue = customer.overdueInvoice && customer.overdueInvoice.amount > 0;

            return (
              <article
                key={customer.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff] space-y-3 transition-transform active:scale-[0.995]"
              >
                {/* Header Row: Identity & Cadence Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div
                    className="flex items-center gap-3 min-w-0 cursor-pointer"
                    onClick={() => navigateTo('customer-profile', { customerId: customer.id })}
                  >
                    <div className="relative w-11 h-11 shrink-0 rounded-full overflow-hidden bg-[#dfe0ff] flex items-center justify-center">
                      <img
                        className="w-full h-full object-cover"
                        alt={customer.name}
                        src={customer.avatar}
                      />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-[17px] font-semibold text-[#131b2e] truncate hover:text-[#3040b6] transition-colors">
                        {customer.name}
                      </h2>
                      <p className="text-[13px] text-[#454653] flex items-center gap-1 truncate">
                        <span className="material-symbols-outlined text-[15px] text-[#757685] shrink-0">
                          location_on
                        </span>
                        <span className="truncate">{customer.addressLine1}, {customer.postcode}</span>
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 px-2.5 py-1 rounded-full bg-[#e2e7ff] text-[#2737ae] text-[11px] font-medium tracking-tight">
                    {customer.cadenceLabel}
                  </span>
                </div>

                {/* Overdue Alert banner if applicable */}
                {hasOverdue && (
                  <div className="p-3 rounded-lg bg-[#ffddb8]/60 text-[#2a1700] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px] text-[#503000] font-bold shrink-0">
                        error
                      </span>
                      <div>
                        <div className="text-[14px] font-semibold text-[#503000] leading-none">
                          £{customer.overdueInvoice!.amount.toFixed(2)} Overdue
                        </div>
                        <div className="text-[11px] text-[#653e00] mt-0.5">
                          Invoice {customer.overdueInvoice!.number} • {customer.overdueInvoice!.daysOverdue} days past due
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-[#ffddb8] text-[#2a1700] text-[11px] font-bold">
                      Action req.
                    </span>
                  </div>
                )}

                {/* Domain Operational Pill */}
                <div className="p-2.5 rounded-lg bg-[#f2f3ff] flex items-center justify-between text-[#454653] text-[13px]">
                  <div className="flex items-center gap-2 truncate">
                    <span className="material-symbols-outlined text-[#3040b6] text-[18px] shrink-0">key</span>
                    <span className="font-medium text-[#131b2e] truncate">{customer.keysHeldNote}</span>
                  </div>
                  <span className="material-symbols-outlined text-[#757685] text-[16px] shrink-0">
                    {customer.householdNotes.includes('cat') || customer.householdNotes.includes('Dog') ? 'pets' : 'shield'}
                  </span>
                </div>

                {/* Financial Lifecycle Summary */}
                <div className="flex items-center justify-between px-1 text-[12px] text-[#454653]">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#006a61]">verified</span>
                    <span className="font-semibold text-[#131b2e]">£{customer.totalPaidLifetime}</span>
                    <span>lifetime paid</span>
                  </div>
                  <span className="text-[#757685]">{customer.cleansCompleted} cleans completed</span>
                </div>

                {/* Thumb Action Bar */}
                {hasOverdue ? (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => {
                        showToast(`Sent payment reminder WhatsApp link to ${customer.name}`);
                        window.open(`https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}?text=Hi%20${customer.name.split(' ')[0]}%2C%20friendly%20reminder%20regarding%20overdue%20invoice%20${customer.overdueInvoice?.number}%20for%20%C2%A3${customer.overdueInvoice?.amount}`, '_blank');
                      }}
                      className="h-11 rounded-lg bg-[#503000] text-white text-[12px] font-medium flex items-center justify-center gap-1.5 active:bg-[#6f4500] shadow-xs transition-colors cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">forward_to_inbox</span>
                      <span className="truncate">Send Reminder</span>
                    </button>
                    <a
                      className="h-11 rounded-lg bg-[#e2e7ff] text-[#131b2e] text-[12px] font-medium flex items-center justify-center gap-1.5 active:bg-[#dae2fd] transition-colors"
                      href={`tel:${customer.phone}`}
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#11249f]">call</span>
                      <span>Call {customer.name.split(' ')[0]}</span>
                    </a>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <a
                      className="h-11 rounded-lg bg-[#e2e7ff] text-[#131b2e] text-[12px] font-medium flex items-center justify-center gap-1.5 active:bg-[#dae2fd] transition-colors"
                      href={`tel:${customer.phone}`}
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#11249f]">call</span>
                      <span>Call</span>
                    </a>
                    <button
                      onClick={() => {
                        showToast(`Opened message thread for ${customer.name}`);
                        window.open(`https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}`, '_blank');
                      }}
                      className="h-11 rounded-lg bg-[#e2e7ff] text-[#131b2e] text-[12px] font-medium flex items-center justify-center gap-1.5 active:bg-[#dae2fd] transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#006a61]">chat</span>
                      <span>Message</span>
                    </button>
                    <button
                      onClick={() => navigateTo('new-job', { customerId: customer.id })}
                      className="h-11 rounded-lg bg-[#3040b6] text-white text-[12px] font-medium flex items-center justify-center gap-1.5 active:bg-[#11249f] transition-colors cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">calendar_add_on</span>
                      <span>Book Clean</span>
                    </button>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};
