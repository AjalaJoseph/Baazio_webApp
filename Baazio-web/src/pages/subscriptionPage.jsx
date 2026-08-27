import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../api/axiosClient';
export default function BillingSubscriptionPage() {
  // 🧭 INTERACTIVE STATE FOR SUBSCRIPTION SIMULATIONS
  // const [currentPlan, setCurrentPlan] = useState("PRO"); // "BASIC" | "PRO"
  const [isProcessingPaystack, setIsProcessingPaystack] = useState(false);
  const [planSelected, setPlanSelected] = useState("")
   const [usage, setUsage] = useState({})
   const [planExpiredDate, setPlanExpireDate] = useState("")
   const accessToken = useAuthStore((state) => state.accessToken)
   const currentDate = new Date()
  // 📦 INLINE PAYMENT RECORDS snapshot
useEffect(() =>{
  const getuserPlan = async () =>{
    try{
      const response = await api.get("/auth/subscription/usage",{ headers: { Authorization: `Bearer ${accessToken}` } })
        
        if (response.data?.data) {
          const payload = response.data.data;
          setUsage(payload);
          setPlanExpireDate(payload.plan_expire || ""); // Safe: Updates state exactly ONCE inside the async handler [S4]
        }
      } catch (error) {
        console.error("User plan data get error ", error);
        console.log(error?.response?.data.message)
      }
    
  }
   getuserPlan()
}, [accessToken])

const maxSalesLimit= usage?.salesLimitAllowed || 300;
  const currentPlan = usage?.plan || "FREE_TRIAL";
  const currentSalesCount= usage?.salesUsedThisMonth || 0;
   const salesProgressPercent = maxSalesLimit > 0 
    ? Math.min((currentSalesCount / maxSalesLimit) * 100, 100) 
    : 0;
  // setPlanExpireDate(usage?.plan_expire)

  const handleTriggerPaystackPayment = async (plan_name) => {
    setIsProcessingPaystack(true);
    try {
      console.log(`Initializing secure Paystack transactional gate framework ${plan_name} redirect...`);
      setPlanSelected(plan_name)
      const dynamicCallbackUrl = `${window.location.origin}/admin-dashboard/billing/verify`;
      await new Promise(resolve => setTimeout(resolve, 1500));
      const plan_price = plan_name ==="BASIC_PLAN"?5000:10000
      const response = await api.post("/subscribe", {
        plan_name:plan_name,
        callback_url: dynamicCallbackUrl
      })
      const checkoutUrl = response.data?.data?.authorization_url;

      if (checkoutUrl) {
        console.log(`Redirecting browser window to Paystack host: ${checkoutUrl}`);
        
        // 🚀 ROUTE IMMEDIATELY: Seamlessly transitions your user to the live encrypted Paystack card form
        window.location.href = checkoutUrl;
      } else {
        alert("API Error: Secure checkout address was missing from the server payload.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessingPaystack(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col gap-2 text-left select-none  font-sans pb-12 bg-[#f8fafc] ">
      {/* 🟢 TOP CONTEXT SYSTEM BAR HEADER */}
       <div className="w-full bg-surface-lowest flex px-6 pt-3  sm:flex-row items-start sm:items-center justify-between   gap-4 border-b border-slate-400 pb-3">
        <div>
          <h2 className="text-headline-md text-slate-700 font-sans tracking-tight">Billing & Subscription</h2>
        </div>
        
        {/* Right Element System Navigation Accessories */}
        <div className="flex items-center gap-4 self-start sm:self-auto shrink-0">
          <div className="hidden lg:inline-flex md:inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black tracking-widest uppercase rounded-full border border-emerald-100/50 shadow-3xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block animate-pulse" />
            System Telemetry: Healthy
          </div>
        
        </div>
      </div>

      {/* 💳 CARD 1: EXECUTED ACTIVE CONSUMPTION STATS BANNER */}
      <div className="px-6 mt-5">

      <div className="w-full bg-surface-lowest border border-slate-400 rounded-md p-6 shadow-xs space-y-5 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-[22px] font-semibold   text-on-surface font-sans tracking-tight">
              Your Workspace Current Subscription Status: <span className="text-primary-container text-label-md">{currentPlan}</span>
            </h3>
            <div className="text-body-md text-slate-500  font-sans flex flex-col lg:flex-row md:flex-row gap-2">
              Next renewal payment date billing parameter: <span className="text-on-surface font-semibold font-sans">
                {
                  new Date(planExpiredDate) < new Date(currentDate) ? (
                    <p className="text-xs font-black text-red-500 bg-red-50 border border-red-100 rounded-lg px-2.5 py-1 inline-flex items-center gap-1  tracking-wider select-none animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      Plan Expired
                    </p>
                  ) : (
                    <span className="font-mono font-bold text-slate-700 bg-slate-100 border border-slate-200/60 rounded-lg px-2.5 py-1 text-xs select-none">
                      {new Date(planExpiredDate).toLocaleDateString('en-NG', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                  )
                }
              </span>
            </div>
          </div>
          
          
        </div>

        {/* Dynamic Matrix Consumption Bar Slider */}
         <div className="bg-white border border-slate-400 rounded-md p-4 flex flex-col justify-center gap-1.5 shadow-xs font-sans">
            
            <div className="flex flex-row items-center justify-between text-[13px] font-bold text-slate-800">
              {/* 🎯 CONDITION A: Swap text tracking metrics based on limit parameters */}
              <p>
                {maxSalesLimit === "UNLIMITED" 
                  ? "Unlimited Sales Tracking" 
                  : `${salesProgressPercent.toFixed(1)}% Sales Quota Used`}
              </p>
              
              {/* Dynamic Theme Color Badge based on active status tier */}
              <p className={`text-[9.5px] uppercase tracking-wider font-black px-2 py-0.5 rounded font-mono ${
                currentPlan === 'PRO_PLAN' 
                  ? 'bg-blue-50 text-primary' 
                  : currentPlan === 'BASIC_PLAN' 
                  ? 'bg-amber-50 text-amber-600' 
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {currentPlan === 'PRO_PLAN' ? 'UNLIMITED PRO' : currentPlan === 'BASIC_PLAN' ? 'BASIC PLAN' : 'FREE TRIAL'}
              </p>
            </div>

            {/* Progress Bar Track frame wrapper */}
            <div className="w-full h-2 bg-slate-300 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  currentPlan === 'pro' ? 'bg-primary-container' : salesProgressPercent > 85 ? 'bg-red-500' : 'bg-[#2152ff]'
                }`} 
                style={{ width: `${salesProgressPercent}%` }}
              ></div>
            </div>

            {/* 🎯 CONDITION B: Dynamic context helper subtext messages string */}
            <p className="text-label-md text-slate-500  text-left">
              {maxSalesLimit === Infinity 
                ? `Logged ${currentSalesCount.toLocaleString()} total store transactions.` 
                : `${currentSalesCount.toLocaleString()} of ${maxSalesLimit.toLocaleString()} orders logged.`}
            </p>

          </div>
      </div>

      {/* 📦 PRICING SCHEMAS SECTION: TWO SPLIT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch w-full mb-4 px-6">
        
        {/* CARD A: BASIC SERVICE LOGISTICS */}
        <div className="bg-surface-lowest border border-slate-400 rounded-md p-6 flex flex-col justify-between shadow-2xs space-y-8 relative">
          <div className="space-y-6 text-left">
            <div>
              <h4 className="text-headline-md text-on-surface font-sans tracking-tight">Basic Plan</h4>
              <p className="text-sm text-slate-500 font-medium leading-relaxed mt-1 max-w-70">
                Perfect for single checkpoint convenience kiosks and small neighborhood corners.
              </p>
            </div>

            {/* Currency Price Stamp */}
            <div className="text-2xl sm:text-3xl font-black text-slate-800 font-mono tracking-tight flex items-baseline gap-1">
              ₦5,000.00
              <span className="text-xs font-bold text-slate-500 tracking-normal font-sans">/ per month</span>
            </div>

            {/* Bullet Constraints List */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-400">
                <svg className="w-5 h-5 text-emerald-500 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                <span className='text-slate-600 text-label-md'>Up to <span  className='text-primary-container'>2,000</span> transactions</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-bold text-slate-400">
                <svg className="w-5 h-5 text-emerald-500 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                <span className='text-slate-600 text-label-md font-sans'> <span className='text-primary-container'>5</span> registered profiles</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-400/80">
                <svg className="w-3.5 h-3.5 text-slate-300 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                <span className="font-sans tracking-tight">Reports LOCKED <span className=" text-slate-400/80 text-body-sm font-sans ml-0.5">(No PDF/CSV)</span></span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-400">
                <svg className="w-4 h-4 text-emerald-500 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                <span className='text-slate-600 text-label-md font-sans'>Standard speed</span>
              </div>
            </div>
          </div>

          <button type="button" disabled={planSelected==="BASIC_PLAN" && isProcessingPaystack} onClick={() =>handleTriggerPaystackPayment("BASIC_PLAN")} className="w-full h-11 border border-slate-400 bg-surface-high text-on-surface text-label-md font-bold rounded-lg">
            {planSelected==="BASIC_PLAN" && isProcessingPaystack ? "Processing..." : "Activate Plan ➔" }
          </button>
        </div>

               {/* CARD B: PRO GROWTH PREMIUM ACCENT NODE */}
        <div className="bg-white border-2 border-primary rounded-2xl p-8 flex flex-col justify-between shadow-sm shadow-blue-50/50 space-y-8 relative">
          
          {/* Floating Bubble RECOMMENDED Banner Ribbon */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-full shadow-2xs border border-blue-500">
            RECOMMENDED
          </div>

          <div className="space-y-6 text-left">
            <div>
              <h4 className="text-headline-md  text-on-surface tracking-tight">Pro Growth Plan</h4>
              <p className="text-body-sm text-slate-500 font-medium leading-relaxed mt-1 max-w-70">
                Engineered for high-volume supermarkets requiring enterprise resilience.
              </p>
            </div>

            {/* Currency Price Stamp */}
            <div className="text-2xl sm:text-3xl font-black text-blue-600 tracking-tight flex items-baseline gap-1">
              ₦10,000.00
              <span className="text-sm font-bold text-slate-500 tracking-normal font-sans">/ per month</span>
            </div>

            {/* Bullet Constraints List */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600">
                <svg className="w-4 h-4 text-emerald-500 stroke-[2.5] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span><strong className="text-slate-800">Unlimited</strong> checkouts</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600">
                <svg className="w-4 h-4 text-emerald-500 stroke-[2.5] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span><strong className="text-slate-800">Unlimited</strong> profiles</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600">
                <svg className="w-4 h-4 text-emerald-500 stroke-[2.5] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span><strong className="text-blue-600 font-black">UNLOCKED</strong> Reports (PDF & CSV)</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600">
                <svg className="w-4 h-4 text-emerald-500 stroke-[2.5] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Blistering speed</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600">
                <svg className="w-4 h-4 text-emerald-500 stroke-[2.5] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Idempotency protection</span>
              </div>
            </div>
          </div>

          {/* Secure Payment Gateway Trigger Button */}
          <button 
            type="button" 
            disabled={planSelected==="PRO_PLAN" && isProcessingPaystack}
            onClick={() =>handleTriggerPaystackPayment("PRO_PLAN")}
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-surface-lowest text-label-md  rounded-lg transition-all shadow-md shadow-blue-100 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {planSelected==="PRO_PLAN" && isProcessingPaystack ? "Processing..." : "Upgrade To Pro ➔" }
          </button>
          
        </div> {/* ✅ Closes Card B Container */}
              {/* 🧾 CARD 3: INVOICE TABLE SNAPSHOT AND ENTERPRISE CTA GRID */}
      
    </div> 
    </div>
    </div>

  );
}
