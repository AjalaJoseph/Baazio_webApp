import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

// 🎯 THE UPGRADE: Pass an explicit array of allowed roles to the guard!
export default function ProtectedRoute({ allowedRoles }) {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isStoreHydrated = useAuthStore((state) => state.isStoreHydrated);
  const userRole = useAuthStore((state) => state.userRole); // Grab role from memory

  useEffect(() => {
    // 🛡️ SECURITY CHECK 1: If hydration is done and token is missing, kick to login
    if (isStoreHydrated && !accessToken) {
      console.warn("🔒 Security Guard: Access Token absent. Ejecting to login terminal...");
      navigate('/login', { replace: true });
      return;
    }

    // 🛡️ SECURITY CHECK 2: Role Authorization Gate
    // If they have a token but their role is NOT included in the allowed list, block them!
    if (isStoreHydrated && accessToken && allowedRoles && !allowedRoles.includes(userRole)) {
      console.error(`❌ [Authorization Breach Blocked]: Role [${userRole}] tried to access a path restricted to [${allowedRoles}].`);
      
      // Smart redirect: send them instantly back to their own authorized terminal!
      if (userRole === "STAFF") {
        navigate('/staff-dashboard', { replace: true });
      } else if (userRole === "OWNER") {
        navigate('/admin-dashboard', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    }
  }, [accessToken, isStoreHydrated, userRole, allowedRoles, navigate]);

  if (!isStoreHydrated) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-6 h-6 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  // Double-check alignment: only render the layout if token exists AND role passes verification
  const isAuthorized = accessToken && (!allowedRoles || allowedRoles.includes(userRole));
  return isAuthorized ? <Outlet /> : null;
}
