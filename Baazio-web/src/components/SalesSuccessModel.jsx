import React from 'react';

export default function SalesSuccessModal({ isOpen, totalPaid, invoiceId, onPrint, onNewSale }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs z-50 animate-fadeIn font-sans select-none">
      
      {/* Central Modal Content Card Card Card Box wrapper */}
      <div className="w-full max-w-md bg-surface-low border border-slate-200 rounded-lg p-4 md:p-6 shadow-2xl relative text-center animate-scaleUp">
       
        <div className="w-14 h-14 bg-emerald-50 border border-emerald-300 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-700 animate-pulse">
          <svg className="w-7 h-7 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        {/* Informational Text Meta Stack */}
        <div className="space-y-1.5 mb-6 text-center">
          <h3 className="text-headline-md  text-on-surface  font-sans tracking-tight">
            Transaction Completed
          </h3>
          <p className="text-body-md font-sans text-slate-400  leading-relaxed">
            The sales data records has been written and saved securely to the server database. 
          </p>
          
          {/* Invoice Suffix Tracking Label Info Box Layer */}
          {invoiceId && (
            <p className="text-body-sm font-mono text-blue-600 bg-blue-100 border border-blue-300 px-2 py-0.5 rounded-md inline-block mt-2">
              REF-ID: #{invoiceId}
            </p>
          )}
        </div>

        
        {/* ========================================================================= */}
        {/* ACTION CONTROL INTERFACE CONTROL ROW */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 gap-3 w-full pt-2 border-t border-slate-100">
          
          {/* OPTION A: RE-START SALES FORM BLANK CARTS SELECTION MATRIX */}
          <button
            type="button"
            onClick={onNewSale}
            className="h-10 px-3 bg-slate-200 hover:bg-slate-300 text-on-surface border border-slate-300 rounded-md  text-label-md uppercase tracking-wider transition-colors cursor-pointer focus:outline-none flex items-center justify-center gap-1.5"
          >
            <svg className="w-4 h-4 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>New Sale</span>
          </button>

          {/* OPTION B: DISPATCH PRINTER LAYER HANDSHAKE HARDWARE COMMANDS [S4] */}
          <button
            type="button"
            onClick={onPrint}
            className="h-10 px-3 bg-primary-container hover:bg-primary text-surface-lowest rounded-md  text-label-md  tracking-wider transition-colors shadow-md shadow-blue-100 cursor-pointer focus:outline-none flex items-center justify-center gap-1.5 border border-primary-container"
          >
            <span>Print Receipt</span>
          </button>

        </div>

      </div>
    </div>
  );
}
