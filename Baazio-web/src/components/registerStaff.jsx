import React, { useState, useEffect } from 'react';
import api from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import ServerErrorPage from '../pages/serverError';
export default function AddStaffModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // Tracks successful screen transitions
const [regError, setRegError] = useState("")
const [errorDisplay, setErrorDisplay] = useState(false)
const accessToken = useAuthStore((state) => state.accessToken);
const navigate = useNavigate()
  // Reset local state layers whenever the overlay opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({ name: '', email: '' });
      setIsSuccess(false);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setErrorDisplay(false)
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setErrorDisplay(true)
  setRegError("");
  const trimmedName = formData.name.trim();
  const trimmedEmail = formData.email.trim();

  if (trimmedName.length < 3) {
    setRegError("Staff name must be at least 3 characters long.");
    return;
  }

  // Regular expression pattern matching standard email address rules
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    setRegError("Please supply a valid email address.");
    return;
  }

  setIsSubmitting(true);
  try {
    // Optional loading simulation block
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const response = await api.post(
      "/auth/register-staff", 
      {
        staff_name: trimmedName,
        staff_email: trimmedEmail
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );
    setIsSubmitting(true)
    if (response.data.status === "success" || response.status === 201) {
      setIsSuccess(true); // Transition cleanly to your success canvas view
    }
  } catch (error) {
    console.log("Full intercepted API error context:", error.response?.data);
    const backendMessage = error.response?.data?.message || "";

    if (backendMessage.includes("already exist")){
      setRegError("This staff email is already registered to a workspace.");
    } else if (backendMessage.includes("Access Denied")|| error.response?.code.includes("STAFF_LIMIT_EXCEEDED")){
       setRegError(
        <span>
          You have reached the maximum staff registration limit for your active plan.{" "}
          <strong className="text-blue-600 font-bold block mt-2 animate-pulse text-[13px]">
            Redirecting to the upgrade page in 4 seconds...
          </strong>
        </span>
      );

      setTimeout(() => {
        navigate("/admin-dashboard/billing"); 
      }, 1500);

    }else if (backendMessage.includes("unauthorized") || error.response?.status === 403) {
      setRegError("Access denied. Only business owners can register staff accounts.");
    } else {
        setRegError("Failed to create staff account. Please try again.")
    }

  } finally {
    setIsSubmitting(false);
  }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      
      {/* 📱 1. BACKDROP BLUR SHIELD OVERLAY */}
      <div 
        onClick={isSubmitting ? null : onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 ease-in-out animate-fadeIn"
      />

      {/* 🖥️ 2. CENTERED MICRO-CANVAS PANEL SCREEN */}
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl z-50 flex flex-col overflow-hidden transition-all duration-300 transform scale-100 max-h-[90vh]">
        
        {/* CLOSE MENU FLOATING CROSS BUTTON */}
        {!isSubmitting && (
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* 🔄 CONDITIONAL RENDER: FORM STATE VS SUCCESS STATE */}
        {!isSuccess ? (
          <>
            {/* FORM BAR HEADER TEXT */}
            <div className="p-6 pb-4 border-b border-slate-200 ">
              <h3 className="text-headline-md text-on-surface  tracking-tight">
                Register New Staff Terminal 
              </h3>
              <p className="text-body-md text-slate-400 mt-0.5 ">
                Provision fresh credentials for system store access.
              </p>
            </div>
            {errorDisplay &&regError && (
                <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-start gap-2.5 text-left animate-fadeIn">
                    {/* Warning Hexagon Vector Anchor Icon */}
                    <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div className="leading-relaxed w-full">
                    {regError}
                    </div>
                </div>
                )}
            {/* CORE ACCESSIBILITY INPUT INTERFACES */}
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 text-left overflow-y-auto">
              
              {/* Input Item 1: Full Name */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="modal-staff-name" className="text-label-md uppercase tracking-widest text-slate-800 font-sans">
                  Full Staff Name
                </label>
                <input
                  id="modal-staff-name"
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Cashier Joseph Ajala"
                  className="w-full h-11 px-3 border border-slate-400 rounded-md mt-1 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                />
              </div>

              {/* Input Item 2: Business Email */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="modal-staff-email" className="text-label-md uppercase tracking-widest text-on-surface-variant font-sans">
                  Staff Email Address
                </label>
                <input
                  id="modal-staff-email"
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. joseph.ajala@yourstore.com"
                  className="w-full h-11 px-3 border border-slate-400 rounded-md mt-1 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                />
              </div>
            </form>

            {/* ACTION CONTROLS FOOTER RECTANGLE BAR */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button 
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 h-10 border border-slate-300 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.name || !formData.email}
                className="px-5 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-100 transition-all cursor-pointer disabled:cursor-not-allowed disabled:text-slate-400"
              >
                {isSubmitting ? "Processing..." : "Add Staff Account"}
              </button>
            </div>
          </>
        ) : (
          /* 🎉 EXPERT SUCCESS CONFIRMATION VIEW SCREEN */
          <div className="p-8 flex flex-col items-center justify-center text-center animate-scaleUp">
            
            {/* Animated Success Ring Vector Asset */}
            <div className="w-16 h-16 bg-emerald-50 border-4 border-emerald-100 rounded-full flex items-center justify-center text-emerald-500 mb-5 shadow-inner">
              <svg className="w-8 h-8 animate-checkmark" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Confirmation Title Branding */}
            <h4 className="text-slate-800 text-lg font-black tracking-tight">
              Staff Created Successfully!
            </h4>
            
            {/* High-Utility UX Delivery Message Description */}
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm mt-2 font-medium">
             Staff login details  have been forwarded to <span className="text-slate-800 font-bold font-mono text-xs select-all bg-slate-50 px-1.5 py-0.5 border border-slate-100 rounded-md">{formData.email}</span> via Gmail.
            </p>

            {/* Clear Primary Action Gate Return Button */}
            <button 
              onClick={onClose}
              className="mt-6 w-full max-w-xs h-11 bg-secondary-container hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              Return to Staff Roster
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
