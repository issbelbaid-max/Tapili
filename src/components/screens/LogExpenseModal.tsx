import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const LogExpenseModal: React.FC = () => {
  const { isLogExpenseOpen, setIsLogExpenseOpen, addExpense, showToast } = useApp();

  const [amount, setAmount] = useState('24.50');
  const [category, setCategory] = useState<'supplies' | 'equipment' | 'transport' | 'staff' | 'insurance'>('supplies');
  const [merchant, setMerchant] = useState('Screwfix - 10x Microfibre cloths & neutral floor cleaner');
  const [jobLink, setJobLink] = useState('C. Davies (24 Oct)');
  const [isSaving, setIsSaving] = useState(false);
  const [receiptName, setReceiptName] = useState('IMG_0942_Receipt.jpg');

  if (!isLogExpenseOpen) return null;

  const categories = [
    { id: 'supplies', label: 'Cleaning Supplies', icon: 'cleaning_services' },
    { id: 'equipment', label: 'Equipment', icon: 'build' },
    { id: 'transport', label: 'Transport & Fuel', icon: 'local_gas_station' },
    { id: 'staff', label: 'Staff / Subcontractor', icon: 'badge' },
    { id: 'insurance', label: 'Insurance & Other', icon: 'shield' },
  ] as const;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount) || 0;
    if (parsedAmount <= 0) {
      showToast('Please enter a valid expense amount');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      const selectedCatObj = categories.find(c => c.id === category);
      addExpense({
        merchant: merchant.split('-')[0].trim() || 'Expense',
        category,
        categoryLabel: selectedCatObj ? selectedCatObj.label : 'Supplies',
        amount: parsedAmount,
        dateStr: '2024-10-24',
        dateLabel: 'Today',
        jobLink: jobLink || undefined,
        description: merchant,
        receiptName: receiptName,
        receiptSize: '1.2 MB',
        statusLabel: 'Receipt linked',
      });
      setIsSaving(false);
      setIsLogExpenseOpen(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#283044]/50 backdrop-blur-sm transition-opacity duration-200">
      <div className="w-full max-w-lg bg-white rounded-t-[28px] shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300 border-t border-[#eaedff]">
        {/* Drag handle & Header */}
        <div className="p-4 pb-2 flex flex-col items-center">
          <div className="w-10 h-1.5 rounded-full bg-[#c6c5d6] mb-3"></div>
          <div className="w-full flex items-center justify-between">
            <div>
              <h3 className="text-[20px] font-semibold text-[#131b2e]">Log New Expense</h3>
              <p className="text-[13px] text-[#454653]">Keep your cleaning margins clear & HMRC ready</p>
            </div>
            <button
              onClick={() => setIsLogExpenseOpen(false)}
              className="w-9 h-9 rounded-full bg-[#eaedff] flex items-center justify-center text-[#454653] hover:text-[#131b2e] cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Modal Content Scrollable Form */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-4">
          {/* Large Amount Input */}
          <div>
            <label className="block text-[12px] font-medium text-[#454653] mb-1">Expense Amount</label>
            <div className="relative flex items-center rounded-xl bg-[#f2f3ff] px-4 py-2 border border-transparent focus-within:border-[#3040b6] focus-within:bg-white transition-all">
              <span className="text-[32px] font-semibold text-[#757685] mr-1">£</span>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full bg-transparent text-[32px] font-semibold text-[#131b2e] focus:outline-none tabular-nums"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Expense Category Selection */}
          <div>
            <label className="block text-[12px] font-medium text-[#454653] mb-2">Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => {
                const isActive = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`h-8 px-3 rounded-full text-[12px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#3040b6] text-white shadow-xs'
                        : 'bg-[#eaedff] text-[#454653] hover:bg-[#e2e7ff]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Job Link in 2-Column Split */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-medium text-[#454653] mb-1">Date</label>
              <div className="h-12 bg-[#f2f3ff] rounded-xl px-3 flex items-center justify-between text-[#131b2e]">
                <span className="text-[14px] font-medium truncate">Today, 24 Oct</span>
                <span className="material-symbols-outlined text-[18px] text-[#454653]">calendar_today</span>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#454653] mb-1">Link Job (Optional)</label>
              <div className="relative">
                <select
                  value={jobLink}
                  onChange={e => setJobLink(e.target.value)}
                  className="w-full h-12 bg-[#f2f3ff] rounded-xl px-3 pr-8 appearance-none text-[13px] text-[#131b2e] outline-none"
                >
                  <option value="C. Davies (24 Oct)">C. Davies (24 Oct)</option>
                  <option value="O. Sterling (24 Oct)">O. Sterling (24 Oct)</option>
                  <option value="Dr. J. Aris (24 Oct)">Dr. J. Aris (24 Oct)</option>
                  <option value="">General Overhead</option>
                </select>
                <span className="material-symbols-outlined text-[18px] text-[#454653] absolute right-2.5 top-3.5 pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>
          </div>

          {/* Description Note Field */}
          <div>
            <label className="block text-[12px] font-medium text-[#454653] mb-1">Description / Merchant</label>
            <div className="bg-[#f2f3ff] rounded-xl px-3 py-2.5 border border-transparent focus-within:border-[#3040b6] focus-within:bg-white transition-all">
              <input
                type="text"
                value={merchant}
                onChange={e => setMerchant(e.target.value)}
                placeholder="e.g. Screwfix, B&Q, Shell"
                className="w-full bg-transparent text-[14px] text-[#131b2e] outline-none"
              />
            </div>
          </div>

          {/* Snap Receipt / Upload Photo Trigger */}
          <div>
            <label className="block text-[12px] font-medium text-[#454653] mb-1">Proof of Purchase</label>
            <div className="p-3 bg-[#f2f3ff] rounded-xl flex items-center justify-between border border-[#eaedff]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#dae2fd] flex items-center justify-center text-[#3040b6]">
                  <span className="material-symbols-outlined text-[22px]">photo_camera</span>
                </div>
                <div>
                  <p className="text-[13px] font-medium text-[#131b2e]">Receipt attached</p>
                  <p className="text-[11px] text-[#006a61]">{receiptName} (1.2 MB)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newName = `Receipt_${Date.now().toString().slice(-4)}.jpg`;
                  setReceiptName(newName);
                  showToast('Camera/File picker simulated: receipt updated');
                }}
                className="text-[12px] text-[#3040b6] font-semibold px-3 py-1.5 bg-white rounded-full shadow-xs cursor-pointer border border-[#eaedff]"
              >
                Replace
              </button>
            </div>
          </div>

          {/* Bottom Pinned Action */}
          <div className="pt-2 pb-6">
            <button
              disabled={isSaving}
              type="submit"
              className="w-full h-12 bg-[#3040b6] hover:bg-[#11249f] text-white rounded-xl text-[14px] font-medium flex items-center justify-center gap-2 active:scale-[0.99] transition-transform shadow-md cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">
                {isSaving ? 'progress_activity' : 'check_circle'}
              </span>
              <span>
                {isSaving ? 'Saving...' : `Save Expense (£${amount || '0.00'})`}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
