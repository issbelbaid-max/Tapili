import React from 'react';
import { useApp } from '../context/AppContext';

export const Toast: React.FC = () => {
  const { toastMessage, showToast } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed top-20 left-4 right-4 z-50 max-w-sm mx-auto flex items-center justify-between px-4 py-3 rounded-xl bg-[#283044] text-[#eef0ff] shadow-xl animate-in fade-in slide-in-from-top-4 duration-200">
      <div className="flex items-center gap-2.5">
        <span className="material-symbols-outlined text-[20px] text-[#89f5e7]">check_circle</span>
        <span className="text-[13px] font-medium">{toastMessage}</span>
      </div>
      <button
        onClick={() => showToast('')}
        className="text-[#c6c5d6] hover:text-white transition-colors"
      >
        <span className="material-symbols-outlined text-[16px]">close</span>
      </button>
    </div>
  );
};
