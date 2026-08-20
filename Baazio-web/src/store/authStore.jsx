import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      accessToken: null,
      isStoreHydrated: false, // 🎯 THE FIX: A real state tracker inside your store
       userRole: "",
      setAuthSession: (token) => set({ accessToken: token }),
      clearAuthSession: () => set({ accessToken: null, resetEmail: "" }),
       setUserRole: (role) => set({ userRole: role || "" }),
      setHydrated: (status) => set({ isStoreHydrated: status }),
    }),
    {
      
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);
        }
      },
    }
  )
);
