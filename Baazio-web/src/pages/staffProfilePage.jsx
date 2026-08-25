import React, {useState, useEffect} from "react";
import { UserCheck, Store, ShieldCheck, CheckCircle2, Lock, AlertTriangle, LogOut  } from 'lucide-react';
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import AlertModal from "../components/alert";
import api from "../api/axiosClient";
import axios from "axios";
const StaffProfilePage = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] =useState(false)
   const [staffData, setStaffData] = useState({});
   const [passwordChangeError, setPasswordChangeError] = useState("")
  const accessToken = useAuthStore((state) => state.accessToken)
    const clearAuthSession = useAuthStore((state) => state.clearAuthSession);
    const [modalConfig, setModalConfig] = useState({
          isOpen: false,
          type: "success",
          title: "",
          message: "",
          actionLabel: ""
        });
    useEffect(() =>{
      const fetchStaffData = async () =>{
        try{
          const userData = await api.get('/auth/me', { headers: { Authorization: `Bearer ${accessToken}` } })
          setStaffData(userData.data.data)
        }catch(err){
         console.error("Failed to fetch profile metadata:", err);
      }
      }
      fetchStaffData()
    }, [accessToken])
     const initials = staffData?.staff_name
  ? staffData.staff_name
      .split(" ")
      .map(n => n[0])
      .join("")
  : "";

  const handleChangePassword = async () => {
  try {
    setPasswordChangeError("");
    const cleanCurrentPassword = currentPassword.trim();
    const cleanNewPassword = newPassword.trim();
    const strongPasswordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

    if (!cleanCurrentPassword || !cleanNewPassword) {
      setPasswordChangeError("Please all input fields are required.");
      return;
    }
    
    if (cleanNewPassword.length < 8) {
      setPasswordChangeError("Security rule error: New password must be at least 8 characters long.");
      return;
    }
    
    if (!strongPasswordRegex.test(cleanNewPassword)) {
      setPasswordChangeError("Password criteria unmet: New password must contain at least one uppercase letter, one lowercase letter, and one numerical digit.");
      return;
    }

    console.log("📡 Dispatching authorized security transformation metrics...");
    setIsSubmitting(true)
    const changePassword = await api.patch("/auth/change-password",
      {
        old_password: cleanCurrentPassword,
        new_password: cleanNewPassword
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    setCurrentPassword("");
    setNewPassword("");

    setModalConfig({
      isOpen: true,
      type: "success", 
      title: "Password Changed Successfully",
      message: changePassword.data?.message || "Your device credentials updated cleanly.",
      actionLabel: "Login Back" 
    });

    setTimeout(() => {
      clearAuthSession();              // Clears active tokens from Zustand memory store [S4]
      window.location.href = "/login"; // Forces a hard browser window location swap [S4]
    }, 2500);

  } catch (error) {
    console.error("❌ Security credential update rejected:", error);
    
    const serverStatus = error.response?.status;
    const errorMessage = error.response?.data?.message;

    if (serverStatus === 401 || serverStatus === 404) {
      setPasswordChangeError(errorMessage || "Authentication failed. Incorrect current credentials.");
    } else {
      setPasswordChangeError(errorMessage || "An unexpected processing breakdown occurred inside network channels.");
    }
  }finally{
    setIsSubmitting(false)
  }
};
 const handleCloseModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }));
    const handleSignOut = async () => {
      //  const activeTokenSnapshot = useAuthStore.getState().accessToken;
      clearAuthSession(); 
      navigate('/login');
      try {
        console.log("Terminating active user workspace session channels...");
          await axios.post(
          "http://localhost:5000/api/auth/logout", 
          {}, 
          { 
            withCredentials: true,
            headers: { 
              Authorization: `Bearer ${accessToken}` // 🚀 Now passes your token gate cleanly! 
            }
          }
        );
        console.log("Backend session cookie signatures revoked successfully.")
      } catch (error) {
        console.warn("Server logout notification dropped or already expired:", error.error || error.message);
      }
      };
  return(
     <div className="min-h-screen bg-[#f8fafc] ">
      {/* Page Header */}
      <header className="flex w-full pt-3 pb-3 items-center justify-between border-b border-slate-400 bg-surface-lowest px-4 sm:px-6">
        <h1 className="text-label-lg font-sans text-primary-container">
          Profile Settings
        </h1>

        <button  type="button"  className="inline-flex items-center justify-center p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer group shadow-xs select-none"
             aria-label="Open user account profile settings menu">
            <div className="w-9 h-9 rounded-full bg-primary text-white border border-blue-400/20 flex items-center justify-center font-bold font-sans text-[13px] uppercase shrink-0 shadow-md transition-transform duration-200 group-hover:scale-95">
                {initials}
            </div>
        </button>
      </header>
        <main className="mx-auto max-w-295 p-4 sm:p-6 lg:p-8">
             <section className="mb-5 rounded-md border border-slate-300 bg-surface-lowest p-5 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-[#D9DEE8]">
                <div className="w-full h-full rounded-full bg-primary-container text-white border border-blue-400/20 flex items-center justify-center font-bold font-sans text-[13px] uppercase shrink-0 shadow-md transition-transform duration-200 group-hover:scale-95">
                {initials}
            </div>
              </div>

              <div>
                <h2 className="text-headline-md tracking-tighter capitalize text-on-surface">
                  {staffData.staff_name}
                </h2>

                <p className="mt-0.5 text-body-md text-slate-400">
                  {staffData.staff_email}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-surface-highest px-3 py-1 text-label-md  font-sans text-on-surface">
                    Role: {staffData.role}
                  </span>

                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-[#ECFDF3] px-3 py-1 text-label-md font-medium text-[#15803D]">
                    Status: Active
                    <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
                  </span>
                </div>
              </div>
            </div>

          </div>
        </section>
        <div className="w-full max-w-5xl mx-auto space-y-6">
        
        {/* ========================================================================= */}
        {/* 📊 TOP SECTION GRID LAYOUT: COLLAPSES ON MOBILE / SIDE-BY-SIDE ON DESKTOP */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          
          {/* 📝 CARD 1: PERSONAL DETAILS */}
          <div className="bg-surface-low border border-slate-300 rounded-md p-6 shadow-sm space-y-5 min-h-55">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-label-lg  text-slate-700  tracking-widest flex items-center gap-2">
                <UserCheck size={18} className="text-slate-500 stroke-2" />
                Personal Details
              </h3>
            </div>

            <div className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1">
                <span className="text-body-md font-sans text-slate-500  tracking-wider block">Full Name</span>
                <span className="text-label-lg font-sans text-on-surface capitalize tracking-tight block">
                  {staffData.staff_name}
                </span>
              </div>

              {/* Email Address */}
              <div className="space-y-1 pt-1 border-t border-slate-100">
                <span className="text-body-md font-bold text-slate-500  tracking-wider block">Email Address</span>
                <span className="text-label-lg font-sans text-on-surface block break-all ">
                  {staffData.staff_email}
                </span>
              </div>
            </div>
          </div>

          {/* 🏬 CARD 2: WORKSPACE CONTEXT */}
          <div className="bg-surface-low border border-slate-300 rounded-md p-6 shadow-sm space-y-4 min-h-55">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-label-lg  text-slate-700  tracking-widest flex items-center gap-2">
                <Store size={18} className="text-slate-400 stroke-2" />
                Workspace Context
              </h3>
            </div>

            <div className="space-y-3.5">
              {/* Business Name */}
              <div className="space-y-0.5">
                <span className="text-body-md font-sans text-slate-500  tracking-wider block">Business Name</span>
                <span className="text-label-lg font-sans text-on-surface tracking-tight block capitalize">
                  {staffData?.business?.business_name}
                </span>
              </div>

              {/* Owner Name */}
              <div className="space-y-0.5 pt-1.5 border-t border-slate-100">
                <span className="text-body-md font-sans text-slate-500  tracking-wider block">Owner Name</span>
                <span className="text-label-lg font-sans text-on-surface block capitalize">
                  {staffData?.business?.owner_name}
                </span>
              </div>

              {/* Date Joined */}
              <div className="space-y-0.5 pt-1.5 border-t border-slate-50">
                <span className="text-body-md font-sans text-slate-500  tracking-wider block">Date Joined</span>
                <span className="text-label-md font-mono text-on-surface tracking-wide block">
                  {
                    new Date(staffData?.business?.createdAt).toLocaleDateString('en-NG', { 
                            month: 'long',  // 📝 Explodes "09" out into full word string "September"
                            day: 'numeric', // 🔢 Displays "19"
                            year: 'numeric' // 🔢 Displays "2026"
                          })
                  }
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 🛡️ BOTTOM SECTION: PERMISSIONS AUDIT BANNER LAYOUT                          */}
        {/* ========================================================================= */}
        <div className="bg-white border border-slate-300 rounded-md p-6 shadow-sm space-y-4">
          <div className="">
            <h3 className="text-label-lg text-slate-700  tracking-widest flex items-center gap-2">
              <ShieldCheck size={18} className="text-slate-500 stroke-2" />
              Permissions Audit
            </h3>
          </div>

          {/* Banner Box */}
          <div className="w-full bg-[#f4f7ff] border border-blue-200 rounded-md p-4 flex gap-3.5 items-start">
            {/* Verification Check Badge Icon */}
            <div className="shrink-0 text-blue-600 pt-0.5">
              <CheckCircle2 size={18} className="fill-blue-600 text-white stroke-2" />
            </div>

            {/* Information Strings Mapping */}
            <div className="space-y-1 text-left">
              <h4 className="text-body-md font-sans text-slate-800 tracking-tight">
                Permission Status: Authorized to Record Sales Transaction Rows
              </h4>
              <p className="text-body-sm  text-slate-500 font-sans leading-relaxed">
                This user has the necessary roles assigned to process daily transactions within the assigned workspace.
              </p>
            </div>
          </div>
        </div>

      </div>
      <div className="w-full bg-surface-low border my-6 border-slate-300 rounded-md p-6 shadow-sm font-sans antialiased text-left max-w-5xl mx-auto">
      
      {/* 🔐 CARD HEADER ACCENT BLOCK */}
      <div className="border-b border-slate-300 pb-3 mb-4">
        <h3 className="text-headline-md font-sans text-slate-700  tracking-widest flex items-center gap-2">
          <Lock size={18} className="text-slate-400 stroke-2" />
          Security
        </h3>
      </div>

      {/* 📊 FLEXIBLE DEFS CONTAINER GRID SECTION */}
      <div className="flex flex-col md:flex-row gap-6 md:items-stretch">
        
        {/* ========================================================================= */}
        {/* 🔑 LEFT SIDEBAR PORTION: INTERACTIVE CREDENTIAL CHANGE FORM               */}
        {/* ========================================================================= */}
        <div className="flex-1 space-y-4">
          <p className="text-body-sm text-tertiary">
            {passwordChangeError}
          </p>
          {/* Current Password Field Input */}
          <div>
                <label className="mb-1 font-sans text-label-md font-medium text-on-surface-variant">
                  Current Password
                </label>

                <div className="relative w-full">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full h-9 pl-4 pr-11 rounded-md border text-label-md border-slate-400 mt-1 text-slate-700 focus:outline-none focus:bg-white transition-all bg-slate-50/40 shadow-3xs ${
                    showPassword ? "tracking-normal" : "tracking-widest placeholder:tracking-normal"
                  } `}
                />
                
                {/* 🎯 FIX 1: Filled the empty ternary brackets with valid inline SVG icons */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer flex items-center justify-center"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              </div>
          {/* <div className="space-y-1.5">
            <label className="text-label-md  text-slate-700 tracking-tight block">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              placeholder="••••••••••••"
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full h-10 px-3.5 bg-surface border border-slate-400 mt-2 rounded-md text-body-sm  text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all shadow-2xs"
            />
          </div> */}

          {/* New Password Field Input */}

           <div className="">
                {/* New Password */}
                <div>
                  <label className="mb-1 font-sans text-label-md font-medium text-on-surface-variant">
                    New Password
                  </label>

                  <div className="relative w-full">
                <input
                  required
                  type={showNewPassword ? "text" : "password"}
                   value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full h-9 pl-4 pr-11 rounded-md border text-label-md border-slate-400 mt-1 text-slate-700 focus:outline-none focus:bg-white transition-all bg-slate-50/40 shadow-3xs ${
                    showNewPassword? "tracking-normal" : "tracking-widest placeholder:tracking-normal"
                  } `}
                />
                
                {/* 🎯 FIX 1: Filled the empty ternary brackets with valid inline SVG icons */}
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer flex items-center justify-center"
                >
                  {showNewPassword ? (
                    <svg className="w-4 h-4 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
                </div>

                {/* Confirm */}
              </div>
          {/* <div className="space-y-1.5">
            <label className="text-label-md font-bold text-slate-700 tracking-tight block">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full h-10 px-3.5 bg-surface border border-slate-400 rounded-md text-body-sm mt-2 font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all shadow-2xs"
            />
          </div> */}

          {/* Baazio Primary Accent Blue Form Submit Action Control Button */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleChangePassword}
              disabled={isSubmitting}
              className="bg-secondary hover:bg-blue-700 text-white font-bold text-body-md rounded-lg px-4 h-9 tracking-tight transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:scale-[0.99] cursor-pointer shadow-sm"
            >
              {isSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Change Password"
                  )}
            </button>
          </div>
        </div>

        {/* 📏 THE STRUCTURAL DESKTOP SLATE DIVIDER VECTOR BAR */}
        <div className="hidden md:block w-px bg-slate-300 self-stretch my-1" />

        <div className="flex-1 flex items-start justify-center">
          <div className="w-full bg-[#fff4f4] border border-tertiary rounded-lg p-4 flex flex-col justify-between space-y-10 ">
            
            {/* Warning Message Label */}
            <div className="space-y-2 text-left">
              <h4 className="text-label-lg font-black text-[#8c1d1d]  tracking-widest flex items-center gap-1.5">
                <AlertTriangle size={14} className="stroke-[2.5]" />
                Session
              </h4>
              <p className="text-body-sm text-slate-600 font-medium leading-normal max-w-sm">
                Ending your session will require you to log in again to access the workspace.
              </p>
            </div>

            {/* Crimson Danger Trigger Exits Handling Button */}
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full h-10 border border-red-200 bg-[#ffe5e5] hover:bg-[#ffd1d1] text-red-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer focus:outline-none  active:scale-[0.99]"
            >
              <LogOut size={14} className="stroke-[2.5]" />
              Log Out
            </button>
            
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
      onAction={handleCloseModal} // 🎯 Direct confirmation handler button path [S4]
      onClose={handleCloseModal}  // 🎯 Background backdrop clicking safety paths
    />
        </main>
    </div>
  )
}

export default StaffProfilePage