import React, { useState } from 'react';
import api from '../api/axiosClient';
import { useAuthStore } from '../store/authStore';

export default function PasswordResetModal({ isOpen, onClose }) {
  const accessToken = useAuthStore((state) => state.accessToken);
  
  // 🧭 USER STATE PARAMETERS
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [inlineErrorMessage, setInlineErrorMessage] = useState("");
  const [successStatus, setSuccessStatus] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Exit early if parent lifecycle control flags evaluate to false
  if (!isOpen) return null;

  // 📡 CORE SUBMISSION NETWORK CHANNEL: Dispatches to auth pipeline metrics
  const handlePasswordMutationSubmit = async (e) => {
    if (e) {
    e.preventDefault();
    e.stopPropagation(); 
  }

    setInlineErrorMessage("");
    
    // 🎯 VALIDATION PRE-GUARD FILTER
    const trimmedPass = newPassword.trim();
    if (trimmedPass.length < 8) {
      setInlineErrorMessage("⚠️ Security Boundary: New password must be at least 8 characters long.");
      return;
    }
    const complexityRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
  
    if (!complexityRegex.test(trimmedPass)) {
        // 🎯 INJECT VISUAL FEEDBACK LABEL INSTANTLY FOR THE CASHIER
        setInlineErrorMessage("⚠️ Complexity Rule: Include at least one uppercase letter, lowercase letter, and number.");
        return; // 🔥 STOP! This guarantees the script dies here. The server is NEVER pinged. [S4]
    }

    try {
      setIsLoading(true);
      
       await api.patch('/auth/change-staff-password', { new_password: trimmedPass },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
     
      setSuccessStatus(true);
      setNewPassword("");
      
      // Automatically slide the drawer panel shut cleanly after a 1.5s visual confirmation
      setTimeout(() => {
        setSuccessStatus(false);
        useAuthStore.getState().clearAuthSession()
        window.location.href = "/login";
        onClose();
      }, 1500);

    } catch (err) {
      console.error("❌ Failed to mutate temporary staff password matrix:", err);
      const serverMessage = err.response?.data?.message || "Internal transmission network fault.";
      setInlineErrorMessage(`🛑 Updation Denied: ${serverMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs select-none p-4 font-sans text-left animate-fadeIn">
      
      {/* CARD CONTENT LAYER WRAPPER */}
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl space-y-4 relative text-left">
        
        {/* ❌ TOP ABSOLUTE ESCAPE BUTTON FRAME */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors cursor-pointer border border-transparent focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
          title="Change later"
        >
          <svg className="w-4 h-4 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* HEADER ICON AND TITLE BADGES */}
        <div className="space-y-1 text-left pt-2">
          <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-3">
            <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h2 className="text-headline-md font-sans  text-on-surface tracking-wider ">Update Password</h2>
          <p className="text-body-sm text-slate-500 font-sans leading-relaxed">
            You currently logged in via a temporary credential key string . Please set a secure personal password.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 📋 CENTRAL MUTATION DATA INPUT FORM MATRIX */}
        {/* ========================================================================= */}
        <form onSubmit={handlePasswordMutationSubmit} className="space-y-4 pt-1">
          
          <div className="flex flex-col gap-1 w-full text-left relative">
            <label className="text-label-md font-sans mb-1 text-slate-800  tracking-wider">
              New Secure Password
            </label>
             <div className="relative w-full">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                    autoFocus
                    value={newPassword}
                    disabled={isLoading || successStatus}
                   onChange={(e) => {
                        setNewPassword(e.target.value);
                        setInlineErrorMessage("");
                    }}
                  placeholder="••••••••"
                  className={`w-full h-10 pl-4 pr-11 rounded-md border text-label-md border-slate-400 mt-1 text-slate-700 focus:outline-none focus:bg-white transition-all bg-slate-50/40 shadow-3xs ${
                    showPassword ? "tracking-normal" : "tracking-widest placeholder:tracking-normal"
                  } ${inlineErrorMessage 
                  ? 'border-red-400 focus:border-red-500 bg-red-50/10' 
                  : 'border-slate-300 focus:border-blue-500 bg-white'}`}
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
            {/* ERROR micro-typography element layer row [S4] */}
            {inlineErrorMessage && (
              <span className="text-body-sm  text-error mt-1 block select-none animate-fadeIn">
                {inlineErrorMessage}
              </span>
            )}

            {/* SUCCESS confirmation check tag block */}
            {successStatus && (
              <span className="text-body-sm font-sans text-emerald-600 mt-1 block select-none animate-fadeIn">
                🎉 Success: Your account password have been updated successfully. Shutting interface view...
              </span>
            )}
          </div>

          {/* LOWER INTERACTION CONTROLS MATRIX STRIP */}
          <div className="flex items-center gap-2 pt-2 justify-end w-full">
            
            {/* ACTION 1: CLOSE / SKIP SLIDE */}
            <button
              type="button"
              disabled={isLoading || successStatus}
              onClick={onClose}
              className="h-8 px-3 border border-slate-400 hover:border-slate-300 text-slate-700 bg-surface hover:bg-slate-50  text-body-sm tracking-wider rounded-md transition-all flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none"
            >
              Skip
            </button>

            {/* ACTION 2: MUTATION DISPATCH TRIGGER */}
            <button
              type="submit"
              disabled={isLoading || successStatus || !newPassword.trim()}
              className="h-9 px-4 bg-primary-container font-sans hover:bg-blue-700 text-surface-lowest text-body-md tracking-wider rounded-md transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none min-w27.5"
            >
              {isLoading ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-lg animate-spin" />
              ) : (
                <span>Save Password</span>
              )}
            </button>

          </div>
        </form>

      </div>
    </div>
  );
}
