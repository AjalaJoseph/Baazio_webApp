import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axiosClient';
import axios from 'axios';
import logoImage2 from "../assets/images/new baazio logo (2).png";
import { useAuthStore } from '../store/authStore';
export default function OwnerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
   const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [userData, setUserData] = useState([])
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAuthSession = useAuthStore((state) => state.setAuthSession);
  const clearAuthSession = useAuthStore((state) => state.clearAuthSession);
    if(!accessToken){
       navigate("/login")
      return null;
     
    }
     useEffect(() => {
    setIsCollapsed(false);
  }, [location.pathname]);
     useEffect(() => {
      const getUserData = async () => {
    
    try {
      // 4. FETCH DATA: Inject currentToken directly into headers (do NOT use async local state)
      if (!accessToken){
        return;
      }
      const response = await api.get('/auth/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUserData(response.data.data)
       
    } catch (err) {
      console.error("Failed to fetch profile metadata:", err);
    }
  };

  getUserData();
}, [accessToken]);
//console.log(userData)
const initials = userData?.owner_name
  ? userData.owner_name
      .split(" ")
      .map(n => n[0])
      .join("")
  : "";
  const userName = userData?.owner_name
  const planName = userData?.subscriptions?.[0]?.plan?.plan_name || "No Active Plan";
  // 🗂️ STEP 1 LINKS ARRAYS: Operational item list targets under Management category
  const managementLinks = [
    { 
      label: "Overview Dashboard", 
      path: "/admin-dashboard", 
      exact: true,
      icon: (cls) => (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="3" y="3" width="7" height="9" rx="1" />
          <rect x="14" y="3" width="7" height="5" rx="1" />
          <rect x="14" y="12" width="7" height="9" rx="1" />
          <rect x="3" y="16" width="7" height="5" rx="1" />
        </svg>
      )
    },
    { 
      label: "Staff Management", 
      path: "/admin-dashboard/staff", 
      exact: false,
      icon: (cls) => (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
     { 
    // 📥 2. THE MUTATION TASK: Explicit action label for onboarding stock items
    label: "Add New Stock", 
    path: "/admin-dashboard/add-inventory", 
    exact: false,
    icon: (cls) => (
      // A unique 3D box cube with a supportive plus sign icon accent
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    )
  },
   { 
    label: "View Products Lists", 
    path: "/admin-dashboard/view-inventory", 
    exact: false,
    icon: (cls) => (
      // 📦 Tailored Product Cube: Distinct 3D stock box design
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        {/* Top Lid Face Geometry */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4" />
        {/* Front Left Wall Geometry */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10l8 4" />
        {/* Front Right Wall Internal Corner Axis Line */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 11v10" />
      </svg>
    )
  },
 
  ];

   const reportingLinks = [
    {
      label: "Download Reports",
      path: "/admin-dashboard/financials",
      exact: false,
      icon: (cls) => (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      label: "Billing & Subscription",
      path: "/admin-dashboard/billing",
      exact: false,
      icon: (cls) => (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    }
  ];
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
  return (
  <div className="w-full min-h-screen bg-surface-low flex overflow-hidden select-none font-sans">

    {/* Mobile Sidebar Overlay */}
    {sidebarOpen && (
      <div
        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />
    )}

    {/* Sidebar */}
    <aside
      className={`
        fixed left-0 top-0 z-50
        h-screen w-64
        bg-surface-lowest
        border-r border-slate-400
        flex flex-col
        transition-transform duration-300 ease-in-out

        ${sidebarOpen
          ? "translate-x-0"
          : "-translate-x-full lg:translate-x-0"
        }
      `}
    >

      {/* Logo */}
      <div className="w-full flex flex-col justify-center h-22 border-b border-slate-300 bg-surface-lowest shrink-0">
        <div className="px-6 flex flex-col items-start gap-1 w-full text-left">
          <div className="flex items-center justify-between w-full">
            <img
              src={logoImage2}
              alt="Baazio"
              className="h-12 w-auto max-w-[170px] object-contain block opacity-95 select-none"
            />

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              aria-label="Close sidebar"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <span className="text-label-md font-black uppercase tracking-wider text-slate-500 bg-blue-50/70 border border-blue-100/40 px-2 py-0.5 rounded-md font-mono select-none block w-max">
            Admin Terminal
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 flex flex-col gap-6 pt-5 pb-4 px-3 overflow-y-auto custom-scrollbar">

        {/* Management */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[12px] font-black uppercase tracking-widest text-slate-500 font-sans px-4 mb-2 block">
            Management
          </span>

          <div className="flex flex-col gap-1">
            {managementLinks.map((link, idx) => (
              <NavLink
                key={idx}
                to={link.path}
                end={link.exact}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 h-11 rounded-lg text-label-sm transition-all group ${
                    isActive
                      ? "bg-primary-fixed-dim/60 text-primary-container font-semibold shadow-md"
                      : "text-on-surface-variant hover:text-surface-lowest hover:bg-primary-fixed-dim"
                  }`
                }
              >
                {link.icon(
                  "w-[20px] h-[20px] group-hover:scale-110 transition-transform flex-shrink-0 text-inherit"
                )}
                <span className="truncate tracking-wide">
                  {link.label}
                </span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Reporting */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[12px] font-black uppercase tracking-widest text-slate-500 font-sans px-4 mb-2 block">
            Reporting
          </span>

          <div className="flex flex-col gap-1">
            {reportingLinks.map((link, idx) => (
              <NavLink
                key={idx}
                to={link.path}
                end={link.exact}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 h-11 rounded-lg text-label-sm transition-all group ${
                    isActive
                      ? "bg-primary-fixed-dim/60 text-primary-container font-semibold shadow-sm"
                      : "text-on-surface-variant hover:text-surface-lowest hover:bg-primary-fixed-dim"
                  }`
                }
              >
                {link.icon(
                  "w-[20px] h-[20px] group-hover:scale-110 transition-transform flex-shrink-0 text-inherit"
                )}

                <span className="truncate tracking-wide">
                  {link.label}
                </span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* System */}
        <div className="flex flex-col">
          <span className="text-[12px] font-black uppercase tracking-widest text-slate-500 font-sans px-4 mb-2 block">
            System
          </span>

          <button
            onClick={handleSignOut}
            type="button"
            className="w-full flex items-center gap-3 px-3 h-10 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg text-[13.5px] font-medium transition-colors focus:outline-none cursor-pointer group"
          >
            <svg
              className="w-5 h-5 group-hover:translate-x-0.5 transition-transform shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>

            <span className="tracking-wide text-on-surface-variant text-label-sm">
              Logout Terminal
            </span>
          </button>
        </div>
      </div>

      {/* Profile */}
      <div className="p-4 border-t border-slate-400 flex flex-col gap-3 min-h-25 justify-center shrink-0">
        <div className="w-full flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-secondary-fixed-dim text-secondary border border-secondary flex items-center justify-center font-bold font-sans text-[14px] uppercase shrink-0 select-none shadow-sm">
            {initials}
          </div>
          <div className="flex flex-col text-left min-w-0 flex-1">
            <p className="text-[15px] font-bold text-on-surface-variant truncate leading-tight mb-0.5">
              {userName}
            </p>
            <span className="text-[12px] font-black text-secondary tracking-wider uppercase font-mono leading-none mt-1 truncate">
              {planName}
            </span>
          </div>
        </div>
      </div>
    </aside>

    {/* Main Workspace */}
    <div className="w-full min-w-0 lg:ml-64 min-h-screen overflow-x-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-30 h-14 bg-surface-lowest border-b border-slate-100 px-4 flex items-center justify-between">
        <img
          src={logoImage2}
          alt="Baazio"
          className="h-auto w-auto max-w-[130px] object-contain"
        />
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Open navigation"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

      </div>
      {/* Page Content */}
      <main className="w-full min-w-0">
        <Outlet />
      </main>
    </div>
  </div>
);
}
