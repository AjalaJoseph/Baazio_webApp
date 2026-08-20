import React, { useState, useMemo, useEffect } from 'react';
import api from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import AlertModal from '../components/alert';
export default function DownloadReportsPage() {
  const navigate = useNavigate()
  // 🧭 INTERACTIVE STATE LAYERS
  const [selectedFormat, setSelectedFormat] = useState("PDF Document");
  const [isCompiling, setIsCompiling] = useState(false);
  const [signupDateStr, setSignupDateStr] = useState("");
  const [uploadError, setUploadError] = useState("")
    const accessToken = useAuthStore((state) => state.accessToken);
    const setAuthSession = useAuthStore((state) => state.setAuthSession);
  // 📦 DATA ARCHIVE MATRIX MOCKUP LOGS
  const [modalConfig, setModalConfig] = useState({
      isOpen: false,
      type: "success",
      title: "",
      message: "",
      actionLabel: ""
    });
  const [archiveLogs, setArchiveLogs] = useState(() => {
  try {
    const cachedLogs = localStorage.getItem("baazio_report_session_logs");
    
    if (!cachedLogs) return [];
    const parsedLogs = JSON.parse(cachedLogs);
    const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
    return parsedLogs.filter(log => new Date(log.timestamp).getTime() > twentyFourHoursAgo);
  } catch (err) {
    console.error("Failed to parse localized report cache stores:", err);
    return [];
  }
});
  const signupDate = new Date(signupDateStr);
  const today = new Date();

// 🧭 SEPARATE INTERACTIVE STATE FILTERS
const [selectedDuration, setSelectedDuration] = useState("Weekly Report"); // "Weekly Report" | "Monthly Report" | "Yearly Report"
const [targetYear, setTargetYear] = useState("");   // e.g., "2026"
const [targetMonth, setTargetMonth] = useState(""); // e.g., "06"
const [targetWeek, setTargetWeek] = useState("");   // e.g., "W3"

  const handleCloseModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }));

useEffect(() =>{
  const getRegisterDate = async () =>{
    const getUserData = await api.get("/auth/me", { headers: { Authorization: `Bearer ${accessToken}` } })
    setSignupDateStr(getUserData?.data?.data?.createdAt)
  }
  getRegisterDate()
}, [accessToken])
// 📅 1. YEAR LIST SELECTOR (Filters years strictly from signup up to current date)
const availableYears = useMemo(() => {
  const years = [];
  const startYear = signupDate.getFullYear();
  const currentYear = today.getFullYear();

  for (let y = currentYear; y >= startYear; y--) {
    years.push({ value: String(y), label: `${y} Fiscal Year` });
  }
  return years;
}, [signupDate]);

// 📅 2. MONTH LIST SELECTOR (Filters months dynamically based on the selected year)
const availableMonths = useMemo(() => {
  if (!targetYear) return [];
  const months = [];
  const yearInt = parseInt(targetYear);

  // Bounds calculations based on workspace registration thresholds
  const startMonth = yearInt === signupDate.getFullYear() ? signupDate.getMonth() : 0;
  const endMonth = yearInt === today.getFullYear() ? today.getMonth() : 11;

  for (let m = endMonth; m >= startMonth; m--) {
    const dummyDate = new Date(yearInt, m, 1);
    const label = dummyDate.toLocaleDateString('en-NG', { month: 'long' });
    const value = String(m + 1).padStart(2, '0'); // "01", "02", etc.
    months.push({ value, label });
  }
  return months;
}, [targetYear, signupDate]);

// 📅 3. WEEK LIST SELECTOR (Generates clean, human-readable date spans for that specific month)
const availableWeeks = useMemo(() => {
  if (!targetYear || !targetMonth) return [];

  const year = parseInt(targetYear);
  const month = parseInt(targetMonth);
  const options = [];
  
  // ⏱️ THE LIVE TIME CEILING
  const today = new Date(); 

  const firstOfMonth = new Date(year, month - 1, 1);
  const lastOfMonth = new Date(year, month, 0); 
  let runningStart = new Date(firstOfMonth);

  // ALIGN TO MONDAY
  const dayOfWeek = runningStart.getDay();
  if (dayOfWeek !== 1) {
    runningStart.setDate(runningStart.getDate() + (dayOfWeek === 0 ? 1 : 8 - dayOfWeek));
  }

  if (runningStart.getDate() > 1) {
    runningStart.setDate(runningStart.getDate() - 7);
  }

  let weekCounter = 1;

  while (runningStart <= lastOfMonth) {
    const startOfWeek = new Date(runningStart);
    
    // =========================================================================
    // 🎯 THE FUTURE WEEK BLOCKER (THE EXACT FIX)
    // =========================================================================
    // If the starting day of this week row sits in the future, kill the loop!
    // For Week 5 (Aug 24), this evaluates to true and stops the loop instantly.
    if (startOfWeek > today) {
      console.log(`🏁 Week ${weekCounter} starts in the future. Stopping dropdown list.`);
      break; 
    }

    const endOfWeek = new Date(runningStart);
    endOfWeek.setDate(runningStart.getDate() + 6);

    const startDayNum = startOfWeek.getDate();
    const startMonthLabel = startOfWeek.toLocaleDateString('en-NG', { month: 'short' });
    
    const endDayNum = endOfWeek.getDate();
    const endMonthLabel = endOfWeek.toLocaleDateString('en-NG', { month: 'short' });

    const dateRangeLabel = startMonthLabel === endMonthLabel
      ? `${startMonthLabel} ${startDayNum} – ${endDayNum}`
      : `${startMonthLabel} ${startDayNum} – ${endMonthLabel} ${endDayNum}`;

    const label = `Week ${weekCounter} (${dateRangeLabel})`;
    const value = `W${weekCounter}`;

    options.push({ value, label });

    runningStart.setDate(runningStart.getDate() + 7);
    weekCounter++;
  }

  return options;
}, [targetYear, targetMonth]);

   const calculateFrontendWeekBounds = (targetYear, targetMonth, targetWeek) => {
  const year = parseInt(targetYear);
  const month = parseInt(targetMonth);
  const weekNum = parseInt(targetWeek.replace("W", "")); 
  
  const startDate = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const dayOfWeek = startDate.getDay(); 
  
  if (dayOfWeek !== 1) {
    startDate.setDate(startDate.getDate() + (dayOfWeek === 0 ? 1 : 8 - dayOfWeek));
  }
  if (startDate.getDate() > 1) {
    startDate.setDate(startDate.getDate() - 7);
  }
  
  startDate.setDate(startDate.getDate() + (weekNum - 1) * 7);
  startDate.setHours(0, 0, 0, 0);
  
  // =========================================================================
  // 🎯 THE TIME CLAMP FIX: SNAP TO END OF TODAY
  // =========================================================================
  // Instead of using the live clock time, force the ceiling to 23:59:59.999 [S4]
  const currentDateNow = new Date(); 
  currentDateNow.setHours(23, 59, 59, 999); 

  const standardSevenDayEnd = new Date(startDate.getTime() + (7 * 24 * 60 * 60 * 1000) - 1);
  const lastDayOfCurrentMonth = new Date(
    startDate.getFullYear(), 
    startDate.getMonth() + 1, 
    0, 
    23, 59, 59, 999
  );

  // Math.min evaluates safely now, matching your calendar rows exactly!
  const endDate = new Date(
    Math.min(
      standardSevenDayEnd.getTime(), 
      lastDayOfCurrentMonth.getTime(),
      currentDateNow.getTime() 
    )
  );

  const formatToDatabaseTimestamp = (dateObj) => {
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const hh = String(dateObj.getHours()).padStart(2, '0');
    const min = String(dateObj.getMinutes()).padStart(2, '0');
    const ss = String(dateObj.getSeconds()).padStart(2, '0');
    
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`; 
  };

  return {
    startIsoString: formatToDatabaseTimestamp(startDate), 
    endIsoString: formatToDatabaseTimestamp(endDate)     
  };
};

  // 🚀 TRIGGER COMPILATION ENGINE SUBMIT HANDSHAKE
  const handleGenerateReport = async () => {
    setIsCompiling(true);
    try {
        if (!targetYear) {
        setUploadError("Validation Error: Please choose a target calendar year first.");
        return;
        }
        if (selectedDuration !== "Yearly Report" && !targetMonth) {
            setUploadError("Validation Error: Please specify a target operating month.");
            return;
        }
        if (selectedDuration === "Weekly Report" && !targetWeek) {
            setUploadError("Validation Error: Please select a target week date window.");
            return;
        }

        let finalStartIso = "";
        let finalEndIso = "";

  // 📐 RUN FRONTEND TIMELINE CONVERSIONS
        if (selectedDuration === "Weekly Report") {
            // Fire our new week calculator function block
            const { startIsoString, endIsoString } = calculateFrontendWeekBounds(targetYear, targetMonth, targetWeek);
            finalStartIso = startIsoString;
            finalEndIso = endIsoString;
        } 
        else if (selectedDuration === "Monthly Report") {
            const year = parseInt(targetYear);
            const month = parseInt(targetMonth);
            
            finalStartIso = new Date(year, month - 1, 1, 0, 0, 0, 0).toISOString();
            finalEndIso = new Date(year, month, 0, 23, 59, 59, 999).toISOString(); // Day 0 rolls back to month end
        } 
        else if (selectedDuration === "Yearly Report") {
            const year = parseInt(targetYear);
            
            finalStartIso = new Date(year, 0, 1, 0, 0, 0, 0).toISOString();
            finalEndIso = new Date(year, 11, 31, 23, 59, 59, 999).toISOString();
          
        }
        setIsCompiling(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
        const downloadReport = selectedFormat === "PDF Document"? await api.get(`/download-report/pdf?startDate=${finalStartIso}&endDate=${finalEndIso}`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        ):await api.get(`/download-report/csv?startDate=${finalStartIso}&endDate=${finalEndIso}`,
            { headers: { Authorization: `Bearer ${accessToken}` } } )
        
       const download_id = downloadReport?.data?.jobId || ""
      const freshLogItem = {
      id: download_id, // Use the real backend jobId as the row identifier key token
      range: selectedDuration === "Weekly Report" 
        ? `${targetMonth} Week ${targetWeek.replace("W", "")}` 
        : `${selectedDuration.split(" ")[0]} Summary`,
      format: selectedFormat.includes("PDF") ? "PDF" : "CSV",
      status: "PROCESSING" ,
      timestamp: new Date().toISOString()
    };
    setArchiveLogs((prev) => [freshLogItem, ...prev]);
    const checkIntervalTime = 2000;
    
    const statusPollInterval = setInterval(async () => {
      try {
  const isPdf = selectedFormat === "PDF Document";
  const statusCheckResponse = await api.get(`/report-download-status/${download_id}/${isPdf ? 'pdf' : 'csv'}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  const download_status = statusCheckResponse?.data?.status?.toLowerCase();
  console.log(`Polling status loop for background Job ID [${download_id}]: ${download_status}`);
  if (download_status === "processing") {
    return;
  }

  if (download_status === "success" || download_status === "completed") {
    clearInterval(statusPollInterval); 
    // 🔥 LIVE STATUS RE-MAPPING: Swap status string from PROCESSING to COMPLETED instantly!
    setArchiveLogs((prevList) =>
      prevList.map((row) =>
        row.id === download_id ? { ...row, status: "COMPLETED" } : row
      )
    );
    setIsCompiling(false);
  } 
  
  // 4. ❌ CRASH/FAILURE INTERCEPTION (Crucial to prevent infinite network polling leaks)
  else if (download_status === "failed" || download_status === "error") {
    clearInterval(statusPollInterval); // Hard stop the background interval clock
    setIsCompiling(false);

    setArchiveLogs((prevList) =>
      prevList.map((row) =>
        row.id === download_id ? { ...row, status: "FAILED" } : row
      )
    );
    setUploadError(statusCheckResponse?.data?.message || "Background worker engine failed to compile the file.");
  }
  
} catch (pollErr) {
  clearInterval(statusPollInterval); // Hard clear on unexpected connection dropouts
  setIsCompiling(false);
  setUploadError(pollErr.response?.data?.message || pollErr.message);
}

    }, checkIntervalTime);
    } catch (err) {
      console.error("Aggregation thread dropped:", err);
     let serverError = { code: "UNKNOWN", message: "Failed to compile  download." };
      
      if (err.response?.data instanceof Blob) {
        // Convert blob error streams back to readable JSON strings text
        const textData = await err.response.data.text();
        serverError = JSON.parse(textData);
      } else if (err.response?.data) {
        serverError = err.response.data;
      }

      // 🛡️ CHECKPOINT: If the failure is due to billing, trigger the AlertModal! [S4]
      if (serverError.code === "SUBSCRIPTION_EXPIRED" || serverError.code === "PREMIUM_FEATURE_LOCKED") {
        setModalConfig({
          isOpen: true,
          type: "danger", 
          title: serverError.code === "SUBSCRIPTION_EXPIRED" ? "Subscription Expired" : "Feature Locked",
          message: serverError.message,
          actionLabel: "View Pricing Plans" 
        });
      } else {
        setModalConfig({
          isOpen: true,
          type: "danger",
          title: "Download Failed",
          message: serverError.message,
          actionLabel: "Close"
        });
      }
    } finally {
      setIsCompiling(false);
    }
  };

  useEffect(() => {
  localStorage.setItem("baazio_report_session_logs", JSON.stringify(archiveLogs));
  }, [archiveLogs]);

  const handleExecuteBinaryDownload = async (download_id) => {
  try {
    const isPdf = selectedFormat === "PDF Document";
    const response = await api.get(`/download-report/${download_id}/${isPdf ? 'pdf' : 'csv'}`, 
      {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    const mimeType = isPdf ? 'application/pdf' : 'text/csv';
    const fileExtension = isPdf ? 'pdf' : 'csv';
    const dataBlob = new Blob([response.data], { type: mimeType });
    const localDownloadUrl = window.URL.createObjectURL(dataBlob);
    
    const temporaryLinkElement = document.createElement('a');
    temporaryLinkElement.href = localDownloadUrl;

    temporaryLinkElement.setAttribute(
      'download', 
      `Baazio_Statement_${download_id}.${fileExtension}`
    );
    document.body.appendChild(temporaryLinkElement);
    temporaryLinkElement.click(); 

    temporaryLinkElement.parentNode.removeChild(temporaryLinkElement);
    window.URL.revokeObjectURL(localDownloadUrl);

  } catch (error) {
    console.error("Error downloading file asset logs:", error);
    alert(`Failed to complete download request. Please verify your connection.`);
  }
};


  return (
    <div className="w-full min-h-screen flex flex-col gap-2 text-left select-none px-7 pt-7  font-sans pb-12 bg-[#f8fafc] ">
      {/* 🟢 TOP CONTEXT HEADER BAR */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-label-lg  text-on-surface tracking-widest font-sans">Download Reports</h2>
          <p className="text-label-sm text-slate-600 mt-2.5 font-sans">Configure and export your business telemetry data.</p>
        </div>
        
        {/* Top Optimal System Health Status Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100 self-start sm:self-auto shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block animate-pulse" />
          System Operational Telemetry: Optimal
        </div>
      </div>

      {/* 📊 CORE TWO-COLUMN GRID LAYOUT CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
        
        {/* 🎛️ LEFT HAND CONTROLS ROW PANEL (Span 5 of 12) */}
        <div className="lg:col-span-5 space-y-6 w-full">
          
          {/* CONFIGURATION CARD FRAME BOX */}
          <div className="bg-surface-lowest border border-slate-400 rounded-lg p-6 shadow-xs space-y-6">
            
            {/* Interval Parameters Title */}
            <div className="flex items-center gap-2 text-slate-800 pb-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <h3 className=" text-[18px] tracking-wider font-sans text-on-surface">Report Interval Parameters</h3>
            </div>

            {/* Selection Block 1: Period Duration Group Capsule */}
            

            {/* Selection Block 2: File Format Output Selection Grid */}
        <div className="space-y-4 text-left animate-fadeIn">

        {/* STEP 1: Select Report Type Capsule Group */}
        <div className="space-y-2">
        <label className="text-[12px]  uppercase tracking-widest text-slate-700 font-semibold font-sans block">
        Select Report Interval Scope
        </label>
        <div className="grid grid-cols-3 gap-2 bg-surface-low border border-slate-300 p-1 rounded-lg">
        {["Weekly Report", "Monthly Report", "Yearly Report"].map((type) => (
        <button
        key={type}
        type="button"
        onClick={() => { setSelectedDuration(type); setTargetYear(""); setTargetMonth(""); setTargetWeek(""); }}
        className={`h-9 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            selectedDuration === type
            ? 'bg-surface-lowest border border-slate-300 text-primary shadow-2xs'
            : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
        }`}
        >
        {type.split(" ")[0]}
        </button>
        ))}
        </div>
        </div>

        {/* STEP 2: Target Year Selector (Always shown for all report scopes) */}
        <div className="flex flex-col gap-1.5">
        <label className="text-[12px]  uppercase tracking-widest text-slate-700 font-semibold font-sans block">
        Target Calendar Year
        </label>
        <div className="relative w-full">
        <select
        value={targetYear}
        onChange={(e) => { setTargetYear(e.target.value); setTargetMonth(""); setTargetWeek(""); }}
        className="w-full h-11 px-3.5 border border-slate-300 focus:border-primary-container bg-surface-lowest rounded-lg text-sm font-semibold text-slate-700 cursor-pointer appearance-none focus:outline-hidden transition-all shadow-3xs"
        >
        <option value="">-- Choose Fiscal Year --</option>
        {availableYears.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
        </select>
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><svg className="w-4 h-4 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg></div>
        </div>
        </div>

        {/* STEP 3: Target Month Selector (Reveals for Monthly and Weekly scopes once Year is chosen) */}
        {targetYear && selectedDuration !== "Yearly Report" && (
        <div className="flex flex-col gap-1.5 animate-slideDown">
        <label className="text-[12px]  uppercase tracking-widest text-slate-700 font-semibold font-sans block">
        Target Operating Month
        </label>
        <div className="relative w-full">
        <select
        value={targetMonth}
        onChange={(e) => { setTargetMonth(e.target.value); setTargetWeek(""); }}
        className="w-full h-11 px-3.5 border border-slate-300 focus:border-primary-container bg-white rounded-lg text-sm font-semibold text-slate-700 cursor-pointer appearance-none focus:outline-hidden transition-all shadow-3xs"
        >
        <option value="">-- Choose Target Month --</option>
        {availableMonths.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
        </select>
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><svg className="w-4 h-4 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg></div>
        </div>
        </div>
        )}

        {/* STEP 4: Target Week Selector (Reveals strictly for the Weekly Report option block) */}
        {targetMonth && selectedDuration === "Weekly Report" && (
        <div className="flex flex-col gap-1.5 animate-slideDown">
        <label className="text-[12px]  uppercase tracking-widest text-slate-700 font-semibold font-sans block">
        Target Custom Week Period
        </label>
        <div className="relative w-full">
        <select
        value={targetWeek}
        onChange={(e) => setTargetWeek(e.target.value)}
        className="w-full h-11 px-3.5 border border-slate-200 focus:border-blue-500 bg-white rounded-lg text-sm font-semibold text-slate-700 cursor-pointer appearance-none focus:outline-hidden transition-all shadow-3xs"
        >
        <option value="">-- Select Specific Week Range --</option>
        {availableWeeks.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
        </select>
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><svg className="w-4 h-4 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg></div>
        </div>
        </div>
        )}

        </div>

         <div className="space-y-3">
              <label  className="text-[12px]  uppercase tracking-widest text-slate-700 font-semibold font-sans block">
                Select File Format Output
              </label>
              <div className="grid grid-cols-2 gap-3">
                
                {/* Format Capsule Option A: PDF Document */}
                <div 
                  onClick={() => setSelectedFormat("PDF Document")}
                  className={`border rounded-lg p-3 flex items-center gap-3 cursor-pointer transition-all select-none ${
                    selectedFormat === "PDF Document"
                      ? 'border-primary bg-surface-lowest shadow-sm shadow-blue-50'
                      : 'border-slate-300 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${selectedFormat === "PDF Document" ? 'bg-blue-100 text-blue-600' : 'bg-slate-50 text-slate-400'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-left overflow-hidden">
                    <p className={`text-sm font-semibold ${selectedFormat === "PDF Document" ? "text-primary-container":"text-slate-800"}   tracking-tight leading-none`}>PDF Document</p>
                  </div>
                </div>

                {/* Format Capsule Option B: CSV Spreadsheet */}
                <div 
                  onClick={() => setSelectedFormat("CSV Spreadsheet")}
                  className={`border rounded-lg p-3 flex items-center gap-3 cursor-pointer transition-all select-none ${
                    selectedFormat === "CSV Spreadsheet"
                      ? 'border-primary bg-surface-lowest shadow-sm shadow-blue-50'
                      : 'border-slate-300 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${selectedFormat === "CSV Spreadsheet" ? 'bg-blue-100 text-secondary' : 'bg-slate-50 text-slate-400'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-left overflow-hidden">
                    <p className={`text-sm font-semibold ${selectedFormat === "CSV Spreadsheet" ? "text-primary-container":"text-slate-800"}   tracking-tight leading-none`}>CSV Document</p>
                  </div>
                </div>

              </div>
            </div>
            {/* Central Compiling Deployment Dispatch Button Trigger */}
            <button
              type="button"
              disabled={isCompiling}
              onClick={handleGenerateReport}
              className="w-full h-12 bg-secondary hover:bg-blue-700 disabled:bg-slate-200 text-white rounded-md text-sm font-bold transition-all shadow-md shadow-blue-100 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:text-slate-400"
            >
              {isCompiling ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-400 border-t-blue-600 rounded-lg animate-spin" />
                  Compiling Data Streams...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate Live Report & Compile
                </>
              )}
            </button>

            {/* Informational UX Instruction Muted Alert Box Banner */}
            <div className="bg-slate-50/50 border border-slate-300 rounded-md p-4 flex items-start gap-3 text-left">
              <svg className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-[12px] font-sans font-medium leading-relaxed text-slate-500">
                Reports are generated using high-fidelity data nodes. Background compilation may take 15-45 seconds depending on data density.
              </p>
            </div>

          </div>
        </div> 

        {/* 📜 RIGHT HAND DATA REGISTRY ARCHIVE LIST (Span 7 of 12) */}
        <div className="lg:col-span-7 bg-white border border-slate-400 rounded-lg shadow-xs overflow-hidden flex flex-col justify-between min-h-116.25">
          
          {/* Compilation Logs Card Title Header Bar */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between text-left bg-white shrink-0">
            <div className="flex items-center gap-2 text-slate-800">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className=" text-md  tracking-wider font-sans text-slate-800">
                Live Background Compilation Status & Archive Logs
              </h3>
            </div>
            <button className="text-primary-container hover:text-blue-600 p-1 hover:bg-slate-50 rounded-md transition-colors cursor-pointer" aria-label="Refresh log data registry">
              <svg 
                className="w-5 h-5 stroke-2 transition-transform duration-500 ease-out group-hover:rotate-180 text-inherit" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" >
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
            </svg>
            </button>
          </div>

          {/* 📱 HORIZONTAL RESPONSIVE SWEEP WRAPPER GRID */}
        <div className="w-full flex-1 overflow-x-auto lg:overflow-x-visible scrollbar-thin scrollbar-thumb-slate-200">
  {/* 🎯 THE FIX: Changed from table-fixed to table-auto to distribute width perfectly across the parent grid canvas */}
  <table className="w-full min-w-137.5 lg:min-w-0 text-left border-collapse table-auto">
    <thead>
      <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest font-sans bg-white sticky top-0">
        {/* 🎯 THE FIX: Replaced rigid pixel column values with balanced percentage footprints */}
        <th className="p-3 pl-6 w-[45%]">Extraction Range</th>
        <th className="p-3 w-[15%]">Format</th>
        <th className="p-3 w-[25%]">Status</th>
        <th className="p-3 pr-6 w-[15%] text-center">Download</th>
      </tr>
    </thead>
        <tbody className="divide-y divide-slate-200 font-medium">
        {archiveLogs.length === 0 ? (
        /* 📦 SESSION EMPTY CONTAINER PLACEHOLDER LINK */
        <tr>
          <td colSpan={5} className="p-12 text-center bg-white">
            <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
              
              {/* Muted Cloud Vector Accent Graphic */}
              <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 mb-3.5 shadow-3xs">
                <svg className="w-5 h-5 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
                </svg>
              </div>

              <h4 className="text-slate-800 text-xs font-black uppercase tracking-wider font-sans">
                No Active Extraction Session
              </h4>
              <p className="text-slate-400 text-xs font-medium leading-relaxed mt-1">
                Configure your interval parameters on the left panel grid, then click generate to compile and stream live business telemetry records.
              </p>

            </div>
          </td>
        </tr>
      ) : (archiveLogs.map((log) => (
            <tr key={log.id} className="hover:bg-slate-100 transition-colors bg-surface-lowest">
              
              {/* Extraction Range Data Cell */}
              <td className="p-3 pl-6 text-sm font-sans  text-slate-800 tracking-tight leading-normal">
                {log.range}
              </td>
              
              {/* Format Badge Data Cell */}
              <td className="p-3 text-xs font-sans font-semibold">
                <span className={log.format === "PDF" ? 'text-red-500' : 'text-emerald-600'}>
                  {log.format}
                </span>
              </td>
              
              {/* Status Processing/Completed Pill Data Cell */}
              <td className="p-3">
                {log.status === "COMPLETED" ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-emerald-50 text-emerald-600 border border-emerald-100/50 font-sans">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block" /> Completed
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide bg-blue-50 text-blue-600 border border-blue-100/50 font-sans">
                    <div className="w-1.5 h-1.5 border border-slate-400 border-t-blue-600 rounded-full animate-spin mr-0.5" /> Processing
                  </span>
                )}
              </td>
              
              {/* Action Trigger Download Button Data Cell */}
              <td className="p-3 pr-6 text-center">
                <button
                  type="button"
                  onClick={() =>handleExecuteBinaryDownload(log.id)}
                  disabled={log.status === "processing"}
                  className={`p-1.5 rounded-lg border transition-all cursor-pointer shrink-0 flex items-center justify-center mx-auto ${
                    log.status === "processing"
                      ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50/50'
                      : 'border-slate-300 hover:border-slate-300 text-slate-600 hover:text-blue-600 bg-surface-lowest shadow-2xs'
                  }`}
                >
                  <svg className="w-4 h-4 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </td>

            </tr>
          )))}
        </tbody>
      </table>
        </div>
          {/* 📊 TELEMETRY WORKSPACE COMPILATION METRICS SUMMARY CARD */}
      <div className="bg-surface-lowest border border-slate-300 rounded-lg p-5 shadow-2xs space-y-4 text-left animate-fadeIn mt-6">
        
        {/* Header Info Anchors */}
        <div className="flex items-center justify-between border-b border-slate-300 pb-3.5 ">
          <div className="flex items-center gap-2 text-slate-800">
            <div className="w-7 h-7 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center border border-blue-100/50">
              <svg className="w-5 h-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
              </svg>
            </div>
            <h4 className=" text-label-md uppercase tracking-wider font-sans">
              Extraction Session Insights
            </h4>
          </div>
          
          {/* Dynamic Action Trigger to clear out localized array caches */}
          {archiveLogs.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (confirm("Are you sure you want to clear your current local session logs? This will not affect your server files.")) {
                  setArchiveLogs([]);
                }
              }}
              className="text-[12px] font-semibold uppercase tracking-wider text-slate-600 border border-slate-400 rounded-md p-2 bg-surface-low hover:text-red-500 transition-colors cursor-pointer"
            >
              Clear Workspace
            </button>
          )}
        </div>

        {/* 🖥️ Metric Data Grid Layout Panel */}
        <div className="grid grid-cols-3 gap-4 ">
          
          {/* Micro Metric Block A: Total Session Extractions */}
          <div className="bg-slate-50/50 border border-slate-300 rounded-sm p-3 flex flex-col text-left">
            <span className="text-[12px] font-semibold  tracking-wider text-slate-600 font-sans leading-none">
              Compiled Statements
            </span>
            <p className="text-base font-black text-slate-800 mt-1.5 font-mono leading-none">
              {archiveLogs.length} <span className="text-[12px] font-bold text-slate-500 font-sans tracking-tight">files</span>
            </p>
          </div>

          {/* Micro Metric Block B: Current Pending Task Queue Tracker */}
          <div className="bg-slate-50/50 border border-slate-300 rounded-sm p-3 flex flex-col text-left">
            <span className="text-[12px] font-semibold  text-slate-600 font-sans leading-none">
              Active Background Jobs
            </span>
            <p className="text-base font-black text-slate-800 mt-1.5 font-mono leading-none flex items-center gap-1.5">
              {archiveLogs.filter(log => log.status === "PROCESSING").length}
              {archiveLogs.some(log => log.status === "PROCESSING") && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 block animate-pulse" />
              )}
            </p>
          </div>

          {/* Micro Metric Block C: Automatic Cache Lifespan Timer Warning */}
          <div className="bg-slate-50/50 border border-slate-300 rounded-sm p-3 flex flex-col text-left">
            <span className="text-[12px] font-semibold  text-slate-600 font-sans leading-none">
              Cache Expire Clock
            </span>
            <p className="text-xs font-black text-amber-600 mt-1.5 tracking-tight font-sans leading-none flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              24 Hours
            </p>
          </div>

        </div>

        {/* Bottom Regulatory Text Help Guide Label Row */}
        <div className="text-[12px] text-slate-500 leading-normal font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-300 flex items-start gap-2">
          <svg className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            <strong className='text-primary'>SaaS Compliance Guard:</strong> Compiled report logs are temporarily cached in your browser for fast access. Stale file binary assets are automatically erased from server storage layers exactly 24 hours post-compilation to protect business records.
          </span>
        </div>

      </div>

        </div> 

      </div> 
       <AlertModal 
              isOpen={modalConfig.isOpen}
              type={modalConfig.type}
              title={modalConfig.title}
              message={modalConfig.message}
              actionLabel={modalConfig.actionLabel}
               onAction={() => {
                  handleCloseModal();
                  if (modalConfig.actionLabel === "View Pricing Plans") {
                    console.log("💳 Redirecting terminal operator to the pricing subscription matrix...");
                    navigate("/admin-dashboard/billing"); // Smoothly transitions the viewpoint without reloading the browser [S4]
                  }
                }}
              onClose={handleCloseModal}  // 🎯 Background backdrop clicking safety paths
            />
    </div> /* Closes Main Page Wrapper Container */
  );
}
