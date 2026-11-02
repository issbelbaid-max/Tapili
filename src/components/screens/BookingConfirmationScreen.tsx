import React from 'react';
import { useApp } from '../../context/AppContext';

export const BookingConfirmationScreen: React.FC = () => {
  const { bookingStatus, setBookingStatus, navigateTo, showToast } = useApp();

  return (
    <div className="flex flex-col w-full pb-28 pt-2 max-w-lg mx-auto">
      {/* Interactive State Switcher for Prototype Exploration */}
      <section className="px-4 pt-2 pb-2">
        <div className="bg-[#e2e7ff] p-1 rounded-xl flex items-center gap-1 shadow-sm overflow-x-auto no-scrollbar">
          <button
            onClick={() => setBookingStatus('paid')}
            className={`flex-1 min-w-[110px] py-2 px-2.5 rounded-lg text-[12px] text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              bookingStatus === 'paid'
                ? 'bg-white text-[#3040b6] font-semibold shadow-sm'
                : 'text-[#454653] hover:text-[#131b2e]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#006a61]"></span>
            <span className="truncate">Deposit Paid</span>
          </button>
          <button
            onClick={() => setBookingStatus('pending')}
            className={`flex-1 min-w-[110px] py-2 px-2.5 rounded-lg text-[12px] text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              bookingStatus === 'pending'
                ? 'bg-white text-[#3040b6] font-semibold shadow-sm'
                : 'text-[#454653] hover:text-[#131b2e]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#ffb95f]"></span>
            <span className="truncate">Deposit Pending</span>
          </button>
          <button
            onClick={() => setBookingStatus('expired')}
            className={`flex-1 min-w-[110px] py-2 px-2.5 rounded-lg text-[12px] text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              bookingStatus === 'expired'
                ? 'bg-white text-[#3040b6] font-semibold shadow-sm'
                : 'text-[#454653] hover:text-[#131b2e]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#ba1a1a]"></span>
            <span className="truncate">Link Expired</span>
          </button>
        </div>
      </section>

      {/* STATE 1: DEPOSIT PAID (CONFIRMED) */}
      {bookingStatus === 'paid' && (
        <div className="flex flex-col w-full animate-in fade-in duration-200">
          {/* Hero Celebration */}
          <section className="px-4 pt-3 pb-4 flex flex-col items-center text-center">
            <div className="relative flex items-center justify-center mb-3">
              <div className="absolute w-20 h-20 rounded-full bg-[#86f2e4]/40 animate-ping opacity-60"></div>
              <div className="w-16 h-16 rounded-full bg-[#86f2e4] flex items-center justify-center shadow-sm relative z-10 text-[#006f66]">
                <span className="material-symbols-outlined text-[34px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 bg-[#f2f3ff] px-3 py-1 rounded-full mb-2 shadow-xs border border-[#eaedff]">
              <span className="material-symbols-outlined text-[15px] text-[#006a61]">verified</span>
              <span className="text-[12px] text-[#454653] font-mono tracking-wider">#BKN-2024-8841</span>
            </div>

            <h1 className="text-[24px] font-semibold text-[#131b2e] tracking-tight mb-1">
              Booking Confirmed!
            </h1>
            <p className="text-[14px] text-[#454653] max-w-[320px]">
              Thank you, Charlotte! Your <span className="font-semibold text-[#131b2e]">£20.00</span> deposit has been received securely via Stripe.
            </p>
          </section>

          {/* Dispatch banner */}
          <div className="px-4 mb-3">
            <div className="bg-[#f2f3ff] rounded-xl p-3 flex items-start gap-2.5 shadow-xs border border-[#eaedff]">
              <span className="material-symbols-outlined text-[#3040b6] text-[20px] mt-0.5 shrink-0">
                mark_email_read
              </span>
              <p className="text-[13px] text-[#454653]">
                A receipt & appointment summary was sent to <span className="font-medium text-[#131b2e]">charlotte.davies@example.co.uk</span> and your WhatsApp.
              </p>
            </div>
          </div>

          {/* Appointment Details Card */}
          <section className="px-4 mb-3">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#eaedff] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#3040b6] flex items-center justify-center text-white shadow-xs">
                    <span className="material-symbols-outlined text-[22px]">cleaning_services</span>
                  </div>
                  <div>
                    <p className="text-[17px] font-semibold text-[#131b2e] leading-tight">Sparkle & Shine Co.</p>
                    <p className="text-[13px] text-[#454653]">Deep Domestic Refresh</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 bg-[#86f2e4] text-[#006f66] px-2.5 py-1 rounded-full text-[12px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006a61]"></span>
                  Confirmed
                </span>
              </div>

              <div className="h-px w-full bg-[#eaedff]"></div>

              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#f2f3ff] flex items-center justify-center text-[#3040b6] shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] text-[#454653]">Date & Arrival Window</p>
                    <p className="text-[14px] text-[#131b2e] font-semibold">Friday, 25 October 2024</p>
                    <p className="text-[13px] text-[#454653]">09:30 – 12:00 BST (2h 30m slot)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#f2f3ff] flex items-center justify-center text-[#3040b6] shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[18px]">pin_drop</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] text-[#454653]">Service Address</p>
                    <p className="text-[14px] text-[#131b2e] font-semibold">42 Crescent Gardens</p>
                    <p className="text-[13px] text-[#454653] truncate">Richmond, Surrey, TW9 1DY</p>
                  </div>
                </div>
              </div>

              {/* Assigned Cleaner Micro-strip */}
              <div className="bg-[#f2f3ff] rounded-xl p-3 flex items-center justify-between border border-[#eaedff]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-[#dae2fd] overflow-hidden shrink-0">
                    <img
                      className="w-full h-full object-cover"
                      alt="Elena V."
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsb3ft_SlVTeTMb-JHkNXAP6rD0_IkaBWAldR2TDROPUQG3Hvp9G3FvxehHTCZc-MvIxm1fu-giLV8JItzWGU2unFUwcbOkI5bNkepkHx6gfsYbFjmTPQ0got1BFgKnuJc4OpyS8qDbHRSw8ZzGyXoVS6PNfBO2LE-ZmjRlcxy08BV_xnF4PncH1jdAmZGhdjfNNMMlL0fRxVgaIXzRYts564rYTcBSVtBDaFKESY"
                    />
                  </div>
                  <div className="min-w-0 truncate">
                    <p className="text-[13px] font-semibold text-[#131b2e] truncate">Elena V. (Lead Professional)</p>
                    <p className="text-[12px] text-[#454653]">5.0 ★ (142 reviews) • Fully Insured</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    showToast('Opening cleaner chat...');
                    window.open('https://wa.me/447700900077', '_blank');
                  }}
                  aria-label="Message cleaner"
                  className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#3040b6] shadow-xs hover:bg-[#eaedff] transition-colors shrink-0"
                >
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                </button>
              </div>
            </div>
          </section>

          {/* Payment Breakdown Receipt */}
          <section className="px-4 mb-3">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#eaedff] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="text-[17px] font-semibold text-[#131b2e]">Payment Summary</h2>
                <span className="text-[12px] font-mono bg-[#eaedff] px-2 py-0.5 rounded text-[#454653]">
                  Stripe Pay
                </span>
              </div>
              <div className="flex flex-col gap-2.5 text-[14px]">
                <div className="flex justify-between items-center text-[#454653]">
                  <span>Total Service Estimate</span>
                  <span className="font-semibold text-[#131b2e]">£65.00</span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-semibold text-[#006a61] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      Deposit Paid (Online)
                    </span>
                    <p className="text-[12px] text-[#454653] font-mono mt-0.5">#ch_3Pq9z18e001a • 10:14 BST</p>
                  </div>
                  <span className="font-semibold text-[#006a61]">-£20.00</span>
                </div>
                <div className="h-px w-full bg-[#eaedff] my-0.5"></div>
                <div className="flex justify-between items-baseline">
                  <div>
                    <p className="text-[17px] font-semibold text-[#131b2e]">Remaining Balance Due</p>
                    <p className="text-[13px] text-[#454653]">Payable by card or cash upon job finish</p>
                  </div>
                  <p className="text-[20px] font-bold text-[#3040b6]">£45.00</p>
                </div>
              </div>
            </div>
          </section>

          {/* Interactive Actions Stack */}
          <section className="px-4 pb-6 flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => showToast('Calendar invite added to Apple / Google Calendar')}
                className="h-12 px-3 rounded-xl bg-white text-[#131b2e] shadow-xs border border-[#eaedff] text-[13px] font-medium flex items-center justify-center gap-2 hover:bg-[#f2f3ff] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px] text-[#3040b6]">edit_calendar</span>
                <span>Apple / Google</span>
              </button>
              <button
                onClick={() => showToast('PDF booking receipt downloaded')}
                className="h-12 px-3 rounded-xl bg-white text-[#131b2e] shadow-xs border border-[#eaedff] text-[13px] font-medium flex items-center justify-center gap-2 hover:bg-[#f2f3ff] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px] text-[#3040b6]">download</span>
                <span>Receipt (PDF)</span>
              </button>
            </div>
            <a
              className="h-12 px-4 rounded-xl bg-[#006a61] text-white shadow-sm text-[14px] font-medium flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
              href="https://wa.me/447700900077"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="material-symbols-outlined text-[20px]">chat</span>
              <span>Message Business on WhatsApp</span>
            </a>
          </section>
        </div>
      )}

      {/* STATE 2: IN-PERSON DEPOSIT (PENDING) */}
      {bookingStatus === 'pending' && (
        <div className="flex flex-col w-full animate-in fade-in duration-200">
          <section className="px-4 pt-2 pb-3">
            <div className="bg-[#ffddb8]/30 border border-[#ffddb8] rounded-2xl p-4 shadow-sm flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-[#ffb95f]/30 flex items-center justify-center mb-2 text-[#6f4500]">
                <span className="material-symbols-outlined text-[32px]">hourglass_top</span>
              </div>
              <span className="bg-[#6f4500] text-white px-3 py-1 rounded-full text-[12px] font-semibold mb-1">
                Booking Held — Deposit Pending (£20.00)
              </span>
              <h2 className="text-[20px] font-semibold text-[#131b2e] mb-1">Action Required</h2>
              <p className="text-[13px] text-[#454653] max-w-[320px]">
                Your clean is reserved for <strong className="text-[#131b2e]">Friday 25 Oct</strong>. The business will collect your <strong className="text-[#131b2e]">£20.00</strong> deposit in person or via direct bank transfer before dispatch.
              </p>
            </div>
          </section>

          <section className="px-4 mb-3">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#eaedff] flex flex-col gap-3">
              <h3 className="text-[17px] font-semibold text-[#131b2e] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#3040b6]">account_balance</span>
                Direct Transfer Details
              </h3>
              <div className="bg-[#f2f3ff] rounded-xl p-3 flex flex-col gap-2 border border-[#eaedff] text-[13px]">
                <div className="flex justify-between items-center">
                  <span className="text-[#454653]">Bank Name</span>
                  <span className="font-medium text-[#131b2e]">Starling Bank UK</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#454653]">Account Name</span>
                  <span className="font-medium text-[#131b2e]">Sparkle & Shine Services</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#454653]">Sort Code</span>
                  <span className="font-mono font-semibold text-[#131b2e]">60-83-71</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#454653]">Account No.</span>
                  <span className="font-mono font-semibold text-[#131b2e]">49204811</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#454653]">Payment Reference</span>
                  <span className="font-mono font-bold text-[#3040b6]">TW9-8841</span>
                </div>
              </div>
              <p className="text-[12px] text-[#454653]">
                Please allow up to 2 hours for our automated ledger to match your transfer reference. Once matched, your status updates instantly.
              </p>
            </div>
          </section>

          <section className="px-4 mb-3">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#eaedff] flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[14px] font-semibold text-[#131b2e]">Hold Expiry Countdown</span>
                <span className="text-[12px] text-[#ba1a1a] font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">schedule</span> 23h 48m left
                </span>
              </div>
              <p className="text-[12px] text-[#454653]">
                Unconfirmed holds are automatically released to the standby waitlist if deposit is not confirmed within 24 hours of booking.
              </p>
            </div>
          </section>

          <section className="px-4 pb-6 flex flex-col gap-2">
            <button
              onClick={() => {
                setBookingStatus('paid');
                showToast('Switched to online card settlement');
              }}
              className="h-12 px-4 rounded-xl bg-[#3040b6] text-white shadow-sm text-[14px] font-medium flex items-center justify-center gap-2 hover:bg-[#11249f] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">credit_card</span>
              <span>Pay £20.00 Online Now Instead</span>
            </button>
            <a
              className="h-12 px-4 rounded-xl bg-white border border-[#eaedff] text-[#131b2e] shadow-xs text-[14px] font-medium flex items-center justify-center gap-2 hover:bg-[#f2f3ff] transition-colors"
              href="https://wa.me/447700900077"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="material-symbols-outlined text-[20px] text-[#006a61]">chat</span>
              <span>Confirm In-Person Cash via WhatsApp</span>
            </a>
          </section>
        </div>
      )}

      {/* STATE 3: LINK EXPIRED */}
      {bookingStatus === 'expired' && (
        <div className="flex flex-col w-full animate-in fade-in duration-200">
          <section className="px-4 pt-4 pb-4 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#ffdad6] flex items-center justify-center mb-3 text-[#ba1a1a]">
              <span className="material-symbols-outlined text-[36px]">link_off</span>
            </div>
            <h2 className="text-[24px] font-semibold text-[#131b2e] tracking-tight mb-1">
              Booking Link Expired
            </h2>
            <p className="text-[14px] text-[#454653] max-w-[320px] mb-4">
              This single-use checkout link for <strong className="text-[#131b2e]">Sparkle & Shine Co.</strong> has expired or has already been fulfilled.
            </p>

            <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-[#eaedff] text-left flex flex-col gap-1.5 mb-4">
              <p className="text-[15px] font-semibold text-[#131b2e]">Need a fresh booking link?</p>
              <p className="text-[13px] text-[#454653]">
                Contact Charlotte's cleaner directly to request a refreshed confirmation or reschedule your slot.
              </p>
            </div>

            <div className="w-full flex flex-col gap-2">
              <button
                onClick={() => {
                  setBookingStatus('paid');
                  showToast('Generated refreshed booking link');
                }}
                className="h-12 w-full rounded-xl bg-[#3040b6] text-white shadow-sm text-[14px] font-medium flex items-center justify-center gap-2 hover:bg-[#11249f] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">refresh</span>
                <span>Request New Payment Link</span>
              </button>
              <a
                className="h-12 w-full rounded-xl bg-white border border-[#eaedff] text-[#131b2e] shadow-xs text-[14px] font-medium flex items-center justify-center gap-2 hover:bg-[#f2f3ff] transition-colors"
                href="tel:+447700900077"
              >
                <span className="material-symbols-outlined text-[20px] text-[#3040b6]">call</span>
                <span>Call Dispatch (+44 7700 900077)</span>
              </a>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
