import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axiosClient';
import AlertModal from './alert';
import { useAuthStore } from '../store/authStore';
export default function ForgotPasswordModal({ isOpen, onClose }) {
  // 🧭 STAGE MANAGEMENT STATE MATRIX
  const [resetStage, setResetStage] = useState("EMAIL_STAGE"); // "EMAIL_STAGE" | "OTP_AND_PASSWORD_STAGE"
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const setResetEmail = useAuthStore((state) => state.setResetEmail);
  const resetEmail = useAuthStore((state) => state.resetEmail);
  // 📝 DATA FIELD HOOKS
  const [emailInput, setEmailInput] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, type: "success", title: "", message: "", actionLabel: "", onAction: () => {} });
  const triggerAlert = (config) => setAlertConfig({ ...config, isOpen: true });
  const closeAlert = () => setAlertConfig((prev) => ({ ...prev, isOpen: false }));

  // ⏱️ COUNTDOWN TIMER HOOKS
  const [countdown, setCountdown] = useState(0);
  // Trigger automated countdown loops whenever countdown value increments past zero
  useEffect(() => {
    if(countdown <=0){
      return
    }
    const timer = setInterval(() =>{
      setCountdown(prev => prev-1)
    }, 1000)
    return () => clearInterval(timer);
  }, [countdown]);

  const minute = Math.floor(countdown/60)
  const seconds = countdown%60
  if (!isOpen) return null;

  // 📡 STAGE 1: SUBMIT EMAIL FOR RESET TOKEN INITIALIZATION
  const handleRequestResetOtp = async (e) => {
    e?.preventDefault();
    if (!emailInput) {
      return setErrorMessage("Please supply a valid corporate email address.");
    }
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await api.post("/auth/forgot-password", { email: emailInput });
      if(response.status = "success"){
             setSuccessMessage("Security token sent! Check your email inbox/spam for your 6-digit OTP verification code.");
            setResetStage("OTP_AND_PASSWORD_STAGE");
            setCountdown(3*60); 
        }
      // Initialize a strict 60-second lock parameter [S4]
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || "Verification Refused: Account lookup failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2 resend verification code  function 
  const handleResendVerificationCode = async () =>{
    if (isSubmitting){
      return
    } 
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
    try{
      const response = await api.post("/auth/resend-otp")
      console.log(response.data)
      if(response.data.status ==="success"){
        setSuccessMessage("A fresh 6-digit confirmation parameter has landed in your inbox.")
        setCountdown(3*60)
      }
    }catch(err){
      const serverFeedback = err.response?.data?.message || "Unable to complete token dispatch over network ports.";
      setErrorMessage(serverFeedback);
    } finally {
      setIsSubmitting(false);
    }
  }
    const handleAbsoluteCloseout = () => {
    setAlertConfig(prev => ({ ...prev, isOpen: false }));
    setResetStage(" ");
    setOtpInput("");
    setEmailInput("")
    setNewPasswordInput("");
    setSuccessMessage("")
    setErrorMessage(" ")
    onClose(); 
    window.location.reload();
  };
  // 📡 STAGE 3: PROCESS VERIFICATION AND COMMIT UPGRADE CRITERIA
  const handleExecutePasswordReset = async (e) => {
    setSuccessMessage("")
    e.preventDefault();
    if (!otpInput || !newPasswordInput) {
      return setErrorMessage("All verification and password slots are mandatory.");
    }
    const passwordStrengthRegex = /^(?=.*[A-Z])(?=.*[a-line])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (newPasswordInput.length < 8){
      return setErrorMessage("Security Constraint: Password must equal or exceed 8 characters.");
    } 

     if (!passwordStrengthRegex.test(newPasswordInput)) {
      return setErrorMessage(
        "Security Constraint: Password must include at least one uppercase letter, one lowercase letter, one number, and one special character character symbol (!@#$%)."
      );
    }
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const reset = await api.post("/auth/reset-password", {
        otpCode: otpInput,
        new_password: newPasswordInput
      });
      // console.log(reset.data)
      // if(reset.data.status ==="success"){
        triggerAlert({
                type: "success",
                title: "Password Reset Successfully",
                message: "🎉 Security profile altered successfully! Proceeding back to login gate.",
                actionLabel: "Return to Login",
                onAction: handleAbsoluteCloseout,
                onClose: handleAbsoluteCloseout
              });
            // }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || "Invalid Token: The supplied OTP code is incorrect or expired.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs z-50 select-none animate-fadeIn font-sans">
      <div className="w-full max-w-110 bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-2xl relative animate-scaleUp text-left">
        
        <button 
          type="button" 
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center"
        >
          <svg className="w-4 h-4 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {/* ========================================================================= */}
        {/* STAGE A: EMAIL REQUEST INTERFACE FORM */}
        {/* ========================================================================= */}
        {resetStage === "EMAIL_STAGE" && (
          <div className="space-y-5">
            <div className="space-y-1">
              <h3 className="text-headline-md font-sans text-on-surface tracking-tight">Recover Secure Credentials</h3>
              <p className="text-body-md text-slate-600 font-sans leading-normal">Enter your registered workspace email address.</p>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50/70 border border-red-100 rounded-lg text-red-700 text-xs font-semibold flex gap-2 leading-relaxed">
                <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleRequestResetOtp} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="textlabel-md font-sans  tracking-tight text-slate-600">Register Email Addresss</label>
                <input 
                  required
                  type="email"
                  disabled={isSubmitting}
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="admin@globalsupermarket.com"
                  className="w-full h-11 px-3.5 rounded-md mt-1 border border-slate-400 text-label-md text-slate-700 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all bg-slate-50/40 shadow-3xs"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10 bg-primary-container hover:bg-secondary disabled:bg-slate-300 disabled:text-primary-container text-white rounded-lg font-bold text-xs transition-all shadow-md shadow-blue-100 flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Processing" :"Send Verification Code ➔"}
              </button>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STAGE B: TOKEN ENTRY AND PASSWORD RESET REGENERATOR */}
        {/* ========================================================================= */}
        {resetStage === "OTP_AND_PASSWORD_STAGE" && (
          <div className="space-y-5">
            <div className="space-y-1">
              <h3 className="text-headline-md text-slate-800 tracking-tight font-sans">Security Token Verification</h3>
             
            </div>

            {/* Notification messages alerts grid */}
            {successMessage && <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold rounded-xl leading-relaxed">{successMessage}</div>}
            {errorMessage && <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-xs font-semibold rounded-xl leading-relaxed">{errorMessage}</div>}

            <form onSubmit={handleExecutePasswordReset} className="space-y-4">
              
              {/* Input: OTP Token */}
              <div className="flex flex-col gap-1">
                <label className="text-label-md tracking-wider text-slate-600 font-sans">
                    Verification OTP
                    </label>
                <input 
                  required
                  type="text"
                  maxLength={6}
                  disabled={isSubmitting}
                  value={otpInput}
                  maxLength={6}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))} // Strictly forces digits parameters formatting
                  placeholder="e.g. 482910"
                  className="w-full h-10 px-3 text-center font-mono tracking-[0.4em] text-label-md rounded-md border border-slate-300 text-slate-800 mt-1 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all bg-slate-50/40 shadow-3xs"
                />
              </div>

              {/* Input: New Password Entry */}
              <div className="flex flex-col gap-1">
                <label className="text-label-md tracking-wider text-slate-600 font-sans">
                 New Account Password
                    </label>
                <div className="relative w-full">
                  <input 
                    required
                    type={showPassword ? "text" : "password"}
                    disabled={isSubmitting}
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    placeholder="••••••••"
                                        className={`w-full h-11 pl-4 pr-11 rounded-md  border border-slate-300 text-label-md mt-1 text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all bg-slate-50/40 shadow-3xs ${
                      showPassword ? "tracking-normal" : "tracking-widest placeholder:tracking-normal"
                    }`}
                  />
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer flex items-center justify-center transition-colors focus:outline-none"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Action Trigger Buttons Split Rows */}
              <div className="space-y-2 pt-2 flex flex-row justify-between gap-2">
                

                {/* THROTTLED RESEND OTP TRIGGER CELL */}
                <button
                  type="button"
                  disabled={countdown > 0 || isSubmitting}
                  onClick={handleResendVerificationCode}
                  className={`w-full h-10 border text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1 bg-white shadow-3xs ${
                    countdown > 0 
                      ? "border-slate-300 bg-slate-50 text-slate-400 cursor-not-allowed" 
                      : "border-slate-400 text-slate-600 hover:bg-slate-50 cursor-pointer"
                  }`}
                >
                  {countdown > 0 ? (
                    <span>Time: {String(minute).padStart(2,"0")}:{String(seconds).padStart(2,"0")}</span>
                  ) : (
                    <span>Resend Code</span>
                  )}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-10 bg-primary-container hover:bg-blue-700 text-white rounded-lg text-label-md transition-all shadow-md shadow-blue-100 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>Reset Password</span>
                  )}
                </button>
              </div>

             
            </form>
          </div>
        )}
      <AlertModal 
          isOpen={alertConfig.isOpen}
          type={alertConfig.type}
          title={alertConfig.title}
          message={alertConfig.message}
          actionLabel={alertConfig.actionLabel}
          onAction={handleAbsoluteCloseout}
          onClose={handleAbsoluteCloseout}
        />
      </div>
    </div>
  );
}
