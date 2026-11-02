import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const CustomerCheckoutScreen: React.FC = () => {
  const { navigateTo, setBookingStatus, showToast } = useApp();

  const [name, setName] = useState('Mrs. Charlotte Davies');
  const [phone, setPhone] = useState('+44 7911 204918');
  const [email, setEmail] = useState('charlotte.davies@example.co.uk');
  const [notes, setNotes] = useState('Lockbox on side porch. Indoor cat (Milo) inside kitchen.');
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirmOnline = () => {
    if (!agreedTerms) {
      showToast('Please agree to the service cancellation terms');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setBookingStatus('paid');
      showToast('Stripe payment verified: £20.00 deposit paid');
      navigateTo('booking-confirmed');
    }, 800);
  };

  const handleConfirmInPerson = () => {
    if (!agreedTerms) {
      showToast('Please agree to the service cancellation terms');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setBookingStatus('pending');
      showToast('Slot held! Deposit to be reconciled in person');
      navigateTo('booking-confirmed');
    }, 600);
  };

  return (
    <div className="flex flex-col w-full pb-28 pt-2 max-w-lg mx-auto">
      <div className="px-4 pt-2 flex flex-col gap-4">
        {/* Company Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#dfe0ff] flex items-center justify-center text-[#11249f] shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  cleaning_services
                </span>
              </div>
              <span className="text-[17px] font-semibold text-[#131b2e] truncate">
                Sparkle & Shine Cleaning Co.
              </span>
              <span className="material-symbols-outlined text-[#006a61] text-[18px] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
            </div>
            <span className="text-[12px] bg-[#86f2e4] text-[#006f66] px-2 py-0.5 rounded-full shrink-0 font-medium">
              Verified
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[#454653] text-[12px]">
            <a className="flex items-center gap-1 hover:text-[#11249f] transition-colors" href="tel:02089402211">
              <span className="material-symbols-outlined text-[14px]">call</span>
              <span>020 8940 2211</span>
            </a>
            <span className="w-1 h-1 rounded-full bg-[#c6c5d6]"></span>
            <a className="flex items-center gap-1 hover:text-[#11249f] transition-colors" href="mailto:info@sparkleshine.co.uk">
              <span className="material-symbols-outlined text-[14px]">mail</span>
              <span className="truncate">info@sparkleshine.co.uk</span>
            </a>
          </div>

          <div className="mt-1 flex flex-col gap-1">
            <h1 className="text-[24px] font-semibold text-[#131b2e] tracking-tight">
              Review and confirm your booking
            </h1>
            <div className="flex items-center gap-1.5 text-[#454653] text-[13px]">
              <span className="material-symbols-outlined text-[#006a61] text-[16px]">lock_reset</span>
              <span>No app download or account creation required.</span>
            </div>
          </div>
        </div>

        {/* Service Reserved Card */}
        <section className="flex flex-col gap-2">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff] flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col min-w-0">
                <span className="text-[12px] text-[#454653] uppercase tracking-wider font-medium">Service Reserved</span>
                <span className="text-[17px] font-semibold text-[#131b2e] mt-0.5 truncate">
                  Standard Domestic Clean (3 Bed)
                </span>
              </div>
              <span className="text-[12px] bg-[#dfe0ff] text-[#000b62] px-2.5 py-1 rounded-full shrink-0 font-medium">
                Slot Held
              </span>
            </div>

            <div className="h-px bg-[#eaedff] w-full"></div>

            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#eaedff] flex items-center justify-center text-[#3040b6] shrink-0">
                  <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[12px] text-[#454653]">Date & Arrival Window</span>
                  <span className="text-[14px] text-[#131b2e] font-semibold">Friday, 25 October 2024</span>
                  <span className="text-[13px] text-[#006a61] font-medium">09:30 – 12:00 (Cleaner arrival window)</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#eaedff] flex items-center justify-center text-[#3040b6] shrink-0">
                  <span className="material-symbols-outlined text-[18px]">location_on</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[12px] text-[#454653]">Property Address</span>
                  <span className="text-[14px] text-[#131b2e] font-semibold">42 Crescent Gardens</span>
                  <span className="text-[13px] text-[#454653]">Richmond, London TW9 1DY</span>
                </div>
              </div>
            </div>

            <div className="bg-[#f2f3ff] rounded-lg p-3 flex flex-col gap-2 mt-1 border border-[#eaedff]">
              <div className="flex justify-between items-center text-[#454653] text-[13px]">
                <span>Agreed Total</span>
                <span className="text-[14px] font-semibold text-[#131b2e]">£65.00</span>
              </div>
              <div className="flex justify-between items-center text-[#131b2e]">
                <span className="text-[12px] font-semibold text-[#11249f]">Deposit Required Today</span>
                <span className="text-[18px] font-bold text-[#11249f]">£20.00</span>
              </div>
              <div className="h-px bg-[#eaedff] w-full"></div>
              <div className="flex justify-between items-center text-[#454653] text-[12px]">
                <span>Remaining Balance</span>
                <span className="text-[#131b2e] font-medium">
                  £45.00 <span className="text-[#454653] font-normal">(Due upon clean completion)</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Contact & Access Details */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-[17px] font-semibold text-[#131b2e]">Contact & Access Details</h2>
            <span className="text-[12px] bg-[#89f5e7] text-[#005049] px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-[12px]">done</span> Pre-populated
            </span>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff] flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-[#454653] flex items-center justify-between" htmlFor="c-name">
                <span>Client Full Name</span>
                <span className="text-[#757685] text-[11px]">Tap to adjust</span>
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-[#757685] text-[20px]">person</span>
                <input
                  id="c-name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full h-11 bg-[#f2f3ff] text-[#131b2e] pl-10 pr-3 rounded-xl text-[14px] outline-none border border-transparent focus:border-[#3040b6]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-[#454653]" htmlFor="c-phone">
                Mobile Number (For on-the-day updates)
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-[#757685] text-[20px]">phone</span>
                <input
                  id="c-phone"
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full h-11 bg-[#f2f3ff] text-[#131b2e] pl-10 pr-3 rounded-xl text-[14px] outline-none border border-transparent focus:border-[#3040b6]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-[#454653]" htmlFor="c-email">
                Booking Confirmation Email
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-[#757685] text-[20px]">alternate_email</span>
                <input
                  id="c-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full h-11 bg-[#f2f3ff] text-[#131b2e] pl-10 pr-3 rounded-xl text-[14px] outline-none border border-transparent focus:border-[#3040b6]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-[#454653]" htmlFor="c-notes">
                Access & Household Notes
              </label>
              <textarea
                id="c-notes"
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full p-2.5 bg-[#f2f3ff] text-[#131b2e] rounded-xl text-[13px] outline-none border border-transparent focus:border-[#3040b6] resize-none"
              />
              <span className="text-[11px] text-[#454653] flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[13px] text-[#006a61]">info</span>
                Cleaner receives these notes with arrival instructions.
              </span>
            </div>
          </div>
        </section>

        {/* Service Terms & Guarantees */}
        <section className="flex flex-col gap-2">
          <div className="bg-[#e2e7ff] rounded-xl p-3 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[#131b2e]">
              <span className="material-symbols-outlined text-[#11249f] text-[18px]">verified_user</span>
              <span className="text-[14px] font-semibold">Service Terms & Guarantees</span>
            </div>

            <div className="bg-white rounded-lg p-3 text-[#454653] text-[13px] flex flex-col gap-1.5 shadow-xs border border-[#eaedff]">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[#006a61] text-[16px] shrink-0 mt-0.5">check_circle</span>
                <span>Cancellations up to 24 hours prior to service receive a full 100% refund.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[#006a61] text-[16px] shrink-0 mt-0.5">check_circle</span>
                <span>All professional equipment & eco-friendly supplies provided by Sparkle & Shine.</span>
              </div>
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer select-none pt-1">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={e => setAgreedTerms(e.target.checked)}
                className="w-5 h-5 mt-0.5 accent-[#3040b6] rounded cursor-pointer shrink-0"
              />
              <span className="text-[13px] text-[#131b2e] leading-tight">
                I confirm the booking details, address, and agree to the 24-hour cancellation policy.
              </span>
            </label>
          </div>
        </section>

        {/* Payment Choices */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[17px] font-semibold text-[#131b2e]">Select Deposit Payment Choice</h2>
            <span className="text-[12px] text-[#454653] flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-[#006a61]">lock</span>
              256-bit Secure
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {/* Option 1: Online */}
            <div className="bg-white rounded-xl p-4 shadow-md border-2 border-[#3040b6] flex flex-col gap-3 relative overflow-hidden">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#3040b6] text-white flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">credit_card</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-[17px] font-semibold text-[#131b2e]">Pay £20.00 Deposit Online</span>
                      <span className="bg-[#89f5e7] text-[#00201d] text-[11px] px-2 py-0.5 rounded-full font-semibold">
                        Recommended
                      </span>
                    </div>
                    <span className="text-[13px] text-[#454653]">Instant confirmation & slot secured immediately</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-[#f2f3ff] px-3 py-2 rounded-lg text-[#454653] text-[12px]">
                <div className="flex items-center gap-1 text-[#131b2e] font-medium">
                  <span className="material-symbols-outlined text-[16px] text-[#11249f]">bolt</span>
                  <span>Apple Pay</span>
                </div>
                <span className="w-1 h-1 rounded-full bg-[#c6c5d6]"></span>
                <div className="flex items-center gap-1 text-[#131b2e] font-medium">
                  <span className="material-symbols-outlined text-[16px] text-[#11249f]">credit_card</span>
                  <span>Debit / Credit Card</span>
                </div>
                <span className="w-1 h-1 rounded-full bg-[#c6c5d6]"></span>
                <span>Stripe Verified</span>
              </div>

              <button
                disabled={isProcessing}
                onClick={handleConfirmOnline}
                className="w-full h-12 bg-[#3040b6] hover:bg-[#11249f] text-white rounded-xl text-[14px] font-medium flex items-center justify-center gap-2 shadow-sm active:opacity-90 transition-opacity cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>{isProcessing ? 'Processing...' : 'Confirm Booking & Pay £20 Deposit'}</span>
              </button>
            </div>

            {/* Option 2: In-Person */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff] flex flex-col gap-3">
              <div className="flex items-start gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#eaedff] text-[#454653] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">payments</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[17px] font-semibold text-[#131b2e]">Pay In-Person / Direct Transfer</span>
                  <span className="text-[13px] text-[#454653] mt-0.5">
                    Slot held provisionally. Cleaner collects deposit receipt or bank transfer details upon arrival.
                  </span>
                </div>
              </div>

              <div className="bg-[#f2f3ff] px-3 py-2 rounded-lg flex items-center gap-2 text-[#454653] text-[12px] border border-[#eaedff]">
                <span className="material-symbols-outlined text-[#6f4500] text-[16px]">schedule</span>
                <span>Deposit marked as pending until verified by technician.</span>
              </div>

              <button
                disabled={isProcessing}
                onClick={handleConfirmInPerson}
                className="w-full h-12 bg-[#e2e7ff] hover:bg-[#dae2fd] text-[#131b2e] rounded-xl text-[14px] font-medium flex items-center justify-center gap-2 active:bg-[#dae2fd] transition-colors cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">handshake</span>
                <span>Confirm Booking — Pay In-Person</span>
              </button>
            </div>
          </div>
        </section>

        <footer className="pt-2 pb-6 flex flex-col items-center justify-center text-center gap-1 text-[#454653]">
          <div className="flex items-center gap-1.5 text-[12px]">
            <span className="material-symbols-outlined text-[15px] text-[#006a61]">lock</span>
            <span>Secured with 256-bit encryption</span>
          </div>
          <p className="text-[13px]">
            Powered by <strong className="text-[#131b2e] font-semibold">Tapili</strong> Booking Platform
          </p>
        </footer>
      </div>
    </div>
  );
};
