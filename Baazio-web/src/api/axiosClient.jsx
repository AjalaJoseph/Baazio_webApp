import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { useAlertStore } from '../store/alertStore'; // 🎯 Injects your fresh store utility [S4]

const api = axios.create({
  baseURL: 'https://baazio-api.onrender.com/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const statusCode = error.response?.status;
    const serverPayload = error.response?.data;

    // =========================================================================
    // 🛡️ SECURITY SHIELD 1: INTERCEPT 503 INFRASTRUCTURE DROPS (THE EXACT FIX)
    // =========================================================================
    // Catches network drops or tripped Opossum breakers instantly [S4]
    if (statusCode === 503) {
      console.warn("🛡️ [Axios Interceptor] Intercepted 503 gateway drop. Mounting AlertModal overlay.");
      
      const alertTitle = serverPayload?.code === "SYSTEM_BUSY" ? "Gateway Protected" : "Connection Timeout";
      const alertMessage = serverPayload?.message || "The external payment connection is temporarily busy. Please wait a moment.";

      // 🚀 Open the modal globally by updating your Zustand state pool! [S4]
      useAlertStore.getState().triggerGlobalAlert(alertTitle, alertMessage, "danger");

      // Cancel the promise loop cleanly so it never triggers an unhandled 500 boot-out page [S4]
      return new Promise(() => {}); 
    }

    // =========================================================================
    // 💥 SECURITY SHIELD 2: CATCH CRITICAL 500 APPLICATION SERVER FAULTS
    // =========================================================================
    if (statusCode === 500) {
      console.error("Critical 500 server fault intercepted.");
      window.location.href = '/server-error';
      return Promise.reject(error);
    }

    // =========================================================================
    // 🔄 SECURITY SHIELD 3: AUTOMATED JWT SILENT TOKEN ROTATION
    // =========================================================================
    if (statusCode === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        if (!refreshPromise) {
          console.log("🔄 Starting token refresh...");
          refreshPromise = axios.post("https://baazio-api.onrender.com/api/auth/refresh-token", {}, {
            withCredentials: true,
          })
          .then((response) => {
            console.log("✅ Token refresh successful");
            const newAccessToken = response.data?.accessToken;
            if (!newAccessToken) {
              throw new Error("Refresh endpoint did not return an access token.");
            }
            useAuthStore.getState().setAuthSession(newAccessToken);
            return newAccessToken;
          })
          .finally(() => {
            refreshPromise = null;
          });
        } else {
          console.log("⏳ Token refresh already running. Waiting...");
        }

        // Wait for the running token refresh transaction promise loop to complete safely
        const newAccessToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest); // Retry the original network operation seamlessly!
        
      } catch (refreshError) {
        console.error("❌ Refresh token rejected or expired.", refreshError);
        useAuthStore.getState().clearAuthSession();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Pass standard client validations (like 400 Bad Request or 403 Locked Plan messages) straight through
    return Promise.reject(error);
  }
);

export default api;
