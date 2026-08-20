import { useState } from "react";

const ProfilePage = () => {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false)

  return (
    <div className="min-h-screen bg-[#f8fafc] ">
      {/* Page Header */}
      <header className="flex w-full pt-3 pb-3 items-center justify-between border-b border-slate-400 bg-surface-lowest px-4 sm:px-6">
        <h1 className="text-headline-md font-sans text-primary-container">
          Profile Settings
        </h1>

        <button  type="button"  className="inline-flex items-center justify-center p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer group shadow-xs select-none"
             aria-label="Open user account profile settings menu">
            <div className="w-9 h-9 rounded-full bg-primary text-white border border-blue-400/20 flex items-center justify-center font-bold font-sans text-[13px] uppercase shrink-0 shadow-md transition-transform duration-200 group-hover:scale-95">
                JA
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
                JA
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
                    <p className="h-8 w-full flex items-center mt-2 rounded-sm border border-slate-200 bg-white px-2.5 text-body-md text-slate-600 ">
                        Sarah Jenkins
                    </p>
              </div>

              {/* Business Name */}
              <div>
                <p className="mb-1 block text-label-md  text-on-surface">
                 Business Name
                </p>
                    <p className="h-8 w-full flex items-center mt-2 rounded-sm border border-slate-200 bg-white px-2.5 text-body-md text-slate-600 ">
                        Jenkins Logistics LLC
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
                    value="sarah.j@baazio-client.com"
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
                    Pro Plan
                  </h4>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 rounded-sm border border-emerald-300 bg-[#ECFDF3] px-3 py-1 text-label-md font-medium text-[#15803D]">
                    Status: Active
                    <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                  </span>

                  <p className="mt-1 font-sans text-body-md text-slate-500">
                    Next Renewal:{" "}
                    <span className="font-semibold text-[#334155]">
                      Sep 19, 2026
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
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
              <div className="mb-3 flex items-center justify-between">
                <span className="text-label-md text-[#64748B]">
                  Active Cashier Profiles
                </span>

                <span className="text-label-md font-mono text-[#334155]">
                  3 / 5
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-surface-high">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: "60%" }}
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
                  412 / 2,000
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-surface-high">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: "20.6%" }}
                />
              </div>
            </div>
          </section>

          {/* Security */}
          <section className="rounded-md border border-slate-300 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-headline-md text-[#0F172A]">
              Security
            </h3>

            <div className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="mb-1 font-sans text-label-md font-medium text-on-surface-variant">
                  Current Password
                </label>

                <div className="relative w-full">
                <input
                  required
                  type={showPassword ? "text" : "password"}
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
                className="rounded-md border border-secondary bg-secondary px-3 py-1.5 text-label-md font-medium text-white transition "
              >
                Change Password
              </button>

              {/* Logout */}
              <button
                type="button"
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
                onClick={() => setShowEditProfile(false)}
                className="text-slate-500 hover:text-[#334155]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-label-md font-medium text-on-surface">
                  Full Name
                </label>

                <input
                  type="text"
                  defaultValue="Sarah Jenkins"
                  className="h-9 w-full rounded-md border border-slate-300 mt-2 px-3 text-body-sm outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="mb-1  text-label-md font-medium text-on-surface">
                  Business Name
                </label>

                <input
                  type="text"
                  defaultValue="Jenkins Logistics LLC"
                  className="h-9 w-full rounded-md border border-slate-300 mt-2 px-3 text-body-sm outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowEditProfile(false)}
                className="rounded-md border border-slate-300 px-4 py-1 text-body-md font-medium text-on-surface-variant hover:bg-[#F8FAFC]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => setShowEditProfile(false)}
                className="rounded-md bg-secondary px-4 py-1 text-body-md  text-white hover:bg-[#1D4ED8]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;