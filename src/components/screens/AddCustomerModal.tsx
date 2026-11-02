import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const AddCustomerModal: React.FC = () => {
  const { isAddCustomerOpen, setIsAddCustomerOpen, addCustomer, showToast } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [postcode, setPostcode] = useState('');
  const [cadence, setCadence] = useState<'weekly' | 'fortnightly' | 'monthly' | 'ad-hoc'>('weekly');
  const [standardRate, setStandardRate] = useState('65.00');
  const [keysHeldNote, setKeysHeldNote] = useState('Keys on file');
  const [lockboxCode, setLockboxCode] = useState('');
  const [householdNotes, setHouseholdNotes] = useState('');

  const [errors, setErrors] = useState<{ name?: string; standardRate?: string; general?: string }>({});
  const [isSaving, setIsSaving] = useState(false);

  if (!isAddCustomerOpen) return null;

  const resetForm = () => {
    setName('');
    setPhone('');
    setEmail('');
    setAddressLine1('');
    setAddressLine2('');
    setPostcode('');
    setCadence('weekly');
    setStandardRate('65.00');
    setKeysHeldNote('Keys on file');
    setLockboxCode('');
    setHouseholdNotes('');
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    setIsAddCustomerOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; standardRate?: string; general?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Full customer name is required';
    }

    const rateNum = parseFloat(standardRate);
    if (isNaN(rateNum) || rateNum < 0) {
      newErrors.standardRate = 'Please enter a valid rate (e.g. 65.00)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    setErrors({});

    try {
      const cadenceLabels: Record<string, string> = {
        weekly: 'Weekly',
        fortnightly: 'Fortnightly',
        monthly: 'Monthly',
        'ad-hoc': 'Ad-Hoc',
      };

      await addCustomer({
        name: name.trim(),
        phone: phone.trim() || '07700 900000',
        email: email.trim(),
        addressLine1: addressLine1.trim() || 'Residential Address',
        addressLine2: addressLine2.trim() || 'London',
        postcode: postcode.trim().toUpperCase() || 'TW9 1DY',
        cadence,
        cadenceLabel: cadenceLabels[cadence] || 'Weekly',
        standardRate: rateNum || 65.00,
        keysHeldNote: keysHeldNote.trim() || 'Keys on file',
        lockboxCode: lockboxCode.trim() || '#0000',
        householdNotes: householdNotes.trim(),
      });

      handleClose();
    } catch (err: any) {
      setErrors({ general: err.message || 'Failed to create customer. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#283044]/60 backdrop-blur-xs transition-opacity duration-200 p-0 sm:p-4">
      <div 
        className="w-full max-w-lg bg-white rounded-t-[28px] sm:rounded-2xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300 border-t sm:border border-[#eaedff]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Drag handle & Header */}
        <div className="p-4 pb-3 flex flex-col items-center border-b border-[#f2f3ff] shrink-0">
          <div className="w-10 h-1 rounded-full bg-[#c6c5d6] mb-2 sm:hidden"></div>
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#dfe0ff] flex items-center justify-center text-[#11249f]">
                <span className="material-symbols-outlined text-[20px]">person_add</span>
              </div>
              <div>
                <h3 id="modal-title" className="text-[19px] font-semibold text-[#131b2e] leading-snug">
                  Add New Client
                </h3>
                <p className="text-[12px] text-[#454653]">Save customer details, key codes & agreed rate</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isSaving}
              className="w-9 h-9 rounded-full bg-[#f2f3ff] hover:bg-[#eaedff] flex items-center justify-center text-[#454653] hover:text-[#131b2e] transition-colors cursor-pointer"
              type="button"
              aria-label="Close dialog"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Error Message Banner */}
          {errors.general && (
            <div className="p-3 bg-[#ffdad6] text-[#410002] rounded-xl text-[13px] flex items-start gap-2 border border-[#ffb4ab]">
              <span className="material-symbols-outlined text-[18px] text-[#ba1a1a] shrink-0">error</span>
              <span>{errors.general}</span>
            </div>
          )}

          {/* Section 1: Contact Details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold uppercase tracking-wider text-[#454653]">
                Client Information
              </span>
              <span className="text-[11px] text-[#757685]">* Required</span>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#131b2e] mb-1">
                Full Name <span className="text-[#ba1a1a]">*</span>
              </label>
              <div className={`relative flex items-center rounded-xl bg-[#f2f3ff] px-3.5 py-2.5 border transition-all ${
                errors.name ? 'border-[#ba1a1a] bg-[#fff8f7]' : 'border-transparent focus-within:border-[#3040b6] focus-within:bg-white'
              }`}>
                <span className="material-symbols-outlined text-[18px] text-[#757685] mr-2">person</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                  }}
                  placeholder="e.g. Charlotte Davies"
                  className="w-full bg-transparent text-[14px] text-[#131b2e] focus:outline-none placeholder:text-[#757685]"
                  disabled={isSaving}
                  autoFocus
                />
              </div>
              {errors.name && (
                <p className="text-[12px] text-[#ba1a1a] mt-1 pl-1 flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[14px]">info</span>
                  {errors.name}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[13px] font-medium text-[#131b2e] mb-1">
                  Phone Number
                </label>
                <div className="relative flex items-center rounded-xl bg-[#f2f3ff] px-3.5 py-2.5 border border-transparent focus-within:border-[#3040b6] focus-within:bg-white transition-all">
                  <span className="material-symbols-outlined text-[18px] text-[#757685] mr-2">call</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="07700 900555"
                    className="w-full bg-transparent text-[14px] text-[#131b2e] focus:outline-none placeholder:text-[#757685]"
                    disabled={isSaving}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#131b2e] mb-1">
                  Email Address
                </label>
                <div className="relative flex items-center rounded-xl bg-[#f2f3ff] px-3.5 py-2.5 border border-transparent focus-within:border-[#3040b6] focus-within:bg-white transition-all">
                  <span className="material-symbols-outlined text-[18px] text-[#757685] mr-2">mail</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="charlotte@example.co.uk"
                    className="w-full bg-transparent text-[14px] text-[#131b2e] focus:outline-none placeholder:text-[#757685]"
                    disabled={isSaving}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Property & Address */}
          <div className="space-y-3 pt-1">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-[#454653]">
              Property Address
            </span>

            <div>
              <label className="block text-[13px] font-medium text-[#131b2e] mb-1">
                Street Address
              </label>
              <div className="relative flex items-center rounded-xl bg-[#f2f3ff] px-3.5 py-2.5 border border-transparent focus-within:border-[#3040b6] focus-within:bg-white transition-all">
                <span className="material-symbols-outlined text-[18px] text-[#757685] mr-2">home</span>
                <input
                  type="text"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="e.g. 42 Crescent Gardens, Flat 2B"
                  className="w-full bg-transparent text-[14px] text-[#131b2e] focus:outline-none placeholder:text-[#757685]"
                  disabled={isSaving}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[13px] font-medium text-[#131b2e] mb-1">
                  Town / Area
                </label>
                <input
                  type="text"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  placeholder="Richmond, Surrey"
                  className="w-full rounded-xl bg-[#f2f3ff] px-3.5 py-2.5 text-[14px] text-[#131b2e] border border-transparent focus:border-[#3040b6] focus:bg-white focus:outline-none transition-all placeholder:text-[#757685]"
                  disabled={isSaving}
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#131b2e] mb-1">
                  Postcode
                </label>
                <div className="relative flex items-center rounded-xl bg-[#f2f3ff] px-3.5 py-2.5 border border-transparent focus-within:border-[#3040b6] focus-within:bg-white transition-all">
                  <span className="material-symbols-outlined text-[18px] text-[#757685] mr-2">pin_drop</span>
                  <input
                    type="text"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    placeholder="TW9 1DY"
                    className="w-full bg-transparent text-[14px] text-[#131b2e] uppercase focus:outline-none placeholder:text-[#757685]"
                    disabled={isSaving}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Clean Frequency & Agreed Price */}
          <div className="space-y-3 pt-1">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-[#454653]">
              Cleaning Arrangement
            </span>

            <div>
              <label className="block text-[13px] font-medium text-[#131b2e] mb-1.5">
                Frequency
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['weekly', 'fortnightly', 'monthly', 'ad-hoc'] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setCadence(opt)}
                    className={`py-2 px-1 text-center rounded-xl text-[12px] font-medium capitalize transition-all cursor-pointer ${
                      cadence === opt
                        ? 'bg-[#3040b6] text-white shadow-xs font-semibold'
                        : 'bg-[#f2f3ff] text-[#454653] hover:bg-[#eaedff]'
                    }`}
                  >
                    {opt === 'ad-hoc' ? 'Ad-Hoc' : opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[13px] font-medium text-[#131b2e] mb-1">
                  Standard Rate (£/clean)
                </label>
                <div className="relative flex items-center rounded-xl bg-[#f2f3ff] px-3.5 py-2.5 border border-transparent focus-within:border-[#3040b6] focus-within:bg-white transition-all">
                  <span className="text-[16px] font-semibold text-[#757685] mr-1.5">£</span>
                  <input
                    type="number"
                    step="1"
                    value={standardRate}
                    onChange={(e) => setStandardRate(e.target.value)}
                    placeholder="65.00"
                    className="w-full bg-transparent text-[15px] font-semibold text-[#131b2e] focus:outline-none"
                    disabled={isSaving}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#131b2e] mb-1">
                  Lockbox / Key Pin
                </label>
                <div className="relative flex items-center rounded-xl bg-[#f2f3ff] px-3.5 py-2.5 border border-transparent focus-within:border-[#3040b6] focus-within:bg-white transition-all">
                  <span className="material-symbols-outlined text-[18px] text-[#757685] mr-2">key</span>
                  <input
                    type="text"
                    value={lockboxCode}
                    onChange={(e) => setLockboxCode(e.target.value)}
                    placeholder="#5821"
                    className="w-full bg-transparent text-[14px] text-[#131b2e] focus:outline-none placeholder:text-[#757685]"
                    disabled={isSaving}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Household & Key Safe Notes */}
          <div className="space-y-3 pt-1">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-[#454653]">
              Property & Access Notes
            </span>

            <div>
              <label className="block text-[13px] font-medium text-[#131b2e] mb-1">
                Keys Held Note
              </label>
              <input
                type="text"
                value={keysHeldNote}
                onChange={(e) => setKeysHeldNote(e.target.value)}
                placeholder="e.g. Physical key on Ring #14"
                className="w-full rounded-xl bg-[#f2f3ff] px-3.5 py-2.5 text-[14px] text-[#131b2e] border border-transparent focus:border-[#3040b6] focus:bg-white focus:outline-none transition-all placeholder:text-[#757685]"
                disabled={isSaving}
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#131b2e] mb-1">
                Household, Pet & Access Protocol
              </label>
              <textarea
                rows={2}
                value={householdNotes}
                onChange={(e) => setHouseholdNotes(e.target.value)}
                placeholder="e.g. 2 indoor cats (Milo & Pepper). Alarm code *4912*. Eco spray preferred."
                className="w-full rounded-xl bg-[#f2f3ff] p-3 text-[14px] text-[#131b2e] border border-transparent focus:border-[#3040b6] focus:bg-white focus:outline-none transition-all placeholder:text-[#757685] resize-none"
                disabled={isSaving}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 pb-1 flex items-center gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSaving}
              className="flex-1 py-3 px-4 rounded-xl border border-[#c6c5d6] text-[#454653] font-medium text-[14px] hover:bg-[#f2f3ff] active:bg-[#eaedff] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-2 py-3 px-4 rounded-xl bg-[#3040b6] hover:bg-[#11249f] active:bg-[#001789] text-white font-medium text-[14px] shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Saving Client...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">check</span>
                  <span>Save Client</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
