import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosClient';

export default function ServerErrorPage() {
  const navigate = useNavigate();
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryFailed, setRetryFailed] = useState(false);

  // 🔄 CONNECTION RETRY ENVELOPE HANDSHAKE
  const handleRetryConnection = async () => {
    setIsRetrying(true);
    setRetryFailed(false);
    
    try {
      console.log("Pinging backend application terminal matrix to verify health...");
      // Hit a basic lightweight health check endpoint or your baseline profile route
      const response = await api.get('/auth/me'); 
      
      if (response.status === 200) {
        console.log("Database connectivity re-established! Redirecting to dashboard workspace...");
        navigate('/admin-dashboard'); // Bounce them right back into their workspace safely on recovery
      }
    } catch (err) {
      console.warn("Backend engine still unresponsive. Maintaining fallback fault viewport layout.");
      // Small simulated delay to give the user physical sensory feedback that a check actually happened
      await new Promise((resolve) => setTimeout(resolve, 800));
      setRetryFailed(true);
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 flex items-center justify-center p-6 select-none font-sans">
      
      {/* 🖥️ CONTAINERLESS TEXT FRAMEWORK LAYOUT */}
      <div className="w-full max-w-md flex flex-col items-center justify-center text-center animate-fadeIn">
        
        {/* Visual Anchor Icon Ring Asset (Warning Cloud Vector Indicator) */}
        <div className="w-16 h-16 bg-red-50 border-4 border-red-100 rounded-full flex items-center justify-center text-red-500 mb-6 shadow-xs animate-pulse">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        {/* Big Code Identity Heading */}
        <h1 className="text-slate-800 text-6xl md:text-7xl font-black tracking-tighter leading-none">
          500
        </h1>

        {/* Structural Context Subtitle */}
        <h2 className="font-sans text-headline-lg text-error  tracking-tight mt-3">
          Internal Server Error
        </h2>

        {/* High-Utility User Informational Summary Description */}
        <p className="text-slate-500 text-body-md leading-relaxed mt-2.5 max-w-sm font-medium">
            The analytics engine is currently experiencing an internal connection timeout. Our team has been notified, and operations should resume shortly.
         </p>

        {/* 🚨 DYNAMIC FLAGGING ERROR ALERT BOX */}
        {retryFailed && (
          <div className="w-full mt-5 p-3.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold rounded-xl flex items-center gap-2 text-left animate-scaleUp">
            <svg className="w-4 h-4 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>The server engine is still cycling offline. Please wait a moment and try again.</span>
          </div>
        )}

        {/* ACTION CONTROLS BUTTON COUPLING GRID LINKING */}
        <div className="w-full flex flex-col sm:flex-row items-center gap-2.5 mt-7">
          
          {/* Primary Action Path Toggle Button Trigger */}
          <button 
            onClick={handleRetryConnection}
            disabled={isRetrying}
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-100 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:text-slate-400"
          >
            {isRetrying ? (
              <>
                {/* Micro clean CSS circle loading spinner graphic indicator */}
                <div className="w-4 h-4 border-2 border-slate-400 border-t-blue-600 rounded-full animate-spin" />
                Pinging System...
              </>
            ) : (
              "Retry Connection"
            )}
          </button>

          {/* Secondary Flight Route Path Trigger to fall back to login screen */}
          <button 
            onClick={() => navigate('/login')}
            disabled={isRetrying}
            className="w-full h-11 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
          >
            Return to Login Area
          </button>
        </div>

      </div>
    </div>
  );
}
