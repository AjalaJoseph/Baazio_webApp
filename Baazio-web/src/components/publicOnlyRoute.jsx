import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function PublicOnlyRoute() {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isStoreHydrated = useAuthStore((state) => state.isStoreHydrated);
  const userRole = useAuthStore((state) => state.userRole);

  useEffect(() => {
    if (isStoreHydrated && accessToken && accessToken !== "null" && accessToken !== "") {
      console.log(`[Gate Keeper] Memory check verified active session. Role: [${userRole}]`);
      if (userRole === "OWNER") {
        navigate('/admin-dashboard', { replace: true });
      } else if (userRole === "STAFF") {
        navigate('/staff-dashboard', { replace: true });
      } else {
        // Fallback catch-guard if a token exists but the role variable is corrupt or missing
        console.warn("⚠️ Token found but Role footprint is absent. Evicting session parameters.");
        useAuthStore.getState().clearAuthSession();
      }
    }
  }, [accessToken, isStoreHydrated, userRole, navigate]);
  if (!isStoreHydrated) {
    return null;
  }
  // Render public login/register forms safely if no token is found in memory [S4]
  return (!accessToken || accessToken === "null" || accessToken === "") ? <Outlet /> : null;
}
