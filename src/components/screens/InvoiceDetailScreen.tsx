import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const InvoiceDetailScreen: React.FC = () => {
  const { invoice, navigateTo, recordPayment, showToast } = useApp();

  const [isQuickLogOpen, setIsQuickLogOpen] = useState(true);
  const [offlineAmount, setOfflineAmount] = useState('55.00');
  const [paymentMethod, setPaymentMethod] = useState('Direct Bank Transfer');

  const handleRecordOfflinePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(offlineAmount) || 0;
    if (amt <= 0) return;
    recordPayment(amt, paymentMethod);
  };

  const handleSendWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Charlotte, here is your invoice ${invoice.invoiceNumber} for the domestic clean on 24 Oct (£${invoice.remainingDue.toFixed(2)} balance due). Tap to pay securely: https://tapili.uk/pay/inv-1082`
    );
    showToast('Opening WhatsApp with pre-filled invoice link...');
    window.open(`https://wa.me/447911204918?text=${text}`, '_blank');
  };

  return (
    <div className="flex flex-col w-full pb-36 max-w-lg mx-auto">
      {/* Page Navigation Context Strip */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <button
          onClick={() => navigateTo('money')}
          className="inline-flex items-center gap-1 text-[#3040b6] text-[14px] font-semibold active:opacity-70 transition-opacity cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          <span>Invoices</span>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => showToast('Preparing PDF download for #INV-1082...')}
            aria-label="Share PDF"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#eaedff] text-[#454653] active:bg-[#dae2fd] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">ios_share</span>
          </button>
          <button
            onClick={() => showToast('Invoice sent to thermal / air printer')}
            aria-label="Print Invoice"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#eaedff] text-[#454653] active:bg-[#dae2fd] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">print</span>
          </button>
        </div>
      </div>

      <div className="px-4 flex flex-col gap-3">
        {/* Invoice Header Meta Banner */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[17px] font-semibold text-[#131b2e]">{invoice.invoiceNumber}</span>
              <span className="px-2.5 py-0.5 rounded-full text-[12px] bg-[#ffddb8] text-[#653e00] flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#503000]"></span>
                {invoice.status}
              </span>
            </div>
            <span className="text-[12px] text-[#454653]">Issued {invoice.issuedDate}</span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div>
              <span className="text-[13px] text-[#454653] block">Remaining Due</span>
              <span className="text-[32px] font-semibold text-[#3040b6] tracking-tight">
                £{invoice.remainingDue.toFixed(2)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[13px] text-[#454653] block">Total Fee</span>
              <span className="text-[20px] font-semibold text-[#131b2e]">
                £{invoice.subtotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#eaedff] h-2 rounded-full overflow-hidden mt-1">
            <div
              className="bg-[#006a61] h-full rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, Math.round(((invoice.subtotal - invoice.remainingDue) / invoice.subtotal) * 100))}%`
              }}
            />
          </div>

          <div className="flex items-center justify-between text-[#454653] text-[12px] pt-0.5">
            <span className="flex items-center gap-1 text-[#006a61] font-medium">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              £{(invoice.subtotal - invoice.remainingDue).toFixed(2)} Settled
            </span>
            <span className="text-[#653e00]">
              {invoice.remainingDue > 0
                ? `£${invoice.remainingDue.toFixed(2)} outstanding today`
                : 'Fully paid in full'}
            </span>
          </div>
        </div>

        {/* Client & Job Dossier Card */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff] flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#dfe0ff] flex items-center justify-center text-[#11249f] text-[15px] font-bold">
                CD
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-[17px] font-semibold text-[#131b2e] truncate">{invoice.customerName}</span>
                  <span className="material-symbols-outlined text-[#006a61] text-[18px]">verified</span>
                </div>
                <span className="text-[13px] text-[#454653] block truncate">Domestic Client • Richmond</span>
              </div>
            </div>
          </div>

          <div className="bg-[#f2f3ff] rounded-lg p-3 flex flex-col gap-1 border border-[#eaedff]">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#454653] mt-0.5">location_on</span>
              <div className="min-w-0">
                <span className="text-[14px] text-[#131b2e] block">42 Crescent Gardens</span>
                <span className="text-[13px] text-[#454653] block">Richmond, TW9 1DY</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-1 pt-1 bg-white/70 rounded p-1.5 border border-[#eaedff]/60">
              <span className="material-symbols-outlined text-[18px] text-[#3040b6]">cleaning_services</span>
              <span className="text-[13px] font-semibold text-[#131b2e] truncate">Standard Domestic Clean (3 Bed)</span>
              <span className="text-[12px] text-[#454653] ml-auto">24 Oct</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <a
              className="h-11 rounded-lg bg-[#f2f3ff] flex items-center justify-center gap-1 text-[#131b2e] text-[12px] font-medium active:bg-[#eaedff] transition-colors"
              href="tel:+447911204918"
            >
              <span className="material-symbols-outlined text-[18px] text-[#3040b6]">call</span>
              <span>Call</span>
            </a>
            <a
              className="h-11 rounded-lg bg-[#f2f3ff] flex items-center justify-center gap-1 text-[#131b2e] text-[12px] font-medium active:bg-[#eaedff] transition-colors"
              href="https://wa.me/447911204918"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="material-symbols-outlined text-[18px] text-[#006a61]">chat</span>
              <span>WhatsApp</span>
            </a>
            <button
              onClick={() => window.open('https://maps.apple.com/?q=42+Crescent+Gardens+Richmond', '_blank')}
              className="h-11 rounded-lg bg-[#f2f3ff] flex items-center justify-center gap-1 text-[#131b2e] text-[12px] font-medium active:bg-[#eaedff] transition-colors"
            >
              <span className="material-symbols-outlined text-[18px] text-[#11249f]">directions</span>
              <span>Map</span>
            </button>
          </div>
        </div>

        {/* Itemized Breakdown Card */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[17px] font-semibold text-[#131b2e]">Itemized Breakdown</span>
            <span className="text-[12px] text-[#454653]">GBP (£)</span>
          </div>

          <div className="flex flex-col gap-2">
            {invoice.items.map(item => (
              <div key={item.id} className="flex items-start justify-between py-1">
                <div className="min-w-0 pr-2">
                  <span className="text-[14px] text-[#131b2e] font-medium block">{item.description}</span>
                  <span className="text-[13px] text-[#454653]">{item.detail}</span>
                </div>
                <span className="text-[16px] font-semibold text-[#131b2e] tabular-nums">
                  £{item.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Subtotal, Deposit, Net Calculation Ledger */}
          <div className="bg-[#f2f3ff] rounded-lg p-3 flex flex-col gap-2 border border-[#eaedff]">
            <div className="flex items-center justify-between text-[#454653] text-[14px]">
              <span>Subtotal</span>
              <span className="tabular-nums text-[#131b2e] font-medium">£{invoice.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-[#006a61] text-[14px]">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">credit_card</span>
                <span>Deposit Collected (20 Oct)</span>
              </div>
              <span className="tabular-nums font-semibold">-£{invoice.depositCollected.toFixed(2)}</span>
            </div>
            <div className="pt-2 mt-1 border-t border-[#eaedff] flex items-center justify-between bg-white rounded p-2.5">
              <div>
                <span className="text-[15px] font-semibold text-[#131b2e] block">Remaining Balance Due</span>
                <span className="text-[11px] text-[#ba1a1a] block font-medium">Payment due today</span>
              </div>
              <span className="text-[20px] font-bold text-[#3040b6] tabular-nums">
                £{invoice.remainingDue.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Direct Bank Payout Ledger Card */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff] flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#86f2e4] text-[#006f66] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">account_balance</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[17px] font-semibold text-[#131b2e]">Direct Bank Payout</span>
                <span className="px-2 py-0.5 rounded-full text-[12px] bg-[#86f2e4] text-[#006f66] font-medium">
                  Zero Hold
                </span>
              </div>
              <p className="text-[13px] text-[#454653] mt-1 leading-snug">
                Tapili does not hold customer funds. All digital client settlements land directly in your registered business account.
              </p>
            </div>
          </div>

          <div className="bg-[#e2e7ff]/60 rounded-lg p-3 flex flex-col gap-1.5 border border-[#dae2fd]">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-[#454653]">Beneficiary</span>
              <span className="text-[14px] text-[#131b2e] font-semibold">Sparkle & Shine Ltd</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-[#454653]">Sort Code</span>
              <span className="text-[14px] text-[#131b2e] font-mono font-semibold">20-04-15</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-[#454653]">Account Number</span>
              <span className="text-[14px] text-[#131b2e] font-mono font-semibold">83920194</span>
            </div>
          </div>

          {/* Payment History Timeline */}
          <div className="flex flex-col gap-2 pt-1">
            <span className="text-[14px] font-semibold text-[#131b2e]">Payment History</span>
            {invoice.paymentHistory.map((ph, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-[#f2f3ff] border border-[#eaedff]">
                <div className="flex items-center gap-2.5">
                  <span className={`material-symbols-outlined text-[20px] ${
                    ph.status === 'Received' ? 'text-[#006a61]' : 'text-[#6f4500]'
                  }`}>
                    {ph.status === 'Received' ? 'check_circle' : 'schedule'}
                  </span>
                  <div>
                    <span className="text-[14px] font-semibold text-[#131b2e] block">{ph.title}</span>
                    <span className="text-[12px] text-[#454653]">{ph.dateDetail}</span>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[12px] font-medium ${
                  ph.status === 'Received' ? 'bg-[#86f2e4] text-[#006f66]' : 'bg-[#ffddb8] text-[#653e00]'
                }`}>
                  {ph.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Record Offline Settlement Drawer */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[17px] font-semibold text-[#131b2e]">Record Offline Settlement</span>
            <button
              onClick={() => setIsQuickLogOpen(!isQuickLogOpen)}
              className="w-8 h-8 rounded-full bg-[#eaedff] flex items-center justify-center text-[#454653] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">
                {isQuickLogOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>
          </div>

          {isQuickLogOpen && (
            <form onSubmit={handleRecordOfflinePayment} className="flex flex-col gap-3 animate-in fade-in">
              <div className="grid grid-cols-2 gap-2">
                <label className="flex flex-col gap-1">
                  <span className="text-[12px] text-[#454653] font-medium">Amount Received</span>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-[14px] text-[#757685]">£</span>
                    <input
                      type="number"
                      step="0.01"
                      value={offlineAmount}
                      onChange={e => setOfflineAmount(e.target.value)}
                      className="w-full h-11 pl-7 pr-2 rounded-lg bg-[#f2f3ff] text-[#131b2e] text-[14px] font-semibold outline-none border border-transparent focus:border-[#3040b6]"
                    />
                  </div>
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-[12px] text-[#454653] font-medium">Payment Method</span>
                  <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value)}
                    className="w-full h-11 px-2.5 rounded-lg bg-[#f2f3ff] text-[#131b2e] text-[13px] outline-none border border-transparent focus:border-[#3040b6]"
                  >
                    <option value="Direct Bank Transfer">Direct Bank Transfer</option>
                    <option value="Cash">Cash in Hand</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </label>
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-lg bg-[#e2e7ff] text-[#131b2e] text-[14px] font-semibold flex items-center justify-center gap-2 active:bg-[#dae2fd] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">payments</span>
                <span>Confirm & Mark as Paid</span>
              </button>
            </form>
          )}
        </div>

        {/* Primary Action Stack */}
        <div className="flex flex-col gap-2 pt-1">
          <button
            onClick={handleSendWhatsApp}
            className="w-full h-12 rounded-xl bg-[#3040b6] text-white text-[14px] font-medium flex items-center justify-center gap-2 shadow-md active:bg-[#11249f] transition-all cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
            <span>Send Invoice via WhatsApp</span>
          </button>

          <button
            onClick={() => {
              setIsQuickLogOpen(true);
              showToast('Opened offline payment recorder');
            }}
            className="w-full h-12 rounded-xl bg-white border border-[#eaedff] text-[#131b2e] text-[14px] font-medium flex items-center justify-center gap-2 shadow-sm active:bg-[#f2f3ff] transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px] text-[#006a61]">receipt_long</span>
            <span>Record Cash / Bank Payment</span>
          </button>

          <button
            onClick={() => showToast('PDF invoice sent to charlotte.davies@example.co.uk')}
            className="w-full h-12 rounded-xl bg-[#f2f3ff] text-[#454653] text-[14px] font-medium flex items-center justify-center gap-2 active:bg-[#eaedff] transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">mail</span>
            <span>Email PDF to Client</span>
          </button>
        </div>

        {/* Audit Trace Footnote */}
        <div className="flex items-center justify-center gap-1.5 py-3 text-center">
          <span className="material-symbols-outlined text-[14px] text-[#757685]">lock</span>
          <span className="text-[13px] text-[#454653]">Tapili UK Micro-Entity Compliant • VAT Exempt</span>
        </div>
      </div>
    </div>
  );
};
