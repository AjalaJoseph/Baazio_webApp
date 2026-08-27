import React  from 'react';
import api from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ResponsiveContainer, YAxis,XAxis,AreaChart, Tooltip, CartesianGrid, Area} from "recharts"
import { useState, useEffect } from "react";
import ProductDescriptionModal from '../components/ProductDescriptionModel';
export default function DashboardHome() {
  const navigate = useNavigate()
  //  get user data 
  const [userData, setUserData] = useState(null)
   const [salesData, setSalesData] = useState(null);
   const [topProductsData, setTopProductsData] = useState(null)
   const [weeklyRevenue, setWeeklyRevenue] = useState([])
   const [latestSales, setLatestSales] = useState([])
   const [staffCount, setStaffCount] = useState(0)
    const [usage, setUsage] = useState(null);
    const [paymentMethod, setPaymentMehod] = useState(null)
    const [selectedSalesId, setSelectedSalesId] = useState(null);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
   const accessToken = useAuthStore((state) => state.accessToken);
   const CHRONOLOGICAL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    useEffect(() => {
      const fetchDashboardTelemetry = async () => {
    if (!accessToken) {
      return;
    }
    try {
      // 4. FETCH DATA: Inject currentToken directly into headers (do NOT use async local state)
      const [userResponse,
         salesResponse, 
         productsResponse, 
         staffResponse,
         usageResponse, 
         weeklyOverviewResponse,
         paymentMethodSplitResponse,
         latestSalseResponse
        ] = await Promise.all([
          api.get("/auth/me", { headers: { Authorization: `Bearer ${accessToken}` } }),
          api.get('/sales/overview', { headers: { Authorization: `Bearer ${accessToken}` } }),
          api.get("/sales/top-products", { headers: { Authorization: `Bearer ${accessToken}` } }),
          api.get("/auth/all-staff",{ headers: { Authorization: `Bearer ${accessToken}` } }),
          api.get("/auth/subscription/usage",{ headers: { Authorization: `Bearer ${accessToken}` } }),
          api.get("/sales/weekly-overview", { headers: { Authorization: `Bearer ${accessToken}` } }),
          api.get("/sales/payment-splits", { headers: { Authorization: `Bearer ${accessToken}` } }),
          api.get("/sales/latest-sales", { headers: { Authorization: `Bearer ${accessToken}` } })
        ]);
        
        
       setUserData(userResponse.data.data);
        setSalesData(salesResponse.data.data);
        setTopProductsData(productsResponse.data.data)
        setStaffCount(staffResponse.data.data.length)
        setWeeklyRevenue(weeklyOverviewResponse.data.data.weeklyRevenue || [])
        setUsage(usageResponse.data.data)
        setPaymentMehod(paymentMethodSplitResponse.data.data)
        setLatestSales(latestSalseResponse.data.data)
        // console.log(latestSalseResponse.data.data)
    } catch (err) {
      console.error("Failed to fetch profile metadata:", err);
    }
  };

  fetchDashboardTelemetry();
}, [accessToken]);

// console.log(paymentMethod.cashPercentage)
// })
const initials = userData?.owner_name
  ? userData.owner_name
      .split(" ")
      .map(n => n[0])
      .join("")
  : "";

  // 📈 ROW 1 METRICS MATRIX DATA (Naira Currency Models)
const todayIncomeValue = Number(salesData?.daily?.total_income) || 0;
const todayIncome = todayIncomeValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2});
const weekIncomeValue = Number(salesData?.weekly?.total_income) || 0;
const weekIncome = weekIncomeValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2});
const monthIncomeValue = Number(salesData?.monthly?.total_income) || 0;
const monthIncome = monthIncomeValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2});
const yearIncomeValue = Number(salesData?.yearly?.total_income) || 0;
const yearIncome = yearIncomeValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2});

const handleOpenDescriptionDrawer = (id) => {
    setSelectedSalesId(id);
    setIsDescriptionOpen(true);
  };
  const primaryIncomeCards = [
    { 
      title: "TODAY'S INCOME", 
      value: `₦ ${todayIncome}`, 
      subtext: "Live updates active", 
      hasLiveIndicator: true 
    },
    { 
      title: "WEEKLY INCOME", 
      value: `₦ ${weekIncome}`, 
      subtext: "Monitored vs past week", 
      icon: (
        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    { 
      title: "MONTHLY INCOME", 
      value: `₦ ${monthIncome}`,
      subtext: "Revenue curve: Healthy", 
      badgeText: "📈 12.4%",
      badgeColor: "text-emerald-600 bg-emerald-50"
    },
    { 
      title: "FISCAL YEAR 2026", 
      value: `₦ ${yearIncome}`,
      subtext: "Telemetry active", 
      icon: (
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    }
  ];

const cash = paymentMethod?.cashPercentage ?? 0;
  const pos = paymentMethod?.posPercentage ?? 0;
  const transfer = paymentMethod?.transferPercentage ?? 0;
  // 🧾 BOTTOM DATA TABLE AUDIT LEDGER DATASTREAM MAP
  // 
  const maxSalesLimit= usage?.salesLimitAllowed || 300;
  const currentPlan = usage?.plan || "FREE_TRIAL";
  const currentSalesCount= usage?.salesUsedThisMonth || 0;
  const salesProgressPercent = maxSalesLimit==="UNLIMITED"?10:(currentSalesCount / maxSalesLimit) * 100
  const baselineGrid = CHRONOLOGICAL_DAYS.map(dayName => ({day: dayName, revenue: 0}));
  weeklyRevenue.forEach((item) =>{
    const matchedDayNode = baselineGrid.find(node => node.day === item.day_label);
    if (matchedDayNode) {
    // Overwrite the zero value with your actual live database total price integer
    matchedDayNode.revenue = Number(item.total_sales) || 0;
  }
  })
   const realVelocityData =baselineGrid

   const CustomChartTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface-highest text-on-surface-variant p-3 rounded-lg border border-[#cbd5e1] shadow-xl text-left font-sans select-none animate-fadeIn">
          <p className="text-[10px] font-black tracking-widest text-[#64748b] uppercase">
            Daily Gross Sales
          </p>
          <p className="text-[15px] font-black font-mono text-[#0f172a] mt-0.5">
            ₦{Number(payload[0].value).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };
  return (
    <div className="w-full min-h-screen flex flex-col gap-2 text-left select-none  font-sans pb-12 bg-[#f8fafc] ">
      
      {/* ========================================================================= */}
      {/* 📑 SECTION HEADER OPERATIONS MODULE */}
      {/* ========================================================================= */}
      <div className="w-full bg-surface-lowest flex px-6 pt-3  sm:flex-row items-start sm:items-center justify-between   gap-4 border-b border-slate-400 pb-3">
        <h1 className="text-headline-md text-on-surface  font-sans">Overview Dashboard</h1>
         <button  type="button" onClick={()=>navigate("/admin-dashboard/profile")} className="inline-flex items-center justify-center p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer group shadow-xs select-none"
             aria-label="Open user account profile settings menu">
            <div className="w-9 h-9 rounded-full bg-primary text-white border border-blue-400/20 flex items-center justify-center font-bold font-sans text-[13px] uppercase shrink-0 shadow-md transition-transform duration-200 group-hover:scale-95">
                {initials}
            </div>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 📊 ROW 1: THE 4-COLUMN FINANCIAL SUMMARY METRICS GRID */}
      {/* ========================================================================= */}
      <div className='w-full flex-1 bg-[#f8fafc] px-6 py-6 flex flex-col gap-6'>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ">
                {primaryIncomeCards.map((card, idx) => (
                <div key={idx} className=" bg-surface-lowest border border-slate-400 rounded-md p-4 shadow-xs flex flex-col  relative overflow-hidden group hover:border-slate-300 transition-colors">
                    <div className="flex items-center justify-between   tracking-wider  uppercase">
                    <span className='font-sans text-slate-400 text-[14px] font-medium'>{card.title}</span>
                    {card.hasLiveIndicator && (
                        <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                    )}
              {card.icon}
              {card.badgeText && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${card.badgeColor}`}>
                  {card.badgeText}
                </span>
              )}
            </div>
            <div className="text-[23px] font-semibold text-on-surface-variant tracking-tight font-mono my-0.5">
              {card.value}
            </div>
            <div className="text-label-md text-on-surface-variant/80 ">
              {card.subtext}
            </div>
          </div>
        ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Telemetry Card A: Connected Terminal Cashiers */}
        <div className="bg-white h-28 border border-slate-400 rounded-md p-4 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-primary-fixed-dim/50 border border-primary-fixed-dim/50 rounded-full flex items-center justify-center text-blue-600 shrink-0">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex flex-col text-left gap-2">
            <p className="text-label-lg  text-slate-800 font-sans">Connected Terminal Nodes</p>
            <p className="text-[16px] text-slate-500 mt-1.5 leading-none">{staffCount} staffs Registers</p>
          </div>
        </div>

        {/* Telemetry Card B: System Issue Counts Fragment Logs */}
       <div className="bg-white h-28 border border-slate-400 rounded-md p-4 flex items-center gap-4 shadow-sm w-full">
  {/* 1. Payment Method Distribution Mini Stack */}
    <div className="w-12 h-12 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center text-amber-600 shrink-0">
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  </div>
  
  {/* 2. Structured Payment Methods Split Text Metrics */}
  <div className="flex flex-col gap-1.5 text-left w-full">
    <p className="text-label-lg font-bold text-slate-800 font-sans">Payment Breakdown</p>
    
    {/* Micro segmented distribution percentage bar visual anchor */}
    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
      {/* Cash segment (e.g., 60%) */}
      <div className="h-full bg-emerald-500 transition-all duration-500 ease-out" style={{ width: `${cash}%` }} title={`Cash: ${cash}%`} />
      {/* POS segment (e.g., 30%) */}
      <div className="h-full bg-blue-500 transition-all duration-500 ease-out" style={{ width: `${pos}%` }} title={`POS: ${pos}%`} />
      {/* Transfer segment (e.g., 10%) */}
      <div className="h-full bg-amber-500 transition-all duration-500 ease-out" style={{ width: `${transfer}%` }} title={`Transfer: ${transfer}%`} />
    </div>
    
    {/* Text Legends Labels mapping context */}
    <div className="flex flex-row items-center gap-3 text-[13px] text-slate-500 leading-none font-medium">
      <p className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 block"></span>{cash}% Cash</p>
      <p className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 block"></span>{pos}% POS</p>
      <p className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 block"></span>{transfer}% Trf</p>
    </div>
  </div>
</div>


        {/* Telemetry Card C: Platform Membership Limits Quota Progress Bar */}
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
      
      {/* ========================================================================= */}
      {/* 📊 ROW 3: SPLIT DATA GRID LAYOUT (VELOCITY CHART PANEL & PRODUCT ROW) */}
              {/* ========================================================================= */}
      {/* 📊 ROW 3: SPLIT DATA GRID LAYOUT (VELOCITY CHART PANEL & PRODUCT ROW)     */}
      {/* ========================================================================= */}
      

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
        
        {/* Left Aspect Box Frame: Performance Distribution Velocity Stream Chart */}
                {/* 📊 LEFT ASPECT BOX FRAME: LIVE PERFORMANCE DISTRIBUTION VELOCITY CHART */}
        <div className="lg:col-span-2 bg-white border border-slate-400 rounded-md p-5 shadow-sm flex flex-col justify-between">
          
          {/* Header Metadata Section Row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col text-left">
              <h3 className="text-headline-md font-bold text-slate-800 tracking-tight">
                Revenue Spikes & Daily Income Velocity
              </h3>
              <p className="text-label-md text-slate-400 mt-2">
                Real-time performance distribution
              </p>
            </div>
            {/* Visual Indicator Dots from original mockup layout */}
            <div className="flex items-center gap-1.5 select-none">
              <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-primary/50"></span>
            </div>
          </div>
          
          {/* 🚀 REAL RECHARTS INJECTION CANVAS CONTAINER */}
          <div className="flex-1 w-full min-h-60 mt-2 select-none">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={realVelocityData}
                margin={{ top: 10, right: 10, left: -22, bottom: 0 }}
              >
                {/* 💎 BRAND SIGNATURE VECTOR AREA GRADIENT FILL TRANSITION */}
                <defs>
                  <linearGradient id="bizflowRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2" stopOpacity={0.20}/>
                    <stop offset="95%" stopColor="#2152ff" stopOpacity={0.00}/>
                  </linearGradient>
                </defs>

                {/* Lightweight alignment layout guideline bars */}
                <CartesianGrid strokeDasharray="3 3" stroke="#e1e2ed" vertical={false} />

                {/* X-Axis labels tracking parameters typography */}
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={true} 
                  tick={{ fill: '#434655', fontSize: 14, fontWeight: 500, fontFamily: 'sans-serif' }}
                />

                {/* Y-Axis currency labels compression filter */}
                <YAxis 
                  axisLine={false} 
                  tickLine={true} 
                  tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 400, fontFamily: 'monospace' }}
                  tickFormatter={(val) => `₦${val / 1000}k`}
                />

                {/* 👁️ HOVER INTERACTION COMPONENT INTERCEPTOR TOOLTIP */}
                <Tooltip 
                  cursor={{ stroke: '#cbd5e1', strokeWidth: 1.5, strokeDasharray: '4' }}
                  content={CustomChartTooltip}
                />

                {/* The actual Area rendering element link */}
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2152ff" // Locked to your royal blue signature hex
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#bizflowRevenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

        </div>


        {/* Right Aspect Box Frame: Itemized Top Performance Items Column */}
        <div className="bg-surface-lowest border border-slate-400 rounded-md p-5 shadow-sm flex flex-col justify-between">
          <h3 className="text-label-md  tracking-wider text-on-surface-variant uppercase mb-4 ">
            TOP PERFORMANCE VELOCITY ITEMS
          </h3>
          
          <div className="flex flex-col gap-3 flex-1 justify-center">
            {topProductsData && topProductsData.length > 0 ? (
            topProductsData?.map((product, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-slate-300 pb-2.5 last:border-0 last:pb-0">
                <div className="flex flex-col text-left">
                  <p className="text-[13px] font-bold text-on-surface-variant leading-tight">{product.productName}</p>
                  <p className="text-[11.5px] text-slate-400 mt-1.5 leading-none">{product.totalQuantitySold} Units Sold</p>
                </div>
                <div className="flex flex-col items-end font-mono">
                  <p className="text-[13px] font-bold text-slate-800 leading-tight">₦{product.totalIncomeGenerated.toFixed(2)}</p>
                  {/* <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm mt-1 leading-none ${product.color}`}>
                    {product.change}
                  </span> */}
                </div>
              </div>
            ))):(
               <div className="w-full py-8 text-center select-none font-sans bg-white flex flex-col items-center justify-center space-y-3 animate-scaleUp">
    
    {/* Clean gray shopping bag icon badge */}
    <div className="w-10 h-10 bg-slate-50 border border-slate-200/50 text-slate-400 rounded-xl flex items-center justify-center shadow-3xs">
      <svg className="w-5 h-5 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zI" />
      </svg>
    </div>

    {/* Direct, clear English messaging labels */}
    <div className="space-y-0.5 max-w-70">
      <h4 className="text-on-surface-variant text-sm font-black uppercase tracking-tight">
        No Products Sold Yet
      </h4>
      <p className="text-xs text-slate-500 font-medium leading-relaxed">
        Your top-selling items will appear here automatically as soon as cashiers start processing customer checkouts at the counters.
      </p>
    </div>

  </div>
            )}
          </div>

          <button type="button" onClick={() =>navigate("/admin-dashboard/view-inventory")} className="w-full h-9 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-[12px] font-bold rounded-lg transition-colors mt-4 cursor-pointer flex items-center justify-center">
            View Full Inventory Analytics
          </button>
        </div>

      </div>
      {/* ========================================================================= */}
      {/* 📊 ROW 4: HIGHEST-FIDELITY TRANSACTION AUDIT LOG FEED TABLE LEDGER        */}
      {/* ========================================================================= */}
      <div className="w-full bg-surface-lowest border border-slate-400 rounded-md p-5 shadow-xs flex flex-col gap-4">
        
        {/* Table Title and Operation Buttons Row */}
        <div className="w-full flex flex-col  items-center justify-center gap-3 border-b border-slate-300 pb-3">
          <div className="flex flex-col gap-1 items-center">
            <h3 className="text-headline-md  text-slate-800 tracking-tight">Recent Terminal Sales Feed & Audit Logs Ledger</h3>
            <p className="text-body-sm text-slate-400">Transaction integrity verified across all active node layers</p>
          </div>
          {/* <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
            <button type="button" className="h-8 px-2.5 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg text-[11px] font-bold text-slate-600 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <span>Export PDF Summary</span>
            </button>
            <button type="button" className="h-8 px-2.5 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg text-[11px] font-bold text-slate-600 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <span>Stream CSV Log Sheets</span>
            </button>
          </div> */}
        </div>

        {/* Responsive Scrolling Data Frame Canvas */}
        <div className="w-full max-w-full overflow-x-auto rounded-md border border-slate-100 bg-white">
      <table className="w-full min-w-175 border-collapse text-left text-[12.5px]">
        <thead>
          <tr className="h-10 bg-slate-200 border-b border-slate-200/80 font-bold font-sans text-on-surface-variant text-[11px] uppercase tracking-wider select-none">
            <th className="px-4 py-2 font-bold tracking-wider whitespace-nowrap">
              TERMINAL CASHIER
            </th>
            <th className="px-4 py-2 font-bold tracking-wider whitespace-nowrap">
              PAYMENT METHOD
            </th>
            <th className="px-4 py-2 font-bold tracking-wider text-center whitespace-nowrap">
              FINAL AMOUNT
            </th>
            <th className="px-4 py-2 font-bold tracking-wider text-right whitespace-nowrap">
              TIMESTAMP
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">

          {latestSales && latestSales.length > 0 ? (

            latestSales.map((tx) => (

              <tr
                key={tx.id}
                onClick={() => handleOpenDescriptionDrawer(tx.id)}
                className="h-11 hover:bg-slate-50/40 transition-colors cursor-pointer"
              >

                {/* Cashier */}
                <td className="px-4 py-3 text-body-sm font-sans whitespace-nowrap">
                  {String(tx.recorded_by).toLocaleUpperCase()}
                </td>

                {/* Payment Method */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`
                      inline-flex items-center
                      text-[10px]
                      font-bold
                      px-2.5
                      py-0.5
                      rounded-full
                      select-none
                      tracking-wide
                      whitespace-nowrap
                      ${
                        tx.payment_method === "CARD"
                          ? "bg-blue-50 text-blue-600 border border-blue-100"
                          : tx.payment_method === "CASH"
                            ? "bg-slate-100 text-slate-700 border border-slate-200"
                            : "bg-indigo-50 text-indigo-600 border border-indigo-100"
                      }
                    `}
                  >
                    {tx.payment_method}
                  </span>
                </td>

                {/* Amount */}
                <td className="pl-6  py-3 text-center font-mono font-bold text-slate-800 select-text whitespace-nowrap">
                  ₦{Number(tx.total_amount)?.toFixed(2)}
                </td>

                {/* Timestamp */}
                <td className="px-4 py-3 text-right text-slate-500 font-sans font-medium select-text whitespace-nowrap">
                  {tx?.createdAt
                    ? new Date(tx.createdAt).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : ""}
                </td>

              </tr>

            ))

          ) : (

            <tr>
              <td
                colSpan={4}
                className="p-10 text-center select-none font-sans bg-white"
              >
                <div className="flex flex-col items-center justify-center max-w-xs mx-auto space-y-3 animate-scaleUp">

                  {/* Empty State Icon */}
                  <div className="w-10 h-10 bg-slate-50 border border-slate-200/60 text-slate-400 rounded-xl flex items-center justify-center shadow-3xs">
                    <svg
                      className="w-5 h-5 stroke-[2.2]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.75 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                      />
                    </svg>
                  </div>

                  {/* Empty State Text */}
                  <div className="space-y-0.5">
                    <h4 className="text-slate-800 text-sm font-black uppercase tracking-tight">
                      No Recent Sales Found
                    </h4>

                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      Your live transaction stream ledger is empty. Real-time
                      receipts will show up here as soon as cashiers start ringing
                      up items at the counter register.
                    </p>
                  </div>

                </div>
              </td>
            </tr>

          )}

        </tbody>
      </table>
    </div>

        {/* Historical Back-log Link Trigger text */}
        {/* <button type="button" className="text-center text-[12.5px] font-bold text-[#2152ff] hover:underline mt-2 self-center cursor-pointer focus:outline-none">
          Access Full Historical Audit Ledger (2024-2026)
        </button> */}

      </div>
       <ProductDescriptionModal 
              isOpen={isDescriptionOpen}
              salesId={selectedSalesId}
              accessToken={accessToken}
              onClose={() => {
                setIsDescriptionOpen(false);
                setSelectedSalesId(null); 
              }}
            />
      </div>
    </div>
  );
}
