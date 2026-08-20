import React from 'react';

export default function AlertModal({ isOpen, type = "success", title, message, actionLabel, onAction, onClose }) {
  if (!isOpen) return null;

  // Dynamic style assignments based on the operation context type
  const isDanger = type === "danger";
  const iconBgColor = isDanger ? 'bg-red-50 border-red-100 text-red-500' : 'bg-emerald-50 border-emerald-100 text-emerald-500';
  const buttonColor = isDanger ? 'bg-error hover:bg-red-700 shadow-red-100' : 'bg-secondary-container hover:bg-primary-container shadow-slate-100';

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
      {/* Backdrop shield overlay masking layer */}
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs animate-fadeIn" />

      {/* Main card box matrix container */}
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-6 flex flex-col items-center justify-center text-center animate-scaleUp">
        
        {/* Context Icon Ring */}
        <div className={`w-14 h-14 border-4 rounded-full flex items-center justify-center mb-4 ${iconBgColor}`}>
          {isDanger ? (
            // Warning Alert Trash Icon
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          ) : (
            // Success Verification Check Icon
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>

        {/* Text Content */}
        <h4 className="text-slate-800 text-label-lg font-black tracking-tight">{title}</h4>
        <p className="text-slate-500 text-body-sm leading-relaxed mt-1.5 font-sans">{message}</p>

        {/* Action Controls Grid Layout */}
        <div className="w-full flex flex-col gap-2 mt-5">
          <button 
            onClick={onAction}
            className={`w-full h-10 text-white rounded-lg text-body-sm  transition-all shadow-md cursor-pointer ${buttonColor}`}
          >
            {actionLabel}
          </button>
          
          {isDanger && (
            <button 
              onClick={onClose}
              className="w-full h-10 bg-surface border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-body-sm transition-all cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
