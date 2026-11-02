import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const StripeConnectScreen: React.FC = () => {
  const { stripeSettings, updateStripeSettings, navigateTo, showToast } = useApp();

  const [activeLifecycle, setActiveLifecycle] = useState<'active' | 'verification' | 'paused' | 'disconnected'>('active');
  const [depositReq, setDepositReq] = useState(stripeSettings.depositRequired);
  const [fallbackReq, setFallbackReq] = useState(stripeSettings.allowInPersonFallback);
  const [remindersReq, setRemindersReq] = useState(stripeSettings.automatedReminders);
  const [expiryHours, setExpiryHours] = useState(stripeSettings.linkExpirationHours);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      updateStripeSettings({
        depositRequired: depositReq,
        allowInPersonFallback: fallbackReq,
        automatedReminders: remindersReq,
        linkExpirationHours: expiryHours,
      });
      setIsSaving(false);
      showToast('Settings saved successfully to cloud!');
    }, 600);
  };

  return (
    <div className="flex flex-col w-full pb-36 max-w-lg mx-auto">
      {/* Sub-header / Back context */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <button
          onClick={() => navigateTo('home')}
          className="flex items-center gap-1.5 text-[#454653] hover:text-[#11249f] transition-colors py-1 -ml-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          <span className="text-[14px] font-medium">Settings</span>
        </button>
        <div className="flex items-center gap-1 bg-[#eaedff] px-2.5 py-1 rounded-full text-[#454653]">
          <span className="material-symbols-outlined text-[14px] text-[#006a61]">lock</span>
          <span className="text-[12px] font-medium">256-bit Encrypted</span>
        </div>
      </div>

      <div className="px-4 mb-3">
        <h1 className="text-[24px] font-semibold text-[#131b2e] tracking-tight">
          Payment Settings & Stripe Connect
        </h1>
        <p className="text-[13px] text-[#454653] mt-0.5">
          Manage payouts, fast direct deposits, and automated client booking guarantees.
        </p>
      </div>

      <div className="px-4 flex flex-col gap-4">
        {/* SECTION 1: Stripe Connect Status Card */}
        <section className="bg-white rounded-xl shadow-sm border border-[#eaedff] p-4 flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-[#eaedff] flex items-center justify-center text-[#3040b6]">
                <span className="material-symbols-outlined text-[24px]">account_balance</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[17px] font-semibold text-[#131b2e]">Stripe Connect</span>
                  <span className="text-[12px] text-[#757685] font-mono">acct_1Nx882Sparkle</span>
                </div>
                <p className="text-[13px] text-[#454653]">Standard direct account</p>
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-[#89f5e7]/40 text-[#005049] px-2.5 py-1 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#006a61] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#006a61]"></span>
              </span>
              <span className="text-[12px] font-semibold">Connected & Ready</span>
            </div>
          </div>

          <div className="bg-[#f2f3ff] rounded-lg p-3 flex items-start gap-2.5 border border-[#eaedff]">
            <span className="material-symbols-outlined text-[#006a61] text-[20px] mt-0.5">verified_user</span>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-[#131b2e]">Daily Rolling Payouts</div>
              <p className="text-[13px] text-[#454653] mt-0.5">
                Funds clear directly to Barclays Business <span className="font-mono font-medium text-[#131b2e]">(•••• 0194)</span> by 04:00 AM next day.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="bg-[#f2f3ff]/70 rounded-lg p-2.5 flex flex-col gap-1 border border-[#eaedff]">
              <div className="flex items-center gap-1 text-[#454653] text-[12px]">
                <span className="material-symbols-outlined text-[16px] text-[#006a61]">contactless</span>
                <span>Card & Apple Pay</span>
              </div>
              <span className="text-[12px] text-[#006a61] font-semibold">Active & Live</span>
            </div>
            <div className="bg-[#f2f3ff]/70 rounded-lg p-2.5 flex flex-col gap-1 border border-[#eaedff]">
              <div className="flex items-center gap-1 text-[#454653] text-[12px]">
                <span className="material-symbols-outlined text-[16px] text-[#006a61]">sync_saved_locally</span>
                <span>Webhooks</span>
              </div>
              <span className="text-[12px] text-[#131b2e] font-medium">99.9% Health</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  showToast('Opening external Stripe Merchant Dashboard...');
                  window.open('https://dashboard.stripe.com', '_blank');
                }}
                className="h-11 px-3 rounded-lg bg-[#eaedff] hover:bg-[#dae2fd] transition-colors flex items-center justify-center gap-1.5 text-[#131b2e] text-[13px] font-medium cursor-pointer"
              >
                <span>Stripe Dashboard</span>
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </button>
              <button
                onClick={() => showToast('Opening Stripe automated payout schedule')}
                className="h-11 px-3 rounded-lg bg-[#eaedff] hover:bg-[#dae2fd] transition-colors flex items-center justify-center gap-1.5 text-[#131b2e] text-[13px] font-medium cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">payments</span>
                <span>Manage Payouts</span>
              </button>
            </div>
            <button
              onClick={() => showToast('Stripe account is locked to Sparkle & Shine Co.')}
              className="py-1 text-center text-[#ba1a1a] hover:underline text-[12px] font-medium transition-colors cursor-pointer"
              type="button"
            >
              Disconnect Account
            </button>
          </div>
        </section>

        {/* SECTION 2: Connection Lifecycle State Explorer */}
        <section className="bg-white rounded-xl shadow-sm border border-[#eaedff] p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#3040b6] text-[20px]">hub</span>
              <h2 className="text-[17px] font-semibold text-[#131b2e]">Connection Lifecycle</h2>
            </div>
            <span className="text-[11px] text-[#757685] font-medium">Interactive Preview</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {(['active', 'verification', 'paused', 'disconnected'] as const).map(st => {
              const isActive = activeLifecycle === st;
              const labels = {
                active: 'Active',
                verification: 'Verification Required',
                paused: 'Payments Paused',
                disconnected: 'Not Connected',
              };
              return (
                <button
                  key={st}
                  onClick={() => setActiveLifecycle(st)}
                  className={`px-3 py-1.5 rounded-full text-[12px] whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#3040b6] text-white font-semibold shadow-xs'
                      : 'bg-[#eaedff] text-[#454653] hover:text-[#131b2e]'
                  }`}
                  type="button"
                >
                  {labels[st]}
                </button>
              );
            })}
          </div>

          {/* Dynamic State Message Box */}
          <div className={`rounded-lg p-3 transition-all duration-200 border ${
            activeLifecycle === 'active'
              ? 'bg-[#89f5e7]/20 border-[#89f5e7]'
              : activeLifecycle === 'verification'
              ? 'bg-[#ffddb8]/30 border-[#ffddb8]'
              : activeLifecycle === 'paused'
              ? 'bg-[#ffdad6]/40 border-[#ffdad6]'
              : 'bg-[#f2f3ff] border-[#eaedff]'
          }`}>
            <div className="flex items-start gap-2.5">
              <span className={`material-symbols-outlined text-[22px] mt-0.5 ${
                activeLifecycle === 'active'
                  ? 'text-[#006a61]'
                  : activeLifecycle === 'verification'
                  ? 'text-[#653e00]'
                  : activeLifecycle === 'paused'
                  ? 'text-[#ba1a1a]'
                  : 'text-[#757685]'
              }`}>
                {activeLifecycle === 'active'
                  ? 'check_circle'
                  : activeLifecycle === 'verification'
                  ? 'warning'
                  : activeLifecycle === 'paused'
                  ? 'pause_circle'
                  : 'link_off'}
              </span>
              <div className="flex-1">
                <div className="text-[13px] font-semibold text-[#131b2e]">
                  {activeLifecycle === 'active' && 'All Systems Nominal'}
                  {activeLifecycle === 'verification' && 'Identity Verification Required'}
                  {activeLifecycle === 'paused' && 'Payments Temporarily Paused'}
                  {activeLifecycle === 'disconnected' && 'Not Connected'}
                </div>
                <p className="text-[13px] text-[#454653] mt-0.5 leading-snug">
                  {activeLifecycle === 'active' && 'Direct checkout links, in-person Apple Pay triggers, and instant automated bank sweeps are running smoothly.'}
                  {activeLifecycle === 'verification' && 'Stripe requires additional photo ID or UK VAT confirmation before your next rolling payout batch on Friday.'}
                  {activeLifecycle === 'paused' && 'New customer booking links are frozen. Existing balances remain safely buffered in your Stripe ledger.'}
                  {activeLifecycle === 'disconnected' && 'Connect your UK bank with Stripe to enable contactless card deposits, automated links, and tap-to-pay.'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#f2f3ff] rounded-lg p-3 flex gap-2.5 items-start border border-[#eaedff]">
            <div className="w-7 h-7 rounded-full bg-[#dfe0ff] flex items-center justify-center text-[#11249f] shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[16px]">shield</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-[#131b2e]">Stripe Direct Settlement</div>
              <p className="text-[13px] text-[#454653] mt-0.5 leading-relaxed">
                Tapili does not touch your funds. Deposits land directly in your registered UK bank account with zero platform hold or intermediary custody.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: Default Deposit Policies */}
        <section className="bg-white rounded-xl shadow-sm border border-[#eaedff] p-4 flex flex-col gap-3">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#3040b6] text-[20px]">tune</span>
            <h2 className="text-[17px] font-semibold text-[#131b2e]">Default Deposit Policies</h2>
          </div>

          {/* Toggle 1: Deposit Requirement */}
          <div className="flex items-center justify-between py-1 border-b border-[#eaedff]">
            <div className="pr-2">
              <div className="text-[13px] font-medium text-[#131b2e]">Deposit Requirement</div>
              <p className="text-[12px] text-[#454653] mt-0.5">Auto-request £20 or 30% upfront for all new domestic slots.</p>
            </div>
            <button
              onClick={() => setDepositReq(!depositReq)}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                depositReq ? 'bg-[#3040b6]' : 'bg-[#c6c5d6]'
              }`}
              type="button"
            >
              <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                depositReq ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Toggle 2: In-Person Fallback */}
          <div className="flex items-center justify-between py-1 border-b border-[#eaedff]">
            <div className="pr-2">
              <div className="text-[13px] font-medium text-[#131b2e]">Allow In-Person Fallback</div>
              <p className="text-[12px] text-[#454653] mt-0.5">Tap-to-Pay or cash fallback if client link remains unpaid upon arrival.</p>
            </div>
            <button
              onClick={() => setFallbackReq(!fallbackReq)}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                fallbackReq ? 'bg-[#3040b6]' : 'bg-[#c6c5d6]'
              }`}
              type="button"
            >
              <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                fallbackReq ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Dropdown: Link Expiration Window */}
          <div className="flex flex-col gap-1.5 pt-1">
            <label className="text-[13px] font-medium text-[#131b2e]" htmlFor="expiry-window">
              Link Expiration Window
            </label>
            <div className="relative">
              <select
                id="expiry-window"
                value={expiryHours}
                onChange={e => setExpiryHours(e.target.value as any)}
                className="w-full h-11 bg-[#f2f3ff] text-[#131b2e] text-[13px] rounded-lg px-3 pr-10 appearance-none border border-[#eaedff] outline-none"
              >
                <option value="24">24 Hours (Urgent Bookings)</option>
                <option value="48">48 Hours (Recommended for domestic)</option>
                <option value="72">72 Hours (Commercial quotes)</option>
                <option value="never">No Expiration</option>
              </select>
              <span className="material-symbols-outlined text-[#757685] pointer-events-none absolute right-3 top-3 text-[20px]">
                expand_more
              </span>
            </div>
            <span className="text-[12px] text-[#454653]">Slots release automatically if payment window lapses.</span>
          </div>

          {/* Toggle 3: Automated Reminders */}
          <div className="flex items-center justify-between py-1 pt-2">
            <div className="pr-2">
              <div className="text-[13px] font-medium text-[#131b2e]">Automated Reminders</div>
              <p className="text-[12px] text-[#454653] mt-0.5">Send a polite SMS & WhatsApp nudge 12h before link expires.</p>
            </div>
            <button
              onClick={() => setRemindersReq(!remindersReq)}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                remindersReq ? 'bg-[#3040b6]' : 'bg-[#c6c5d6]'
              }`}
              type="button"
            >
              <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                remindersReq ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </section>

        {/* SECTION 4: Live Activity Log */}
        <section className="bg-white rounded-xl shadow-sm border border-[#eaedff] p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#3040b6] text-[20px]">history</span>
              <h2 className="text-[17px] font-semibold text-[#131b2e]">Live Activity Log</h2>
            </div>
            <div className="flex items-center gap-1 text-[#006a61] text-[12px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006a61] animate-pulse"></span>
              <span>Real-time</span>
            </div>
          </div>

          <div className="relative pl-6 flex flex-col gap-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#eaedff]">
            {/* Item 1 */}
            <div className="relative flex flex-col gap-0.5">
              <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-[#89f5e7] flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-[#006a61]"></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-[#757685] font-mono">10:14 AM</span>
                <span className="bg-[#86f2e4] text-[#006f66] px-1.5 py-0.5 rounded text-[11px] font-semibold leading-none">
                  Paid
                </span>
              </div>
              <p className="text-[13px] text-[#131b2e] mt-0.5">
                <span className="font-semibold text-[#131b2e]">£20.00 deposit</span> paid by <span className="font-medium">Charlotte Davies</span> via Apple Pay
              </p>
              <span className="text-[12px] text-[#006a61] flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[14px]">done_all</span>
                Webhook confirmed (evt_3M1902)
              </span>
            </div>

            {/* Item 2 */}
            <div className="relative flex flex-col gap-0.5">
              <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-[#eaedff] flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-[#757685]"></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-[#757685] font-mono">09:58 AM</span>
                <span className="bg-[#eaedff] text-[#454653] px-1.5 py-0.5 rounded text-[11px] font-medium leading-none">
                  Viewed
                </span>
              </div>
              <p className="text-[13px] text-[#131b2e] mt-0.5">
                Secure checkout opened by customer
              </p>
              <span className="text-[12px] text-[#454653] mt-0.5">
                IP London, UK · Safari on iOS
              </span>
            </div>

            {/* Item 3 */}
            <div className="relative flex flex-col gap-0.5">
              <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-[#eaedff] flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-[#3040b6]"></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-[#757685] font-mono">09:30 AM</span>
                <span className="bg-[#eaedff] text-[#3040b6] px-1.5 py-0.5 rounded text-[11px] font-semibold leading-none">
                  Generated
                </span>
              </div>
              <p className="text-[13px] text-[#131b2e] mt-0.5">
                Deposit link generated by Emma for <span className="font-mono font-medium">#JOB-1082</span>
              </p>
              <span className="text-[12px] text-[#454653] mt-0.5">
                Sent via WhatsApp to +44 7700 900481
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* FIXED BOTTOM SAVE BAR */}
      <div className="fixed bottom-16 inset-x-0 z-30 bg-white/95 backdrop-blur-md px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.05)] border-t border-[#eaedff]">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[#454653]">
            <span className="material-symbols-outlined text-[20px] text-[#006a61]">cloud_done</span>
            <span className="text-[12px] font-medium">Auto-saved to cloud</span>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="h-12 px-5 rounded-xl bg-[#3040b6] text-white hover:bg-[#11249f] text-[14px] font-medium flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
            type="button"
          >
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            <span className="material-symbols-outlined text-[18px]">
              {isSaving ? 'refresh' : 'check'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
