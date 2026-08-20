import React, {useState, useEffect} from "react";
import { UserCheck, Store, ShieldCheck, CheckCircle2, Lock, AlertTriangle, LogOut  } from 'lucide-react';
const StaffProfilePage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('••••••••••••');
  const [newPassword, setNewPassword] = useState('');
   const [staffData] = useState({
    fullName: "Alex Mercer",
    email: "alex.mercer@baazio.com",
    businessName: "BaaZio Central Store",
    ownerName: "Sarah Jenkins",
    dateJoined: "2023-08-15"
  });
  return(
     <div className="min-h-screen bg-[#f8fafc] ">
      {/* Page Header */}
      <header className="flex w-full pt-3 pb-3 items-center justify-between border-b border-slate-400 bg-surface-lowest px-4 sm:px-6">
        <h1 className="text-headline-md font-sans text-primary-container">
          Profile Settings
        </h1>

        <button  type="button"  className="inline-flex items-center justify-center p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer group shadow-xs select-none"
             aria-label="Open user account profile settings menu">
            <div className="w-9 h-9 rounded-full bg-primary text-white border border-blue-400/20 flex items-center justify-center font-bold font-sans text-[13px] uppercase shrink-0 shadow-md transition-transform duration-200 group-hover:scale-95">
                AG
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
                AG
            </div>
              </div>

              <div>
                <h2 className="text-headline-md tracking-tighter text-on-surface">
                  Sarah Jenkins
                </h2>

                <p className="mt-0.5 text-body-md text-slate-400">
                  sarah.j@baazio-client.com
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-surface-highest px-3 py-1 text-label-md  font-sans text-on-surface">
                    Role: Business Owner
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
                <span className="text-label-lg font-sans text-on-surface tracking-tight block">
                  {staffData.fullName}
                </span>
              </div>

              {/* Email Address */}
              <div className="space-y-1 pt-1 border-t border-slate-100">
                <span className="text-body-md font-bold text-slate-500  tracking-wider block">Email Address</span>
                <span className="text-label-lg font-sans text-on-surface block break-all ">
                  {staffData.email}
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
                <span className="text-label-lg font-sans text-on-surface tracking-tight block">
                  {staffData.businessName}
                </span>
              </div>

              {/* Owner Name */}
              <div className="space-y-0.5 pt-1.5 border-t border-slate-100">
                <span className="text-body-md font-sans text-slate-500  tracking-wider block">Owner Name</span>
                <span className="text-label-lg font-sans text-on-surface block">
                  {staffData.ownerName}
                </span>
              </div>

              {/* Date Joined */}
              <div className="space-y-0.5 pt-1.5 border-t border-slate-50">
                <span className="text-body-md font-sans text-slate-500  tracking-wider block">Date Joined</span>
                <span className="text-label-md font-mono text-on-surface tracking-wide block">
                  {staffData.dateJoined}
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
          
          {/* Current Password Field Input */}
          <div className="space-y-1.5">
            <label className="text-label-md  text-slate-700 tracking-tight block">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full h-10 px-3.5 bg-surface border border-slate-400 mt-2 rounded-md text-body-sm  text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all shadow-2xs"
            />
          </div>

          {/* New Password Field Input */}
          <div className="space-y-1.5">
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
          </div>

          {/* Baazio Primary Accent Blue Form Submit Action Control Button */}
          <div className="pt-1">
            <button
              type="button"
              className="bg-secondary hover:bg-blue-700 text-white font-bold text-body-md rounded-lg px-4 h-9 tracking-tight transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:scale-[0.99] cursor-pointer shadow-sm"
            >
              Change Password
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
              className="w-full h-10 border border-red-200 bg-[#ffe5e5] hover:bg-[#ffd1d1] text-red-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer focus:outline-none  active:scale-[0.99]"
            >
              <LogOut size={14} className="stroke-[2.5]" />
              Log Out
            </button>
            
          </div>
        </div>

      </div>
    </div>
        </main>
    </div>
  )
}

export default StaffProfilePage