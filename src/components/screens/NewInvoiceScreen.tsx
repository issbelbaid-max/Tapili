import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const NewInvoiceScreen: React.FC = () => {
  const { navigateTo, setIsLogExpenseOpen, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'invoice' | 'expense'>('invoice');
  const [selectedClient, setSelectedClient] = useState<'charlotte' | 'oliver'>('charlotte');
  const [hasExtraSupply, setHasExtraSupply] = useState(false);
  const [isDepositReceived, setIsDepositReceived] = useState(true);
  const [depositAmount, setDepositAmount] = useState('20.00');
  const [dueDateMode, setDueDateMode] = useState<'now' | '7d'>('now');
  const [whatsAppPayLink, setWhatsAppPayLink] = useState(true);

  const basePrice = 65.00;
  const extraPrice = hasExtraSupply ? 5.00 : 0.00;
  const gross = basePrice + extraPrice;
  const deposit = isDepositReceived ? (parseFloat(depositAmount) || 0) : 0;
  const remaining = Math.max(0, gross - deposit);

  const handleShareInvoice = () => {
    showToast(`Invoice #INV-2024-089 created! Dispatching WhatsApp link for £${remaining.toFixed(2)}...`);
    window.open(
      `https://wa.me/447911204918?text=${encodeURIComponent(
        `Hi Charlotte, here is your invoice for today's clean (£${remaining.toFixed(2)} due). Pay securely via Apple Pay or Bank: https://tapili.uk/pay/inv-089`
      )}`,
      '_blank'
    );
    navigateTo('invoice-detail');
  };

  return (
    <div className="flex flex-col w-full pb-36 max-w-lg mx-auto">
      {/* Sub-header Navigation Strip */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('money')}
            aria-label="Go back"
            className="w-10 h-10 rounded-full bg-[#f2f3ff] text-[#131b2e] flex items-center justify-center active:bg-[#eaedff] transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div>
            <span className="text-[17px] font-semibold text-[#131b2e] block leading-tight">New Invoice</span>
            <span className="text-[12px] text-[#454653]">INV-2024-089</span>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-[#e2e7ff] text-[#3040b6] text-[12px] font-medium px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3040b6] animate-pulse"></span>
          <span>Draft auto-saved</span>
        </div>
      </div>

      <div className="px-4 flex flex-col gap-3">
        {/* Flow Switcher */}
        <div className="bg-[#f2f3ff] p-1 rounded-xl flex items-center shadow-xs border border-[#eaedff]">
          <button
            onClick={() => setActiveTab('invoice')}
            className={`flex-1 py-2 rounded-lg text-[14px] font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'invoice'
                ? 'bg-white text-[#3040b6] shadow-sm font-semibold'
                : 'text-[#454653] hover:text-[#131b2e]'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            <span>Create Invoice</span>
          </button>
          <button
            onClick={() => {
              setIsLogExpenseOpen(true);
            }}
            className="flex-1 py-2 rounded-lg text-[14px] font-medium text-[#454653] hover:text-[#131b2e] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
            <span>Add Expense</span>
          </button>
        </div>

        {/* 1. Customer Selector Card */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-medium text-[#454653] uppercase tracking-wider">
              Client & Property
            </span>
            <span className="text-[12px] font-medium text-[#3040b6] flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[16px]">sync</span>
              Auto-matched
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={() => setSelectedClient('charlotte')}
              className={`flex items-center gap-2 p-2.5 rounded-xl text-left transition-colors border cursor-pointer ${
                selectedClient === 'charlotte'
                  ? 'bg-[#eaedff] border-[#3040b6]'
                  : 'bg-[#f2f3ff] border-transparent opacity-75'
              }`}
              type="button"
            >
              <div className="w-9 h-9 rounded-full bg-[#dfe0ff] text-[#000b62] text-[13px] font-bold flex items-center justify-center shrink-0">
                CD
              </div>
              <div className="min-w-0">
                <span className="text-[13px] text-[#131b2e] block truncate font-semibold">Charlotte Davies</span>
                <span className="text-[12px] text-[#454653] block truncate">14 Richmond Green</span>
              </div>
            </button>

            <button
              onClick={() => setSelectedClient('oliver')}
              className={`flex items-center gap-2 p-2.5 rounded-xl text-left transition-colors border cursor-pointer ${
                selectedClient === 'oliver'
                  ? 'bg-[#eaedff] border-[#3040b6]'
                  : 'bg-[#f2f3ff] border-transparent opacity-75'
              }`}
              type="button"
            >
              <div className="w-9 h-9 rounded-full bg-[#89f5e7] text-[#00201d] text-[13px] font-bold flex items-center justify-center shrink-0">
                OS
              </div>
              <div className="min-w-0">
                <span className="text-[13px] text-[#131b2e] block truncate font-semibold">Oliver Sterling</span>
                <span className="text-[12px] text-[#454653] block truncate">Flat 3B Kensington</span>
              </div>
            </button>
          </div>

          <div className="bg-[#f2f3ff] rounded-lg p-2.5 flex items-start gap-2.5 border border-[#eaedff]">
            <span className="material-symbols-outlined text-[#006a61] text-[20px] shrink-0 mt-0.5">home_pin</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#131b2e] font-medium truncate">
                  {selectedClient === 'charlotte' ? '14 Richmond Green, TW9 1QN' : 'Flat 3B Kensington, W8 5SA'}
                </span>
                <span className="text-[11px] bg-[#86f2e4] text-[#006f66] px-2 py-0.5 rounded-full font-medium shrink-0">
                  Regular Client
                </span>
              </div>
              <p className="text-[12px] text-[#454653] mt-0.5">Key safely returned to side lockbox (#4029)</p>
            </div>
          </div>
        </div>

        {/* 2. Link to Job Selection */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-medium text-[#454653] uppercase tracking-wider">
              Completed Appointment
            </span>
            <span className="text-[11px] bg-[#86f2e4] text-[#006f66] px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-[13px]">check_circle</span>
              Verified
            </span>
          </div>

          <div className="bg-[#f2f3ff] rounded-xl p-3 flex items-center justify-between border border-[#eaedff]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#e2e7ff] text-[#3040b6] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">cleaning_services</span>
              </div>
              <div className="min-w-0">
                <span className="text-[14px] text-[#131b2e] font-semibold block truncate">
                  Today's Clean (24 Oct)
                </span>
                <span className="text-[12px] text-[#454653] block truncate">
                  09:30 - 12:00 (2.5 hrs logged)
                </span>
              </div>
            </div>
            <button className="w-8 h-8 rounded-full bg-white text-[#454653] flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[18px]">unfold_more</span>
            </button>
          </div>
        </div>

        {/* 3. Services & Supplies */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-medium text-[#454653] uppercase tracking-wider">
              Services & Supplies
            </span>
            <span className="text-[12px] text-[#454653]">GBP (£)</span>
          </div>

          <div className="flex items-start justify-between py-2 gap-2">
            <div className="flex-1 min-w-0">
              <div className="text-[14px] text-[#131b2e] font-medium">Standard Domestic Clean (2.5 hrs)</div>
              <div className="text-[12px] text-[#454653]">Bi-weekly rate @ £26.00 / hr</div>
            </div>
            <span className="text-[18px] font-semibold text-[#131b2e] shrink-0">£65.00</span>
          </div>

          {hasExtraSupply && (
            <div className="mt-2 pt-2 bg-[#f2f3ff] rounded-lg p-2.5 flex items-center justify-between border border-[#eaedff]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006a61] text-[18px]">sanitizer</span>
                <span className="text-[13px] text-[#131b2e]">Microfibre refills & descaler</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[14px] text-[#131b2e] font-semibold">+£5.00</span>
                <button
                  type="button"
                  onClick={() => setHasExtraSupply(false)}
                  className="text-[#ba1a1a] flex items-center"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </div>
          )}

          {!hasExtraSupply && (
            <button
              onClick={() => setHasExtraSupply(true)}
              className="w-full mt-2 py-3 px-3 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] text-[#3040b6] text-[14px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Add Item / Eco Supply Fee</span>
            </button>
          )}
        </div>

        {/* 4. Financial Breakdown */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff]">
          <span className="text-[12px] font-medium text-[#454653] uppercase tracking-wider block mb-3">
            Financial Breakdown
          </span>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-[#454653]">Invoice Gross Total</span>
              <span className="text-[17px] text-[#131b2e] font-semibold">£{gross.toFixed(2)}</span>
            </div>

            {/* Deposit toggle */}
            <div className="bg-[#f2f3ff] rounded-xl p-3 border border-[#eaedff]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#3040b6] text-[20px]">account_balance_wallet</span>
                  <span className="text-[13px] text-[#131b2e] font-medium">Deposit Already Received</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDepositReceived}
                    onChange={e => setIsDepositReceived(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#c6c5d6] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3040b6]"></div>
                </label>
              </div>

              {isDepositReceived && (
                <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#eaedff]">
                  <span className="text-[12px] text-[#454653]">Advance booking deposit</span>
                  <div className="flex items-center bg-white rounded-lg px-2.5 py-1 shadow-xs border border-[#eaedff]">
                    <span className="text-[13px] text-[#454653] mr-1">-£</span>
                    <input
                      type="number"
                      step="5"
                      value={depositAmount}
                      onChange={e => setDepositAmount(e.target.value)}
                      className="w-14 text-[17px] text-[#006a61] font-semibold bg-transparent focus:outline-none text-right"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Remaining To Collect */}
            <div className="bg-[#eaedff] p-3 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#454653] block uppercase font-medium">Remaining to Collect</span>
                <span className="text-[12px] text-[#454653]">Due from client Charlotte</span>
              </div>
              <div className="text-right">
                <span className="text-[28px] text-[#3040b6] font-semibold">£{remaining.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Due Options */}
            <div>
              <span className="text-[12px] text-[#454653] block mb-2 font-medium">Payment Due</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDueDateMode('now')}
                  className={`py-2.5 px-3 rounded-lg text-[12px] font-medium text-center transition-colors cursor-pointer ${
                    dueDateMode === 'now'
                      ? 'bg-[#3040b6] text-white shadow-xs font-semibold'
                      : 'bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff]'
                  }`}
                >
                  Upon Completion (Default)
                </button>
                <button
                  type="button"
                  onClick={() => setDueDateMode('7d')}
                  className={`py-2.5 px-3 rounded-lg text-[12px] font-medium text-center transition-colors cursor-pointer ${
                    dueDateMode === '7d'
                      ? 'bg-[#3040b6] text-white shadow-xs font-semibold'
                      : 'bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff]'
                  }`}
                >
                  7 Days Net (31 Oct)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Fast Settlement Channel */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-[#454653] uppercase tracking-wider">
              Fast Settlement Channel
            </span>
            <span className="text-[12px] bg-[#86f2e4] text-[#006f66] px-2 py-0.5 rounded-full font-medium">
              BACS Ready
            </span>
          </div>

          <div className="bg-[#f2f3ff] rounded-xl p-3 border border-[#eaedff]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#11249f] text-[20px]">assured_workload</span>
                <span className="text-[13px] text-[#131b2e] font-semibold">Barclays Business Account</span>
              </div>
              <span className="text-[11px] text-[#006a61] font-medium">Tapili Verified</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 text-[13px]">
              <div className="bg-white rounded-lg p-2 border border-[#eaedff]">
                <span className="text-[11px] text-[#454653] block">Sort Code</span>
                <span className="text-[13px] text-[#131b2e] font-semibold font-mono tracking-wide">20-04-15</span>
              </div>
              <div className="bg-white rounded-lg p-2 border border-[#eaedff]">
                <span className="text-[11px] text-[#454653] block">Account No.</span>
                <span className="text-[13px] text-[#131b2e] font-semibold font-mono tracking-wide">83920194</span>
              </div>
            </div>
          </div>

          <div className="bg-[#f2f3ff] rounded-xl p-3 flex items-start gap-3 border border-[#eaedff]">
            <div className="w-9 h-9 rounded-full bg-[#86f2e4] text-[#006f66] flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[20px]">chat</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-[#131b2e] font-semibold">Instant WhatsApp Pay Link</span>
                <input
                  type="checkbox"
                  checked={whatsAppPayLink}
                  onChange={e => setWhatsAppPayLink(e.target.checked)}
                  className="w-5 h-5 accent-[#3040b6] rounded cursor-pointer"
                />
              </div>
              <p className="text-[12px] text-[#454653] mt-1 leading-snug">
                Sends pre-formatted WhatsApp message with 1-tap Apple Pay & Open Banking instant transfer link.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-16 left-0 right-0 z-30 bg-white/95 backdrop-blur-md px-4 py-3 shadow-[0_-8px_20px_rgba(0,0,0,0.06)] border-t border-[#eaedff]">
        <div className="max-w-md mx-auto flex flex-col gap-2">
          <button
            onClick={handleShareInvoice}
            className="w-full h-12 rounded-xl bg-[#3040b6] hover:bg-[#11249f] text-white text-[14px] font-medium flex items-center justify-center gap-2 active:opacity-90 transition-all shadow-sm cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
            <span>Create & Share Invoice (£{remaining.toFixed(2)})</span>
          </button>
          <button
            onClick={() => {
              showToast('Invoice #INV-2024-089 draft saved to your ledger');
              navigateTo('money');
            }}
            className="w-full h-10 rounded-xl bg-[#eaedff] text-[#131b2e] hover:bg-[#dae2fd] text-[13px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">bookmark</span>
            <span>Save as Draft</span>
          </button>
        </div>
      </div>
    </div>
  );
};
