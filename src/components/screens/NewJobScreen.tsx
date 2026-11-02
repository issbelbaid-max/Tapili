import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const NewJobScreen: React.FC = () => {
  const { navigateTo, addJob, showToast, bookingLink, regenerateBookingLink, customers, setIsAddCustomerOpen } = useApp();

  const [selectedCustId, setSelectedCustId] = useState<string>(customers[0]?.id || 'cust-charlotte');
  const [selectedService, setSelectedService] = useState<'regular' | 'deep' | 'tenancy' | 'oven'>('regular');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressLine1, setAddressLine1] = useState(customers[0]?.addressLine1 || '14 Richmond Crescent, Flat 2B');
  const [addressLine2, setAddressLine2] = useState(customers[0]?.addressLine2 ? `${customers[0].addressLine2}, ${customers[0].postcode}` : 'Islington, London N1 0TR');
  const [dateStr, setDateStr] = useState('2024-10-25');
  const [timeWindow, setTimeWindow] = useState('09:30 – 12:30');
  const [agreedPrice, setAgreedPrice] = useState(customers[0]?.standardRate ? customers[0].standardRate.toFixed(2) : '75.00');
  const [depositPaid, setDepositPaid] = useState('20.00');
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [depositPolicy, setDepositPolicy] = useState<'required' | 'optional' | 'none'>('required');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentCustomer = customers.find(c => c.id === selectedCustId) || customers[0];

  const handleSelectCustomer = (cust: typeof customers[0]) => {
    setSelectedCustId(cust.id);
    setAddressLine1(cust.addressLine1 || '');
    setAddressLine2(`${cust.addressLine2 ? cust.addressLine2 + ', ' : ''}${cust.postcode || ''}`);
    if (cust.standardRate && cust.standardRate > 0) {
      setAgreedPrice(cust.standardRate.toFixed(2));
      setDepositPaid((cust.standardRate > 50 ? 20 : 15).toFixed(2));
    }
  };

  const priceNum = parseFloat(agreedPrice) || 0;
  const depositNum = parseFloat(depositPaid) || 0;
  const balanceDue = Math.max(0, priceNum - depositNum);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(bookingLink);
    setCopied(true);
    showToast('Booking link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmBooking = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const newJobId = addJob({
        customerId: currentCustomer?.id || 'cust-charlotte',
        customerName: currentCustomer?.name || 'Charlotte Davies',
        price: priceNum,
        depositPaid: depositNum,
        balanceDue: balanceDue,
        serviceTitle: selectedService === 'regular' ? 'Regular Clean (3 bed)' : 'Deep Clean',
        propertyAddress: `${addressLine1}${addressLine2 ? ', ' + addressLine2 : ''}`,
        dateLabel: 'Tomorrow, 25 Oct',
        timeWindow: timeWindow,
      });
      setIsSubmitting(false);
      navigateTo('job-detail', { jobId: newJobId });
    }, 700);
  };

  return (
    <div className="flex flex-col w-full pb-36 max-w-lg mx-auto">
      {/* Top Navigation Bar */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('jobs')}
            aria-label="Back to Jobs"
            className="w-10 h-10 -ml-1 rounded-full flex items-center justify-center text-[#131b2e] hover:bg-[#f2f3ff] transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <div>
            <h1 className="text-[20px] font-semibold text-[#131b2e] tracking-tight">New Job</h1>
            <p className="text-[12px] text-[#454653] flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006a61]"></span>
              Quick 30s booking
            </p>
          </div>
        </div>

        <div className="bg-[#e2e7ff] px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
          <span
            className="material-symbols-outlined text-[16px] text-[#3040b6]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            timer
          </span>
          <span className="text-[12px] font-semibold text-[#3040b6]">Fast Track</span>
        </div>
      </div>

      <div className="px-4 flex flex-col gap-3 mt-1">
        {/* 1. Customer Selector Block */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-[14px] text-[#131b2e] font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#3040b6]">person</span>
              Select Customer
            </label>
            <span className="text-[12px] text-[#454653]">Step 1 of 5</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {customers.map((c) => {
              const isSelected = selectedCustId === c.id;
              const initials = c.name
                .split(' ')
                .map(n => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase();

              return (
                <button
                  key={c.id}
                  onClick={() => handleSelectCustomer(c)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full text-[12px] shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#3040b6] text-white shadow-sm font-semibold'
                      : 'bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff]'
                  }`}
                  type="button"
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[#d2d9f4] text-[#11249f]'
                  }`}>
                    {initials}
                  </span>
                  <span>{c.name}</span>
                  {isSelected && (
                    <span className="material-symbols-outlined text-[14px]">check</span>
                  )}
                </button>
              );
            })}

            <button
              onClick={() => setIsAddCustomerOpen(true)}
              className="flex items-center gap-1 px-3 py-2 rounded-full bg-[#f2f3ff] text-[#3040b6] text-[12px] shrink-0 hover:bg-[#eaedff] font-medium transition-all cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Add New</span>
            </button>
          </div>

          <div className="flex items-center justify-between bg-[#f2f3ff] px-3 py-2 rounded-lg text-[#454653]">
            <div className="flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-[18px] text-[#006a61]">verified</span>
              <p className="text-[13px] truncate">
                {currentCustomer 
                  ? `${currentCustomer.phone} · ${currentCustomer.lockboxCode ? 'Lockbox ' + currentCustomer.lockboxCode : currentCustomer.keysHeldNote}` 
                  : '+44 7911 204918 · Key Holder'}
              </p>
            </div>
            <span className="text-[12px] text-[#006a61] font-semibold shrink-0">
              {currentCustomer?.cadenceLabel || 'Regular'} Client
            </span>
          </div>
        </div>

        {/* 2. Service Category */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-[14px] text-[#131b2e] font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#3040b6]">cleaning_services</span>
              Service Category
            </label>
            <span className="text-[12px] text-[#454653]">Standard Rate</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setSelectedService('regular');
                setAgreedPrice('75.00');
              }}
              className={`p-3 rounded-lg text-left flex flex-col justify-between h-20 transition-all border cursor-pointer ${
                selectedService === 'regular'
                  ? 'bg-[#e2e7ff] border-[#3040b6]'
                  : 'bg-[#f2f3ff] border-transparent hover:bg-[#eaedff]'
              }`}
              type="button"
            >
              <div className="flex items-start justify-between w-full">
                <span className="text-[14px] font-semibold text-[#131b2e]">Regular Clean</span>
                {selectedService === 'regular' && (
                  <span className="material-symbols-outlined text-[18px] text-[#3040b6]">check_circle</span>
                )}
              </div>
              <span className="text-[12px] font-medium text-[#3040b6]">£18–£22 / hr</span>
            </button>

            <button
              onClick={() => {
                setSelectedService('deep');
                setAgreedPrice('120.00');
              }}
              className={`p-3 rounded-lg text-left flex flex-col justify-between h-20 transition-all border cursor-pointer ${
                selectedService === 'deep'
                  ? 'bg-[#e2e7ff] border-[#3040b6]'
                  : 'bg-[#f2f3ff] border-transparent hover:bg-[#eaedff]'
              }`}
              type="button"
            >
              <div className="flex items-start justify-between w-full">
                <span className="text-[14px] font-semibold text-[#131b2e]">Deep Clean</span>
                {selectedService === 'deep' && (
                  <span className="material-symbols-outlined text-[18px] text-[#3040b6]">check_circle</span>
                )}
              </div>
              <span className="text-[12px] text-[#454653]">From £120+</span>
            </button>

            <button
              onClick={() => {
                setSelectedService('tenancy');
                setAgreedPrice('165.00');
              }}
              className={`p-3 rounded-lg text-left flex flex-col justify-between h-20 transition-all border cursor-pointer ${
                selectedService === 'tenancy'
                  ? 'bg-[#e2e7ff] border-[#3040b6]'
                  : 'bg-[#f2f3ff] border-transparent hover:bg-[#eaedff]'
              }`}
              type="button"
            >
              <div className="flex items-start justify-between w-full">
                <span className="text-[14px] font-semibold text-[#131b2e]">End of Tenancy</span>
                {selectedService === 'tenancy' && (
                  <span className="material-symbols-outlined text-[18px] text-[#3040b6]">check_circle</span>
                )}
              </div>
              <span className="text-[12px] text-[#454653]">Full Inventory</span>
            </button>

            <button
              onClick={() => {
                setSelectedService('oven');
                setAgreedPrice('45.00');
              }}
              className={`p-3 rounded-lg text-left flex flex-col justify-between h-20 transition-all border cursor-pointer ${
                selectedService === 'oven'
                  ? 'bg-[#e2e7ff] border-[#3040b6]'
                  : 'bg-[#f2f3ff] border-transparent hover:bg-[#eaedff]'
              }`}
              type="button"
            >
              <div className="flex items-start justify-between w-full">
                <span className="text-[14px] font-semibold text-[#131b2e]">Oven & Carpet</span>
                {selectedService === 'oven' && (
                  <span className="material-symbols-outlined text-[18px] text-[#3040b6]">check_circle</span>
                )}
              </div>
              <span className="text-[12px] text-[#454653]">Specialist Add-on</span>
            </button>
          </div>
        </div>

        {/* 3. Job Address */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-[14px] text-[#131b2e] font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#3040b6]">location_on</span>
              Job Address
            </label>
            <button
              onClick={() => setIsEditingAddress(!isEditingAddress)}
              className="text-[12px] font-medium text-[#3040b6] hover:underline flex items-center gap-0.5 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[14px]">edit</span>
              <span>{isEditingAddress ? 'Done' : 'Change'}</span>
            </button>
          </div>

          <div className="bg-[#f2f3ff] rounded-lg p-3 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#e2e7ff] flex items-center justify-center text-[#3040b6] shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[18px]">home</span>
            </div>
            <div className="min-w-0 flex-1">
              {!isEditingAddress ? (
                <>
                  <p className="text-[14px] text-[#131b2e] font-medium">{addressLine1}</p>
                  <p className="text-[13px] text-[#454653]">{addressLine2}</p>
                </>
              ) : (
                <div className="space-y-1.5">
                  <input
                    value={addressLine1}
                    onChange={e => setAddressLine1(e.target.value)}
                    className="w-full h-9 px-2 rounded bg-white text-[13px] text-[#131b2e] border border-[#eaedff] outline-none"
                  />
                  <input
                    value={addressLine2}
                    onChange={e => setAddressLine2(e.target.value)}
                    className="w-full h-9 px-2 rounded bg-white text-[13px] text-[#131b2e] border border-[#eaedff] outline-none"
                  />
                </div>
              )}
            </div>
            <button
              onClick={() => window.open(`https://maps.apple.com/?q=${encodeURIComponent(addressLine1 + ' ' + addressLine2)}`, '_blank')}
              aria-label="Open maps preview"
              className="w-8 h-8 rounded-full bg-[#dae2fd] flex items-center justify-center text-[#454653] hover:text-[#3040b6] shrink-0"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">map</span>
            </button>
          </div>
        </div>

        {/* 4. Schedule & Arrival Window */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff] flex flex-col gap-3">
          <label className="text-[14px] text-[#131b2e] font-semibold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-[#3040b6]">calendar_month</span>
            Schedule & Arrival Window
          </label>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#f2f3ff] rounded-lg p-3 flex flex-col justify-between h-20 relative hover:bg-[#eaedff] transition-colors">
              <span className="text-[12px] text-[#454653] flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-[14px]">today</span> Date
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-[17px] font-semibold text-[#131b2e]">Tomorrow</span>
                <span className="text-[12px] font-semibold text-[#3040b6]">25 Oct</span>
              </div>
              <input
                type="date"
                value={dateStr}
                onChange={e => setDateStr(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </div>

            <div className="bg-[#f2f3ff] rounded-lg p-3 flex flex-col justify-between h-20 hover:bg-[#eaedff] transition-colors">
              <span className="text-[12px] text-[#454653] flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-[14px]">schedule</span> Window
              </span>
              <div className="flex flex-col">
                <span className="text-[14px] font-semibold text-[#131b2e] leading-tight">{timeWindow}</span>
                <span className="text-[12px] text-[#006a61] font-medium">3 hrs slot</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Pricing & Deposit */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-[14px] text-[#131b2e] font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#3040b6]">payments</span>
              Pricing & Deposit
            </label>
            <span className="text-[12px] text-[#454653]">GBP (£)</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <span className="text-[12px] text-[#454653]">Agreed Total</span>
              <div className="h-12 rounded-xl bg-[#f2f3ff] px-3 flex items-center gap-1 border border-transparent focus-within:border-[#3040b6] focus-within:bg-white transition-all">
                <span className="text-[17px] font-semibold text-[#757685]">£</span>
                <input
                  type="number"
                  step="0.50"
                  value={agreedPrice}
                  onChange={e => setAgreedPrice(e.target.value)}
                  className="w-full bg-transparent text-[17px] font-semibold text-[#131b2e] outline-none tabular-nums"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[12px] text-[#454653]">Deposit Collected</span>
              <div className="h-12 rounded-xl bg-[#f2f3ff] px-3 flex items-center gap-1 border border-transparent focus-within:border-[#3040b6] focus-within:bg-white transition-all">
                <span className="text-[17px] font-semibold text-[#757685]">£</span>
                <input
                  type="number"
                  step="0.50"
                  value={depositPaid}
                  onChange={e => setDepositPaid(e.target.value)}
                  className="w-full bg-transparent text-[17px] font-semibold text-[#131b2e] outline-none tabular-nums"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#e2e7ff] rounded-xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#86f2e4] flex items-center justify-center text-[#006f66] shrink-0">
                <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
              </div>
              <div>
                <p className="text-[12px] text-[#454653] leading-none font-medium">Remaining Balance</p>
                <p className="text-[13px] text-[#006a61] font-medium mt-0.5">Due upon completion</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[24px] text-[#3040b6] font-semibold tracking-tight">
                £{balanceDue.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* 6. Key Lockbox & Checklist Accordion */}
        <div className="bg-white rounded-xl shadow-sm border border-[#eaedff] overflow-hidden transition-all">
          <button
            onClick={() => setIsAccordionOpen(!isAccordionOpen)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-[#f2f3ff]/50 transition-colors cursor-pointer"
            type="button"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#3040b6]">vpn_key</span>
              <div>
                <span className="text-[14px] text-[#131b2e] font-semibold block">Key Lockbox & Checklist</span>
                <span className="text-[12px] text-[#454653]">Code #4920 · 4 checklist items ready</span>
              </div>
            </div>
            <span className={`material-symbols-outlined text-[#757685] transition-transform duration-200 ${
              isAccordionOpen ? 'rotate-180' : ''
            }`}>
              expand_more
            </span>
          </button>

          {isAccordionOpen && (
            <div className="px-4 pb-4 flex flex-col gap-3 animate-in fade-in">
              <div className="bg-[#f2f3ff] p-3 rounded-lg flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-[#6f4500] mt-0.5">key</span>
                <div className="flex-1">
                  <p className="text-[12px] text-[#131b2e] font-semibold">Front Porch Lockbox</p>
                  <p className="text-[13px] text-[#454653]">
                    Code: <strong className="text-[#131b2e] font-mono">4920</strong> · Return key inside lockbox upon job completion.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[12px] text-[#454653] font-medium">Standard Scope Checklist</span>
                <div className="space-y-1.5">
                  {['Kitchen surfaces & hob descaling', 'Sanitise 2 bathrooms & mirrors', 'Vacuum & steam mop all hardwood floors', 'Empty waste bins & replace bin liners'].map((task, i) => (
                    <label key={i} className="flex items-center gap-2.5 p-2 rounded-lg bg-[#f2f3ff]">
                      <input defaultChecked type="checkbox" className="w-4 h-4 accent-[#3040b6] rounded" />
                      <span className="text-[13px] text-[#131b2e]">{task}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 7. Deposit Policy & Collection (From Screen 10 / Image 27) */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#3040b6] text-[18px]">verified_user</span>
              <h2 className="text-[12px] uppercase tracking-wider text-[#454653] font-semibold">
                Deposit Policy & Collection
              </h2>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#86f2e4] text-[#006f66] font-medium">
              Guaranteed
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1 p-1 bg-[#f2f3ff] rounded-xl text-center text-[12px]">
            <button
              onClick={() => setDepositPolicy('required')}
              className={`py-2 px-1 rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer ${
                depositPolicy === 'required' ? 'bg-white text-[#3040b6] shadow-sm font-semibold' : 'text-[#454653]'
              }`}
            >
              <span>Required</span>
              <span className="text-[10px] text-[#757685]">To secure spot</span>
            </button>
            <button
              onClick={() => setDepositPolicy('optional')}
              className={`py-2 px-1 rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer ${
                depositPolicy === 'optional' ? 'bg-white text-[#3040b6] shadow-sm font-semibold' : 'text-[#454653]'
              }`}
            >
              <span>Optional</span>
              <span className="text-[10px] text-[#757685]">Client choice</span>
            </button>
            <button
              onClick={() => setDepositPolicy('none')}
              className={`py-2 px-1 rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer ${
                depositPolicy === 'none' ? 'bg-white text-[#3040b6] shadow-sm font-semibold' : 'text-[#454653]'
              }`}
            >
              <span>No Deposit</span>
              <span className="text-[10px] text-[#757685]">Pay at end</span>
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#f2f3ff]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-[#3040b6] flex items-center justify-center text-white shrink-0">
                <span className="material-symbols-outlined text-[20px]">credit_card</span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-[13px] font-semibold text-[#131b2e]">Stripe Online Payment</p>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#89f5e7] text-[#00201d]">Connected</span>
                </div>
                <p className="text-[11px] text-[#454653]">Instant Apple Pay, Card, Google Pay</p>
              </div>
            </div>
            <span className="w-5 h-5 rounded-full bg-[#3040b6] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[14px]">check</span>
            </span>
          </div>
        </div>

        {/* 8. Active Booking Link Section (From Screen 10 / Image 27) */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff] flex flex-col gap-3">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#006a61] animate-pulse"></span>
              <h3 className="text-[14px] font-semibold text-[#131b2e]">Active Booking Link</h3>
            </div>
            <span className="inline-flex items-center gap-1 text-[12px] text-[#006a61] font-medium">
              <span className="material-symbols-outlined text-[16px]">hourglass_top</span>
              <span>47h 59m left</span>
            </span>
          </div>

          <div className="flex items-center gap-2 p-1.5 pl-3 rounded-xl bg-[#f2f3ff] border border-[#eaedff]">
            <span className="material-symbols-outlined text-[#757685] text-[18px] shrink-0">link</span>
            <input
              type="text"
              readOnly
              value={bookingLink}
              className="w-full bg-transparent text-[13px] text-[#131b2e] truncate outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="h-9 px-3 rounded-lg bg-white text-[#3040b6] text-[12px] font-medium flex items-center gap-1 shadow-sm hover:bg-[#f2f3ff] transition-all shrink-0 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between px-1 text-[12px] text-[#454653]">
            <span>Expires: 27 Oct, 10:00</span>
            <span className="font-medium text-[#131b2e]">Auto-locks afterwards</span>
          </div>

          {/* Quick Dispatch Links */}
          <div className="pt-1">
            <label className="block text-[12px] text-[#454653] font-medium mb-1.5">Instant Dispatch</label>
            <div className="grid grid-cols-3 gap-2">
              <a
                href={`https://wa.me/447911204918?text=${encodeURIComponent(`Hi Charlotte, here is your Sparkle & Shine booking link to review & confirm your appointment: ${bookingLink}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 rounded-xl bg-[#86f2e4] text-[#006f66] text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-transform active:scale-95 shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>WhatsApp</span>
              </a>
              <button
                onClick={() => {
                  showToast('SMS dispatched to +44 7911 204918');
                  window.open(`sms:+447911204918?&body=${encodeURIComponent(`Hi Charlotte, your booking link: ${bookingLink}`)}`);
                }}
                className="h-11 rounded-xl bg-[#f2f3ff] text-[#131b2e] text-[12px] font-medium flex items-center justify-center gap-1.5 hover:bg-[#eaedff] transition-transform active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">sms</span>
                <span>SMS</span>
              </button>
              <button
                onClick={() => {
                  showToast('Email preview opened');
                  window.open(`mailto:charlotte.davies@example.co.uk?subject=Booking%20Confirmation%20-%20Sparkle%20%26%20Shine&body=${encodeURIComponent(bookingLink)}`);
                }}
                className="h-11 rounded-xl bg-[#f2f3ff] text-[#131b2e] text-[12px] font-medium flex items-center justify-center gap-1.5 hover:bg-[#eaedff] transition-transform active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">mail</span>
                <span>Email</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => regenerateBookingLink()}
              className="inline-flex items-center gap-1 text-[12px] text-[#3040b6] hover:underline cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">sync</span>
              <span>Regenerate Link</span>
            </button>
            <button
              onClick={() => navigateTo('customer-checkout')}
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#006a61] hover:underline cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">visibility</span>
              <span>Preview Customer View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-16 left-0 right-0 p-3 bg-white/95 backdrop-blur-md shadow-lg z-30 border-t border-[#eaedff]">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button
            onClick={() => showToast('Booking saved as draft.')}
            className="h-12 w-12 rounded-xl bg-[#f2f3ff] flex items-center justify-center text-[#454653] hover:bg-[#eaedff] transition-colors shrink-0 cursor-pointer"
            title="Save Draft"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">bookmark_border</span>
          </button>
          <button
            onClick={handleConfirmBooking}
            disabled={isSubmitting}
            className="h-12 flex-1 rounded-xl bg-[#3040b6] text-white text-[14px] font-semibold flex items-center justify-center gap-2 shadow-md hover:bg-[#11249f] active:scale-[0.98] transition-all cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">task_alt</span>
            <span>{isSubmitting ? 'Booking Job...' : 'Confirm & Book Job'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
