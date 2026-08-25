import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosClient";
import AlertModal from "../components/alert";
import axios from 'axios';
const ProfilePage = () => {
  const navigate = useNavigate()
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [newUserName, setNewUserName] = useState("")
  const [newBusinessName, setNewBusinessName] = useState("")
  const [userData, setUserData] = useState({})
  const [subscription, setSubscription] = useState({})
  const [Usage, setUsage] = useState(null)
  const [staffCount, setStaffCount] = useState(0)
  const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
   const [passwordChangeError, setPasswordChangeError] = useState("")
   const [accountUpdateError, setAccountUpdateError] = useState("")
   const [isSubmitting, setIsSubmitting] = useState(false);
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
    const fetchData =async ()=>{
      try{
        const [userDataResponse, staffResponse, usageResponse] = await Promise.all([
           api.get('/auth/me', { headers: { Authorization: `Bearer ${accessToken}` } }),
            api.get("/auth/all-staff",{ headers: { Authorization: `Bearer ${accessToken}` } }),
            api.get("/auth/subscription/usage",{ headers: { Authorization: `Bearer ${accessToken}` } }),
        ])
        setUserData(userDataResponse.data.data)
        const subscriptionData =userDataResponse.data.data.subscriptions
        if(subscriptionData && subscriptionData.length>0){
           const activeSub = subscriptionData[0];
          setSubscription({
            plan_name: activeSub.plan.plan_name,
            expired_at:activeSub.expired_at,
            status:activeSub.status,
            max_staff:activeSub.plan.max_staff,
            max_sales :activeSub.plan.max_sales
          })
        }
        setStaffCount(staffResponse.data.data.length)
        setUsage(usageResponse.data.data)
      }catch(err){
         console.error("Failed to fetch profile metadata:", err);
      }
    }
    fetchData()
  }, [accessToken])
  const initials = userData?.owner_name
  ? userData.owner_name
      .split(" ")
      .map(n => n[0])
      .join("")
  : "";
  const todayTimestamp = new Date();
  const activePlanStatus = subscription.expired_at && new Date(subscription.expired_at) < todayTimestamp
  ? "expired"
  : subscription.status || "inactive";
  const maxSalesLimit= Usage?.salesLimitAllowed || 300;
  const currentSalesCount= Usage?.salesUsedThisMonth || 0;
  const salesProgressPercent = maxSalesLimit==="UNLIMITED"?10:(currentSalesCount / maxSalesLimit) * 100
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
          Authorization: `Bearer ${accessToken}` // 🚀 Now passes your token gate cleanly! [S4]
        }
      }
    );
    console.log("Backend session cookie signatures revoked successfully.")
  } catch (error) {
    console.warn("Server logout notification dropped or already expired:", error.error || error.message);
  }
  };
  const handleUpdateAccount = async () =>{
    try{
       const cleanName = newUserName.trim();
      const cleanBusiness = newBusinessName.trim();
      if (!cleanName || !cleanBusiness) {
      setAccountUpdateError("Validation Check: all input fields are required to update your workspace.")
      return; // 
    }
    await api.patch("/auth/update-account", 
      {
        newOwnerName: cleanName,
        newBusinessName: cleanBusiness
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    setAccountUpdateError("")
    setNewBusinessName("")
    setNewUserName("")
    // console.log(response.data)
    setModalConfig({
      isOpen: true,
      type: "success", 
      title: "Password Changed Successfully",
      message: "Your Store account parameters have been updated successfully.",
      actionLabel: "Return to Profile" 
    });
    setShowEditProfile(false)
    }catch(error){
      console.error("❌ Profile modification request rejected on frontend client:", error);
       const serverErrorMessage = error.response?.data?.message;
       setAccountUpdateError(serverErrorMessage)
    }
  }
  return (
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
        {/* Profile Header Card */}
        <section className="mb-5 rounded-md border border-slate-300 bg-surface-lowest p-5 shadow-[0_2px_6px_rgba(15,23,42,0.04)]">
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
                  {userData?.owner_name} 
                </h2>

                <p className="mt-0.5 text-body-md text-slate-400">
                  {userData?.business_email}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-surface-highest px-3 py-1 text-label-md  font-sans text-on-surface">
                    Role: {userData?.role==="OWNER" ?"Business Owner":""}
                  </span>

                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-[#ECFDF3] px-3 py-1 text-label-md font-medium text-[#15803D]">
                    Status: Active
                    <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowEditProfile(true)}
              className="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 text-body-md border border-primary text-surface-lowest transition hover:bg-primary-container"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 20h9"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
                />
              </svg>
              Edit Profile
            </button>
          </div>
        </section>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Personal Details */}
          <section className="rounded-md border border-slate-300 bg-surface-lowest p-5 shadow-sm ">
            <h3 className="mb-4 text-headline-md  text-on-surface-variant font-sans">
              Personal Details
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Full Name */}
              <div>
                <p className="mb-1 block text-label-md  text-on-surface">
                  Full Name
                </p>
                    <p className="h-8 w-full flex items-center capitalize mt-2 rounded-sm border border-slate-200 bg-white px-2.5 text-body-md text-slate-600 ">
                        {userData?.owner_name}
                    </p>
              </div>

              {/* Business Name */}
              <div>
                <p className="mb-1 block text-label-md  text-on-surface">
                 Business Name
                </p>
                    <p className="h-8 w-full flex items-center capitalize mt-2 rounded-sm border border-slate-200 bg-white px-2.5 text-body-md text-slate-600 ">
                        {userData?.business_name}
                    </p>
                
              </div>

              {/* Email */}
              <div className="sm:col-span-2">
                <label className="mb-1 block text-label-md  text-on-surface">
                  Email Address
                </label>

                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <rect
                        width="18"
                        height="12"
                        x="3"
                        y="6"
                        rx="2"
                      />
                      <path d="m3 7 9 6 9-6" />
                    </svg>
                  </span>

                  <input
                    type="email"
                    value={userData?.business_email}
                    readOnly
                    className="h-8 w-full rounded-sm border border-slate-200 bg-slate-100 pl-8 pr-2.5 text-label-md text-slate-600 outline-none"
                  />
                </div>

                <p className="mt-1.5 text-sm text-slate-400">
                  Contact support to change your primary email.
                </p>
              </div>
            </div>
          </section>

          {/* Subscription */}
          <section className="rounded-md border border-slate-300 bg-surface-lowest p-5 shadow-sm">
            <h3 className="mb-4 text-label-lg  text-on-surface-variant font-sans">
              Subscription Summary
            </h3>

            <div className="rounded-md border border-slate-200 bg-surface-low p-3.5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-label-md text-[#64748B]">
                    Current Plan
                  </p>

                  <h4 className="mt-0.5 text-body-md font-bold text-primary">
                    {subscription?.plan_name}
                  </h4>
                </div>

                <div className="text-right">
                {activePlanStatus === "expired" ? (
                    <span className="text-[10px] font-black text-red-600 bg-red-50 border border-red-100 rounded-lg px-2.5 py-0.5 uppercase tracking-wider select-none animate-pulse inline-flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-red-500" />
                      Expired
                    </span>
                  ) : (
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg px-2.5 py-0.5 uppercase tracking-wider select-none inline-flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                      Active
                    </span>
                  )}
                  <p className="mt-1 font-sans text-body-md text-slate-500">
                    Next Renewal:{" "}
                    <span className="font-semibold text-[#334155]">
                      {
                        subscription.expired_at ? (
                          // 🎯 THE EXACT FIX: Converts raw timestamps into clear words natively!
                          new Date(subscription.expired_at).toLocaleDateString('en-NG', { 
                            month: 'long',  // 📝 Explodes "09" out into full word string "September"
                            day: 'numeric', // 🔢 Displays "19"
                            year: 'numeric' // 🔢 Displays "2026"
                          })
                        ) : (
                          "Loading date parameter..."
                        )
                      }
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>navigate("/admin-dashboard/billing")}
              className="mt-5 h-10 w-full rounded-md border border-secondary bg-secondary text-label-md text-white transition hover:bg-primary-container hover:border-primary-container"
            >
              Manage Plan
            </button>
          </section>

          {/* Usage */}
          <section className="rounded-md border border-slate-300 bg-surface-lowest p-5 shadow-sm">
            <h3 className="mb-5 text-headline-md font-sans text-on-surface">
              Usage
            </h3>

            {/* Staff */}
            <div className="mb-6">
              <div className="mb-3 flex flex-row items-center justify-between">
                <span className="text-label-md text-[#64748B]">
                  Active Cashier Profiles
                </span>

                <span className="text-label-md font-mono text-[#334155]">
                  {staffCount} / {subscription.max_staff ===999999? "UNLIMITED":subscription.max_staff}
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-surface-high">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{
                  // 🚀 THE EXACT MATH FIX: Forces 100% fill if unlimited, else 
                  width: subscription.max_staff === 999999 
                    ? "10%" 
                    : `${Math.min(100, (staffCount / (subscription.max_staff || 1)) * 100)}%`
                }}
                />
                
              </div>
            </div>

            {/* Sales */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-label-md text-[#64748B]">
                  Sales Recorded 
                </span>

                <span className="text-label-md font-mono text-[#334155]">
                  {currentSalesCount} / {subscription.max_sales ===999999? "UNLIMITED":subscription.max_sales}
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-surface-high">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width:`${salesProgressPercent}%`}}
                />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-300 text-left">
            <p className="text-body-sm font-sans text-slate-500 font-medium leading-relaxed">
              💡 <span className="font-bold text-slate-700">Baazio Core Parameter Diagnostics:</span> Your store is currently running on the <span className="font-bold text-blue-600 uppercase">{subscription.plan_name?.replace('_', ' ')}</span> package tier. Resource ceilings reset automatically upon account lifecycle renewal on <span className="font-mono font-bold text-slate-700 bg-slate-100 border border-slate-200/60 rounded px-1.5 py-0.5">{new Date(subscription.expired_at).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}</span>.
            </p>
          </div>
          </section>

          {/* Security */}
          <section className="rounded-md border border-slate-300 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-headline-md text-[#0F172A]">
              Security
            </h3>

            <div className="space-y-4">
              {/* <div className="border rounded-lg p-2"> */}
                <p className="text-body-md  text-tertiary text-center">
                {passwordChangeError}
              </p>
              {/* </div> */}
              
              {/* Current Password */}
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

              <button
                type="button"
                onClick={handleChangePassword}
                 disabled={isSubmitting}
                className="rounded-md border border-secondary bg-secondary px-3 py-1.5 text-label-md font-medium text-white transition "
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

              {/* Logout */}
              <button
                type="button"
                onClick={handleSignOut}
                className="flex h-9 w-full items-center justify-center gap-1.5 rounded-md border border-[#FECACA] bg-[#FFF1F2] text-body-md font-semibold text-[#EF4444] transition hover:bg-[#FEE2E2]"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                  <path d="M16 17l5-5-5-5" />
                  <path d="M21 12H9" />
                </svg>
                Log Out 
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/60 px-4">
          <div className="w-full max-w-md rounded-md bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-headline-md font-sans text-[#0F172A]">
                Edit Profile
              </h2>

              <button
                type="button"
                onClick={() =>{ setShowEditProfile(false), setAccountUpdateError("")}}
                className="text-slate-500 hover:text-[#334155]"
              >
                ✕
              </button>
              
            </div>
          <p className="text-body-md  text-tertiary text-center">
                  {accountUpdateError}
                </p>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-label-md font-medium text-on-surface">
                  Full Name
                </label>

                <input
                  type="text"
                  onChange={(e) =>setNewUserName(e.target.value)}
                  defaultValue={userData?.owner_name}
                  className="h-9 w-full rounded-md border border-slate-300 mt-2 px-3 text-body-sm outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="mb-1  text-label-md font-medium text-on-surface">
                  Business Name
                </label>

                <input
                  type="text"
                  defaultValue={userData?.business_name}
                  onChange={(e) =>setNewBusinessName(e.target.value)}
                  className="h-9 w-full rounded-md border border-slate-300 mt-2 px-3 text-body-sm outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() =>{setShowEditProfile(false), setAccountUpdateError("")}}
                className="rounded-md border border-slate-300 px-4 py-1 text-body-md font-medium text-on-surface-variant hover:bg-[#F8FAFC]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateAccount}
                className="rounded-md bg-secondary px-4 py-1 text-body-md  text-white hover:bg-[#1D4ED8]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
       <AlertModal 
          isOpen={modalConfig.isOpen}
          type={modalConfig.type}
          title={modalConfig.title}
          message={modalConfig.message}
          actionLabel={modalConfig.actionLabel}
          onAction={handleCloseModal} 
          onClose={handleCloseModal}  
        />
    </div>
  );
};

export default ProfilePage;