import React, { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios"
import api from '../api/axiosClient';
import ForgotPasswordModal from '../components/forgotPassword';
import { useAuthStore } from '../store/authStore';
import logoImage2 from "../assets/images/baazio logo(1).png";

export default function Login() {
  const navigate = useNavigate();

  // 🎯 IDENTITY GATEWAY SELECTOR LAYER: "owner" or "staff"
  const [activeTab, setActiveTab] = useState('owner');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverErrorMessage, setServerErrorMessage] = useState('');
  const setAuthSession = useAuthStore((state) => state.setAuthSession)
  const setUserRole = useAuthStore((state) => state.setUserRole)
   const [isForgotOpen, setIsForgotOpen] = useState(false);
   const [remainingSeconds, setRemainingSeconds] = useState(0)
  // 📊 Local Form Input Field Parameters
  const [formData, setFormData] = useState({ email: '',password: '',});
  const [errors, setErrors] = useState({email: '', password: '', });

  useEffect(() => {
  if (remainingSeconds <= 0){
    return;
  } 
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [remainingSeconds]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFormData({ email: '', password: '' });
    setErrors({ email: '', password: '' });
    setServerErrorMessage('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (serverErrorMessage) setServerErrorMessage('');

    let currentErrorMessage = '';
    if (name === 'email') {
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
        currentErrorMessage = 'Please enter a valid business or staff email address.';
      }
    }
    setErrors((prev) => ({ ...prev, [name]: currentErrorMessage }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(errors).some(msg => msg !== '')) return;

    setIsSubmitting(true);
    setServerErrorMessage('');
    // Dynamically point backend transactions based on roles filter
    const targetedUrl = activeTab === 'owner' 
      ? '/auth/login-business' 
      : '/auth/login-staff';

    try {
      const response = await api.post(targetedUrl, {
        email: formData.email,
        password: formData.password
      },
          {
            withCredentials: true 
          }
    );
      
        if(response.data && response.data.accessToken){
          setAuthSession(response.data.accessToken)
          setUserRole(response.data.profile.role)
        }
      // 🗺️ WORKSPACE REDIRECT GATES: Send validated identities to their distinct screens
      if (activeTab === 'owner') {
        navigate('/admin-dashboard', { replace: true }); 
      } 
      if(activeTab ==="staff") {
        navigate('/staff-dashboard', { replace: true });
      }

    } 
   catch (err) {
  const statusCode = err.response?.status;
  const explicitMessage =err.response?.data?.message || "Authentication error occurred.";

  // 🔒 Account temporarily locked
  if (statusCode === 429) {
    const retryAfter = err.response?.data?.retryAfter;
    if (retryAfter) {
      setRemainingSeconds(retryAfter);
    }
    // setServerErrorMessage("Too many failed login attempts. Please wait before trying again.");
    return;
  }

  if (explicitMessage.includes("not found")) {
    if (activeTab === "owner") {
      setServerErrorMessage("Business not found");
    } else {
      setServerErrorMessage("Staff terminal not found");
    }
  } else if (explicitMessage.includes("Invalid crediential")) {
    setServerErrorMessage("Invalid credentials");
  } else if (explicitMessage.includes("deactivated")) {
    setServerErrorMessage(
      "Your staff account has been deactivated by management. Please contact your administrator."
    );
  } else {
    setServerErrorMessage(explicitMessage);
  }
} finally {
  setIsSubmitting(false);
}
  };
  return (
   <div className="w-full min-h-screen flex items-center justify-center bg-surface-low relative overflow-hidden select-none selection:bg-primary-fixed">
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute top-[-30%] left-[-20%] w-[70%] h-[70%] rounded-full bg-blue-400/10 blur-[120px] animate-pulse duration-4000" />
    <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-300/10 blur-[100px] animate-pulse duration-6000" />
  </div>
  <div 
    className="absolute inset-0 opacity-[5] pointer-events-none z-0 mix-blend-multiply"
    style={{
      backgroundImage: `radial-gradient(#cbd5e1 1.2px, transparent 1.2px)`,
      backgroundSize: '24px 24px',
      // Creates a soft vignetting effect so dots gracefully fade out towards the viewport boundaries
      maskImage: 'radial-gradient(circle at center, black 40%, transparent 85%)',
      WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 85%)'
    }}
  />

      {/* ⚪ RIGHT PANE: DYNAMIC ACCESS TERMINAL MATRIX CARD */}
      <div className="w-full flex flex-col justify-between items-center p-6 md:p-12 lg:p-6">
        
        {/* Ghost structural balancer div to center card layout vertically */}
        <div className="hidden md:block h-4"></div>

        {/* Central Core Onboarding Card Element Frame */}
        <div className="w-full max-w-115 bg-surface-lowest border border-slate-200 rounded-md p-8 md:p-10 lg:p-8 shadow-md shadow-slate-400 text-left">
          
          {/* Card Headings Copy */}
          <div className="flex flex-col gap-2 mb-6">
            <h2 className="text-headline-md text-on-surface font-sans  tracking-tight">
              Sign In to Your Workspace
            </h2>
            <p className="text-body-md text-[#64748b] font-sans  leading-normal">
              Enter your registered business or staff credentials to open your terminal lines.
            </p>
          </div>

          {/* 🎯 SUB-GATEWAY TABS SWITCHER (Integrated to handle different tables smoothly) */}
          <div className="w-full p-1 bg-slate-100 rounded-lg flex items-center mb-6 border border-slate-200/40">
            <button
              type="button"
              onClick={() => handleTabChange('owner')}
              className={`flex-1 text-center py-2 text-[12px] font-sans font-bold rounded-md transition-all cursor-pointer ${
                activeTab === 'owner' ? 'bg-white text-[#2152ff] shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Store Owner
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('staff')}
              className={`flex-1 text-center py-2 text-[12px] font-sans font-bold rounded-md transition-all cursor-pointer ${
                activeTab === 'staff' ? 'bg-white text-[#2152ff] shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Staff Terminal
            </button>
          </div>

          {/* Error Logging Notification Panel */}
          {serverErrorMessage && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-100 rounded-md text-red-700 text-[13px] font-sans leading-relaxed">
              <p>{serverErrorMessage}</p>
            </div>
          )}
            {/* Too many login failure */}
            {remainingSeconds > 0 && (
                <p className="text-body-sm mb-2 text-error text-center">
                  Too many failed login attempts. Try again in{" "}
                  <span className="font-mono font-bold">
                    {minutes}:{seconds.toString().padStart(2, "0")}
                  </span>
                </p>
              )}
          {/* Login Form Layout Block */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* Input 1: Username / Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-label-md font-sans  text-on-surface-variant">
                {activeTab === 'owner' ? 'Business Email Address' : 'Staff Login Email'}
              </label>
              <input
                required
                disabled={isSubmitting}
                type={activeTab === 'owner' ? "email" : "email"}
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={activeTab === 'owner' ? "e.g., admin@globalsupermarket.com" : "e.g., staff@gmail.com"}
                className={`w-full h-11 px-4 rounded-md mt-1 border font-sans text-body-sm text-[#0f172a] disabled:bg-slate-50 placeholder:text-slate-400 focus:outline-none transition-colors bg-white ${
                  errors.email ? 'border-red-500 focus:border-red-500' : 'border-[#cbd5e1] focus:border-[#2152ff]'
                }`}
              />
              {errors.email && <span className="text-[12px] font-sans font-medium text-red-500 mt-1">{errors.email}</span>}
            </div>

            {/* Input 2: Password Entry with Eye Toggle */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-label-md font-sans  text-on-surface-variant">
                Password
              </label>
              <div className="relative w-full">
                <input
                  required
                  disabled={isSubmitting}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={`w-full h-11 pl-4 pr-12 rounded-md mt-1 border font-sans text-body-sm text-[#0f172a] disabled:bg-slate-50 focus:outline-none transition-colors bg-white border-[#cbd5e1] focus:border-[#2152ff] ${
                    showPassword ? "tracking-normal" : "tracking-widest placeholder:tracking-normal"
                  }`}
                />
                
                {/* 👁️ PASS CONTROLLER ACCESSIBILITY TOGGLE BUTTON */}
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none cursor-pointer flex items-center justify-center"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Checkbox and Forgot Row Element */}
            <div className="w-full flex items-center justify-between text-[13px] font-sans font-medium mt-1">
              <label className="flex items-center gap-2 text-[#64748b] cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300 text-[#2152ff] focus:ring-[#2152ff] w-4 h-4" />
                <span>Remember Session</span>
              </label>
              <button type="button" onClick={() => setIsForgotOpen(true)}>
                  <Link to="" className="text-[#2152ff] hover:underline font-semibold">
                Forgot Password?
              </Link>
              </button>
              
            </div>

            {/* Submit Action Button Core Component */}
           <button
  type="submit"
  disabled={isSubmitting || remainingSeconds > 0}
  className={`w-full h-12 rounded-lg font-sans font-semibold text-[14px]
    transition-all duration-200 mt-3 flex items-center justify-center gap-2
    shadow-sm
    ${
      remainingSeconds > 0
        ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
        : isSubmitting
          ? "bg-[#2152ff]/70 text-white cursor-not-allowed"
          : "bg-[#2152ff] hover:bg-[#1a44d6] text-white cursor-pointer"
    }
  `}
>
  {remainingSeconds > 0 ? (
    <>
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v6l4 2"
        />
        <circle cx="12" cy="12" r="9" />
      </svg>

      <span>
        Try again in{" "}
        {Math.floor(remainingSeconds / 60)}:
        {String(remainingSeconds % 60).padStart(2, "0")}
      </span>
    </>
  ) : isSubmitting ? (
    <>
      <svg
        className="animate-spin h-5 w-5 text-white/70"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />

        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>

      <span>Opening Terminal Session...</span>
    </>
  ) : (
    <>
      <span>Open Terminal Session</span>

      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11 16l4-4m0 0l-4-4m4 4H3"
        />
      </svg>
    </>
  )}
</button>
          </form>

          {/* Bottom Secondary Redirect Routing Block */}
          <div className="w-full text-center text-body-md font-sans text-slate-500 mt-6">
            New to the platform?{' '}
            <Link to="/register" className="text-body-sm text-secondary hover:underline">
              Create a free Account
            </Link>
          </div>
        </div>

        {/* 🗺️ ACCESSIBILITY LOW FOOTNOTE NAV LINKS SECTION */}
        <div className="flex gap-4 items-center justify-center text-[11px] font-sans font-bold tracking-wider text-[#94a3b8] mt-8 uppercase">
          <Link to="/help" className="hover:text-slate-600 transition-colors">Help Center</Link>
          <span className="text-slate-300">•</span>
          <Link to="/privacy-policy" className="hover:text-slate-600 transition-colors">Privacy Policy</Link>
          <span className="text-slate-300">•</span>
          <Link to="/terms" className="hover:text-slate-600 transition-colors">Terms</Link>
        </div>
          <ForgotPasswordModal 
        isOpen={isForgotOpen} 
        onClose={() => setIsForgotOpen(false)} 
      />
      </div>
    {/* </div> */}
    </div>
  );
}
