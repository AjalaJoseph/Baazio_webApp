import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAlertStore } from './store/alertStore';
import AlertModal from './components/alert';
export default function App() {
  const { modalConfig, closeGlobalAlert } = useAlertStore();
  return (
    <div className="relative min-h-screen bg-transparent">
       <Outlet/>

         {/* 🛡️ THE GLOBAL BACKDROP PROTECTION SCREEN CONTAINER OVERLAY */}
      {/* Captures all 503 errors and presents your warning text instantly!  */}
      {/* ========================================================================= */}
        <AlertModal 
        isOpen={modalConfig.isOpen}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        actionLabel={modalConfig.actionLabel}
        onAction={closeGlobalAlert} // 🎯 Collapses the alert screen layer cleanly when clicked [S4]
        onClose={closeGlobalAlert}  // 🎯 Handles background backdrop masking click vectors safely
      />
    </div>
  )
}
