import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axiosClient';
import axios from 'axios';
import logoImage2 from "../assets/images/new baazio logo (2).png";
import { useAuthStore } from '../store/authStore';
export default function StaffLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [userData, setUserData] = useState([])
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAuthSession = useAuthStore((state) => state.setAuthSession);
  const clearAuthSession = useAuthStore((state) => state.clearAuthSession);
    
     useEffect(() => {
      const getUserData = async () => {
            try {
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

const initials = userData?.staff_name
  ? userData.staff_name
      .split(" ")
      .map(n => n[0])
      .join("")
  : "";
  const userName = userData?.staff_name
  
  const managementLinks = [
    { 
      label: "Overview Dashboard", 
      path: "/Staff-dashboard", 
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
      label: "Record Sales", 
      path: "/Staff-dashboard/record-sales", 
      exact: false,
      icon: (cls) => (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 16h14M5 20h14" />
        <rect x="3" y="8" width="18" height="13" rx="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* The Rolling Transactions Paper Receipt Output */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 8V4a1 1 0 00-1-1H9a1 1 0 00-1 1v4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6h6" />
      </svg>
      )
    },
     { 
    label: "My Sales", 
    path: "/Staff-dashboard/sales", 
    exact: false,
    icon: (cls) => (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
    )
  },
   
 
  ];

  
     const handleSignOut = async () => {
      clearAuthSession(); 
      navigate('/login');
        try {
          console.log("Terminating active user workspace session channels...");
            await axios.post(
            "https://baazio-api.onrender.com/api/auth/logout", 
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
  <div className="w-full min-h-screen bg-surface-low flex items-stretch overflow-hidden select-none font-sans">

    {/* ================= MOBILE OVERLAY ================= */}
    {sidebarOpen && (
      <div
        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />
    )}

    {/* ================= SIDEBAR ================= */}
    <aside
      className={`
        fixed lg:static
        top-0 left-0
        z-50
        h-screen
        w-72
        shrink-0
        flex flex-col justify-between
        bg-surface-lowest
        border-r border-slate-300

        transform transition-transform duration-300 ease-in-out

        ${sidebarOpen
          ? "translate-x-0"
          : "-translate-x-full lg:translate-x-0"
        }
      `}
    >

      {/* ================= LOGO ================= */}
      <div className="w-full flex flex-col justify-center h-22 border-b border-slate-300 bg-surface-lowest">
        <div className="px-6 flex flex-col items-start gap-1 w-full text-left">
          <div className="flex items-center justify-between w-full">
            <img
              src={logoImage2}
              alt="Baazio"
              className="h-12 w-auto object-contain block opacity-95 select-none"
            />

            {/* MOBILE CLOSE BUTTON */}
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
            Staff Console
          </span>

        </div>
      </div>


      {/* ================= NAVIGATION ================= */}
      <div className="flex-1 flex flex-col gap-6 pt-5 pb-4 px-4 overflow-y-auto">
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-col gap-1">
            {managementLinks.map((link, idx) => (
              <NavLink
                key={idx}
                to={link.path}
                end={link.exact}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 h-11 rounded-lg text-label-md transition-all group ${
                    isActive
                      ? "bg-primary-fixed-dim/50 text-secondary font-semibold shadow-md"
                      : "text-on-surface-variant hover:text-surface-lowest hover:bg-primary-fixed-dim"
                  }`
                }
              >
                {link.icon(
                  "w-[20px] h-[20px] group-hover:scale-110 transition-transform flex-shrink-0 text-inherit"
                )}

                <span className="tracking-wide animate-fadeIn">
                  {link.label}
                </span>
              </NavLink>
            ))}

          </div>
        </div>

        {/* ================= BOTTOM SECTION ================= */}
        <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-slate-400 w-full">

          {/* LOGOUT */}
          <button
            onClick={handleSignOut}
            type="button"
            className="w-full flex items-center gap-3 px-3 h-10 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-md text-label-md transition-colors focus:outline-none cursor-pointer group"
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

            <span className="tracking-wide text-on-surface-variant text-label-md">
              Logout Terminal
            </span>
          </button>


          {/* USER CARD */}
         <button onClick={()=>navigate("/staff-dashboard/profile")}>
           <div className="p-2.5 mt-2 bg-surface-low border border-slate-300 rounded-lg flex items-center gap-3 min-h-[64px] justify-start w-full">
            <div className="w-10 h-10 rounded-xl bg-secondary-container text-primary border border-secondary flex items-center justify-center font-bold font-sans text-[14px] uppercase shrink-0 select-none shadow-md shadow-secondary">
              {initials}
            </div>
            <div className="flex flex-col text-left overflow-hidden mt-2">
              <p className="text-[14px] font-bold text-slate-800 capitalize tracking-tight leading-tight mb-0.5 truncate">
                {userName}
              </p>
              <p className="text-body-sm text-slate-500 tracking-tighter uppercase font-mono leading-none inline-block w-max">
                CASHIER NODE
              </p>
            </div>
          </div>
         </button>
        </div>
      </div>
    </aside>


    {/* ================= MAIN WORKSPACE ================= */}
    <div className="flex-1 h-screen overflow-y-auto min-w-0">

      {/* MOBILE HEADER */}
      <header className="lg:hidden sticky top-0 z-30 h-16 bg-surface-lowest border-b border-slate-100 flex items-center justify-between px-4">
        <div className="ml-3 flex items-center">
          <img
            src={logoImage2}
            alt="Baazio"
            className="h-8 w-auto object-contain"
          />
        </div>

             <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Open sidebar"
          aria-expanded={sidebarOpen}
        >
          <svg
            className="w-6 h-6"
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
      </header>


      {/* ROUTER CONTENT */}
      <main className="min-h-full">
        <Outlet />
      </main>
    </div>
  </div>
);
}
