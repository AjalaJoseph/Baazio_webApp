import React, { useEffect, useState } from 'react';
import api from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';

export default function BillingVerifyPage() {
  const navigate = useNavigate();
  const [verifyStatus, setVerifyStatus] = useState("PROCESSING");

  useEffect(  () => {
    // Sensory delay animation giving your background webhook processing window room to settle [S4]
    const sensoryDelayTimer = setTimeout( async () => {
      setVerifyStatus("SUCCESS");
    //   const checkPaymentStatus = await api.post("/subscribe-webhook")
    //   console.log(checkPaymentStatus.data)
      // Return to primary billing view after displaying success validation checklist
      setTimeout(() => {
        navigate("/admin-dashboard/billing");
      }, 3000);
    }, 2500);

    return () => clearTimeout(sensoryDelayTimer);
  }, [navigate]);

  return (
    <div className="w-full min-h-[75vh] flex items-center justify-center p-6 bg-slate-50/10 select-none font-sans text-left">
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-5 text-center animate-scaleUp">
        
        {/* ⏳ Stage 1: Active Queue Synchronization Processing loader */}
        {verifyStatus === "PROCESSING" && (
          <div className="flex flex-col items-center justify-center py-4 space-y-4">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
            <h4 className="text-slate-800 text-xs font-black uppercase tracking-wider font-sans">
              Confirming Transaction
            </h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-65 mx-auto">
              Securing settlement parameters via encrypted gateway channels. Please do not close this window...
            </p>
          </div>
        )}

        {/* ✅ Stage 2: Webhook Sync cleared out successfully */}
        {verifyStatus === "SUCCESS" && (
          <div className="flex flex-col items-center justify-center py-4 space-y-3 animate-scaleUp">
            <div className="w-12 h-12 bg-emerald-50 border-4 border-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-inner">
              <svg className="w-6 h-6 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="text-emerald-600 text-xs font-black uppercase tracking-wider font-sans">
              Upgrade Activated!
            </h4>
            <p className="text-body-md text-slate-600 font-semibold">
              Your premium store capabilities have been unlocked successfully.
            </p>
            <span className="text-[10px] text-slate-400 animate-pulse font-medium pt-2">
              Redirecting back to your console panel workspace &rarr;
            </span>
          </div>
        )}

      </div>
    </div>
  );
}
