import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosClient';
import logoImg from '../assets/images/logo.png'; // 🎯 Re-used your exact verified relative asset pointer
import logoImage2 from "../assets/images/BizFlow-logo2.png"

/**
 * Enterprise Multi-Tenant Workspace Registration Screen.
 * Dual-pane geometric layout matching the brand's visual system and data properties.
 */
export default function Register() {
  // 📊 Form parameters state management
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverErrorMessage, setServerErrorMessage] = useState('');
  const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    businessEmail: '',
    password: '',
  });

 const [errors, setErrors] = useState({
    businessName: '',
    ownerName: '',
    businessEmail: '',
    password: '',
  });

  // 🎯 REAL-TIME INPUT VALIDATION CAPTURE HANDLER
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // 1. Instantly commit the raw text character parameters to form values state
    setFormData((prev) => ({ ...prev, [name]: value }));

    // 2. Clear out old trace state errors by default during keypress triggers
    let currentErrorMessage = '';

    // 3. Isolate each semantic criteria parameter based on active target field
    switch (name) {
      case 'businessName':
        if (value.trim().length < 3) {
          currentErrorMessage = 'Business name must be at least 3 characters long.';
        }
        break;

      case 'ownerName':
        // Enforces full character naming parameters (First Name + Last Name)
        if (!/^[a-zA-Z]{2,}(?:\s[a-zA-Z]{2,})+$/.test(value.trim())) {
          currentErrorMessage = 'Please enter your first and last name (letters only).';
        }
        break;

      case 'businessEmail':
        // RFC standard matching regex criterion for standard domain queries
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          currentErrorMessage = 'Please enter a valid business email address.';
        }
        break;

      case 'password':
        if (value.length < 8) {
          currentErrorMessage = 'Password must meet the 8 character metric minimum.';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          currentErrorMessage = 'Include at least one uppercase letter, lowercase letter, and number.';
        }
        break;

      default:
        break;
    }

    // 4. Update the errors trace mapping slice state
    setErrors((prev) => ({ ...prev, [name]: currentErrorMessage }));
  };
   const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Safeguard check against submitting unresolved client errors
    if (Object.values(errors).some(msg => msg !== '')) return;

    setIsSubmitting(true);
    setServerErrorMessage('');

    try {
      // 🔮 REMOTE REQUEST LAYER:
      // Replace this simulation delay loop directly with your live `axios.post` / `fetch` query.
      // Example: 
      
      const response = await api.post('/auth/register-business' , {
         business_name:formData.businessName,
         business_email:formData.businessEmail,
         password:formData.password,
         owner_name:formData.ownerName
      });
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(); // Let the server handle validations natively
        }, 1000);
      });
      // console.log(response)
      // Commit full success sequence states 
      setIsSubmittedSuccessfully(true);

    } catch (err) {
      // 🎯 SERVER EXCEPTION CAPTURE: Grabs the exact error message thrown directly by your server
      setServerErrorMessage(err.response?.data?.message || err.message || 'An unexpected operational server warning occurred.');
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

    {/* ========================================================================= */}
    {/* ⚪ REGISTRATION FORM ELEVATED CARD CONTAINER (Now centered standalone) */}
    {/* ========================================================================= */}
        <div className="w-full max-w-115 my-5 bg-surface-lowest border border-slate-200 rounded-md p-8 md:p-10 lg:p-8 shadow-md shadow-slate-400 text-left">
        {isSubmittedSuccessfully ? (
          /* CASE 1: ONBOARDING DISPATCH SUCCESS PANEL */
          <div className="flex flex-col items-center text-center py-4 font-sans">
            <div className="w-14 h-14 bg-emerald-50 border-4 border-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-5 shadow-inner">
              <svg className="w-6 h-6 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-xl font-black text-slate-800 tracking-tight mb-2">
              Account Created Successfully!
            </h2>
            
            <p className="text-body-md text-slate-500 font-sans leading-relaxed mb-6 max-w-sm">
              Your private workspace profile for <span className="font-extrabold text-blue-600">{formData.businessName}</span> has been registered!. You can now securely sign in to initialize your store and register your staff.
            </p>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full h-10 bg-primary hover:bg-secondary-container text-white rounded-lg font-bold text-xs transition-colors shadow-md shadow-blue-200 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Proceed to Sign In</span>
              <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        ) : (
          
          /* CASE 2: REGULAR DATA CAPTURE TERMINAL */
          <>
            <div className="flex flex-col gap-1 mb-6">
              <h2 className="text-headline-md  text-on-surface font-sans tracking-tight">
                Create Your Business Profile
              </h2>
              <p className="text-sm text-slate-500 font-semibold leading-normal">
                Set up your central administrative anchor parameters to deploy your store terminals.
              </p>
            </div>

            {/* ⚠️ HIGH-CONTRAST DYNAMIC REMOTE SERVER EXCEPTION ALIGNMENT BLOCK */}
            {serverErrorMessage && (
              <div className="mb-5 p-3.5 bg-red-50/70 border border-red-100 rounded-xl flex items-start gap-2.5 text-red-700 text-xs font-semibold leading-relaxed">
                <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{serverErrorMessage}</span>
              </div>
            )}

            {/* Interactive Form Elements Block */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              {/* Input 1: Business Name */}
              <div className="flex flex-col gap-1">
                <label htmlFor="businessName" className="text-label-md  tracking-wider text-slate-600">
                  Business Name
                </label>
                <input
                  required
                  disabled={isSubmitting}
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  placeholder="e.g., Global Supermarket Ltd"
                  className={`w-full h-10 px-3 rounded-md border text-label-md mt-1 border-slate-400 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all bg-slate-50/40 shadow-3xs ${
                    errors.businessName ? 'border-red-400 focus:border-red-400 bg-white' : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-100'
                  }`}
                />
                {errors.businessName && <span className="text-[11px] font-medium text-red-500 mt-0.5">{errors.businessName}</span>}
              </div>

              {/* Input 2: Owner Full Name */}
              <div className="flex flex-col gap-1">
                <label htmlFor="ownerName" className="text-label-md  tracking-wider text-slate-600">
                  Owner Full Name
                </label>
                <input
                  required
                  disabled={isSubmitting}
                  type="text"
                  id="ownerName"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleInputChange}
                  placeholder="e.g., Joseph Ajala"
                   className={`w-full h-10 px-3 rounded-md border border-slate-400 text-label-md mt-1 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all bg-slate-50/40 shadow-3xs ${
                    errors.ownerName ? 'border-red-400 focus:border-red-400 bg-white' : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-100'
                  }`}
                />
                {errors.ownerName && <span className="text-[11px] font-medium text-red-500 mt-0.5">{errors.ownerName}</span>}
              </div>

              {/* Input 3: Business Email */}
              <div className="flex flex-col gap-1">
                <label htmlFor="businessEmail" className="text-label-md  tracking-wider text-slate-600">
                  Business Email
                </label>
                <input
                  required
                  disabled={isSubmitting}
                  type="email"
                  id="businessEmail"
                  name="businessEmail"
                  value={formData.businessEmail}
                  onChange={handleInputChange}
                  placeholder="e.g., admin@globalsupermarket.com"
                  className={`w-full h-10 px-3 rounded-md border border-slate-400 text-label-md mt-1 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all bg-slate-50/40 shadow-3xs ${
                    errors.businesEmail ? 'border-red-400 focus:border-red-400 bg-white' : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-100'
                  }`}
                />
                {errors.businessEmail && <span className="text-[11px] font-medium text-red-500 mt-0.5">{errors.businessEmail}</span>}
              </div>

              {/* Input 4: Password Entry Field */}
                        {/* Input 4: Password Entry Field */}
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-label-md  tracking-wider text-slate-600">
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
                  className={`w-full h-10 pl-4 pr-11 rounded-md border text-label-md border-slate-400 mt-1 text-slate-700 focus:outline-none focus:bg-white transition-all bg-slate-50/40 shadow-3xs ${
                    showPassword ? "tracking-normal" : "tracking-widest placeholder:tracking-normal"
                  } ${errors.password ? 'border-red-400 focus:border-red-400 bg-white' : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-100'}`}
                />
                
                {/* 🎯 FIX 1: Filled the empty ternary brackets with valid inline SVG icons */}
                <button
                  type="button"
                  disabled={isSubmitting}
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
              {errors.password && <span className="text-[11px] font-medium text-red-500 mt-0.5">{errors.password}</span>}
            </div>

            {/* 🎯 FIX 2: Resolved unclosed string tags inside your loading spinner ternary hook */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-primary hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-md font-bold text-body-md transition-all shadow-md shadow-blue-100 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
              ) : (
                <span>Deploy Business Profile</span>
              )}
            </button>
          </form>

          {/* 🎯 FIX 3: Replaced the broken '</>' fragment closure with an explicit '</button>' tag */}
          <div className="mt-6 pt-5 border-t border-slate-300 text-center text-body-sm  text-slate-400">
            Already managing an active supermarket console?{" "}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-primary hover:text-blue-700 hover:underline transition-colors text-body-sm cursor-pointer bg-transparent border-none p-0 ml-0.5"
            >
              Sign In Here
            </button>
          </div>
          </>)}
          
              </div>
              </div>
  )}