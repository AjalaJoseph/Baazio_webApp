import React, {useState, useEffect} from "react";
import AddStaffModal from "../components/registerStaff";
import { useAuthStore } from '../store/authStore';
import api from "../api/axiosClient";
import AlertModal from "../components/alert";
export default function StaffManagement() {
     const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  //    const [mockMetrics, setMockMetrics] = useState({
  //   totalStaffProfiles: 12,
  //   activeStaffProfiles: 10,
  //   topOperatorName: "Cashier Joseph Ajala",
  //   topOperatorSales: 145200.00
  // });
    const accessToken = useAuthStore((state) => state.accessToken);
    const setAuthSession = useAuthStore((state) => state.setAuthSession);
    const [staffCount, setStaffCount] = useState(0)
    const [activeTerminal, setActiveTerminal] = useState(0)
    const [leaderboard, setLeaderboard] = useState([])
    const [alertConfig, setAlertConfig] = useState({ isOpen: false, type: "success", title: "", message: "", actionLabel: "", onAction: () => {} });
  const triggerAlert = (config) => setAlertConfig({ ...config, isOpen: true });
  const closeAlert = () => setAlertConfig((prev) => ({ ...prev, isOpen: false }));
   const [staffData, setStaffData] = useState([]);

  // Handler functions for action settings buttons
  
  useEffect(() =>{
    const fetchStaffData = async () =>{
         

           try{
                 const [allStaffResponse,activeTerminalResponse, leaderBoardResponse] = await Promise.all([
                api.get("/auth/all-staff",{ headers: { Authorization: `Bearer ${accessToken}` } }),
                api.get("/sales/active-terminal", { headers: { Authorization: `Bearer ${accessToken}` } }),
                api.get("/sales/staff-leaderboard", { headers: { Authorization: `Bearer ${accessToken}` } })
            ])
            setStaffCount(allStaffResponse.data.data.length)
            setStaffData(allStaffResponse.data.data)
            setActiveTerminal(activeTerminalResponse.data.data.activeTerminalStaffCount)
            setLeaderboard(leaderBoardResponse.data.data)
           }catch(error){
            console.error('Failed to fetch staff metadata', error)
           }
    }
    fetchStaffData()
  }, [accessToken])
  const handleDeleteClick = (staffId,staffName) => {
    // 1. Launch a danger modal to ask for deletion permission before wiping data lines
     triggerAlert({
      type: "danger",
      title: "Revoke Account Privileges?",
      // 🎯 THE FIX: Pass JSX directly so React parses your <strong> tag beautifully!
      message: (
        <span>
          This will permanently delete profile parameters for{" "}
          <strong className="text-slate-900 font-bold font-sans">
            {staffName}
          </strong>
          . They will instantly lose access to their terminal register window keys.
        </span>
      ),
      actionLabel: "Permanently Delete",
      onClose: closeAlert,
      onAction: () => executeDeleteRequest(staffId) // Forwards call to the actual execution pipeline
    });
  };
  const executeDeleteRequest = async (staffId) => {
    closeAlert(); // Hide confirmation layer
    try {
      // 2. Transmit request via clean axios interceptor instance
      const response = await api.delete(`/auth/${staffId}/remove-staff`, { headers: { Authorization: `Bearer ${accessToken}` } });

      if (response.data.status === "success" || response.status === 200) {
        // 3. Wipes row item out of client table grid list instantly
        setStaffData((prevList) => prevList.filter((staff) => staff.id !== staffId));

        // 4. Launch success completion modal overview!
        setTimeout(() => {
          triggerAlert({
            type: "success",
            title: "Staff Deleted Successfully",
            message: `Account configurations and session tracking states linked to ${staffId} have been cleanly dropped from the business master roster file.`,
            actionLabel: "Return to Roster",
            onAction: closeAlert,
            onClose: closeAlert
          });
        }, 150);
      }
    } catch (err) {
      console.error(err);
      triggerAlert({
        type: "danger",
        title: "Deletion Failure",
        message: err.response?.data?.message || "Internal network check dropped the deletion workflow parameters.",
        actionLabel: "Dismiss Alert",
        onAction: closeAlert,
        onClose: closeAlert
      });
    }
  };

  const handleStatusChange = async (staffId) => {
  try {
    const response = await api.patch(`/auth/${staffId}/toggle-status`, { headers: { Authorization: `Bearer ${accessToken}` } });
    if (response.data.status === "success" || response.status === 200) {
      setStaffData((prevList) =>
        prevList.map((item) =>
          item.id === staffId 
            ? { ...item, status: item.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" } 
            : item
        )
      );

      console.log(`Staff roster synchronized successfully on client viewport.`);
    }
  } catch (err) {
    console.error("Platform boundary error during status modification request line:", err);
    const backendMessage = err.response?.data?.message || "Internal network check dropped the authorization toggle.";
    alert(backendMessage);
  }
};

    return(
         <div className="w-full min-h-screen flex flex-col gap-2 text-left select-none  font-sans pb-12 bg-[#f8fafc] ">
           <div className="w-full bg-surface-lowest flex items-center justify-between gap-3 px-4 sm:px-6 pt-3 pb-2 border-b border-slate-400">
  <h1 className="text-label-lg text-on-surface font-sans whitespace-nowrap">
    Staff Management
  </h1>

  <button
    onClick={() => setIsDrawerOpen(true)}
    type="button"
    className="inline-flex items-center justify-center shrink-0 h-10 px-3 bg-primary-container hover:bg-on-primary-fixed-variant text-surface-bright rounded-md text-label-md shadow-md transition-colors gap-2 cursor-pointer font-sans"
    aria-label="Add new staff"
  >
    <svg
      className="w-4 h-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
      />
    </svg>

    <span className="whitespace-nowrap">
      Add New Staff
    </span>
  </button>
</div>
      
      <div className='w-full flex-1 bg-[#f8fafc] px-6 py-6 flex flex-col gap-6'>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-6">
      
      {/* 🟦 CARD 1: TOTAL REGISTERED STAFF HEADCOUNT */}
      <div className="bg-surface-lowest h-24 border border-slate-300 rounded-md p-4 flex items-center justify-between shadow-xs hover:border-blue-300 transition-all duration-200">
        <div className="flex flex-col gap-1 text-left">
          <p className="text-label-md  uppercase  text-primary-container font-sans">
            Total Staff Registered
          </p>
          <p className="text-2xl font-black text-slate-800 tracking-tight leading-none mt-1">
            {staffCount} <span className="text-label-md  text-slate-500 font-sans">Profiles</span>
          </p>
          <p className="text-body-md text-slate-500  leading-none mt-1">
            Master roster capacity
          </p>
        </div>
        {/* Blue Contact Profiles Multi-User Group Visual Anchor Icon */}
        <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center text-primary shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
      </div>

      {/* 🟩 CARD 2: ACTIVE STAFF SECURITY CHECK */}
      <div className="bg-surface-lowest h-24 border border-slate-300 rounded-md p-4 flex items-center justify-between shadow-md hover:border-emerald-300 transition-all duration-200 ">
        <div className="flex flex-col gap-1 text-left">
          <p className="text-[11px] font-bold uppercase tracking-wider  text-primary-container font-sans">
            Active Staff
          </p>
          <p className="text-2xl font-black text-slate-800 tracking-tight leading-none mt-1">
            {activeTerminal} <span className="text-label-md font-semibold px-2 py-0.5 bg-emerald-50  text-emerald-700  rounded-lg ml-1 font-sans">Live</span>
          </p>
          <p className="text-body-md text-slate-500  leading-none mt-1">
            {staffCount - activeTerminal} accounts restricted/offline
          </p>
        </div>
        {/* Emerald Verified Shield Access Security Key Visual Anchor Icon */}
        <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
      </div>

      {/* 🟨 CARD 3: TOP OPERATIONAL PERFORMANCE LEADER */}
      <div className="bg-white h-24 border border-slate-200 rounded-md p-4 flex items-center justify-between shadow-md hover:border-amber-300 transition-all duration-200">
        <div className="flex flex-col gap-1 text-left w-full max-w-42.5 lg:max-w-50">
          <p className="text-label-md font-bold uppercase tracking-wider text-slate-400 font-sans">
            Top Operational Staff
          </p>
          <p className="text-label-lg text-on-surface-variant tracking-tight mt-1">
            {leaderboard.topOperatorName
              ? leaderboard.topOperatorName
                  .toLowerCase()
                  .split(' ')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')
              : "No Sales Operator"}
            </p>

          <p className="text-label-sm text-slate-500 font-medium leading-none mt-1.5 block">
            Revenue Generated <strong className="text-body-md text-on-surface-variant">₦{leaderboard.revenueGenerated?.toLocaleString('en-NG')}</strong>
          </p>
        </div>
        {/* Amber Performance Lightning Acceleration Growth Visual Anchor Icon */}
        <div className="w-12 h-12 bg-amber-50 border border-amber-100 rounded-full flex items-center justify-center text-amber-500 shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
      </div>

    </div>
          <div className="w-full bg-surface-lowest border border-slate-400 rounded-md p-5 shadow-xs flex flex-col gap-4">
      
      {/* 📋 TABLE HEADER CONTROLS BAR */}
      <div className="w-full flex flex-col  items-center justify-center gap-3 border-b border-slate-300 pb-3">
        <div className="flex flex-col gap-1 items-center pt-2">
            <h3 className="text-headline-md  text-on-surface tracking-tight">
                Active Employee Registrations & Terminal Operators
            </h3>
            <p className="text-body-sm md:text-body-md text-slate-400 font-sans">
                Manage and audit centralized terminal staff credentials.
            </p>
        </div>
      </div>

      {/* 📱 HORIZONTAL OVERFLOW RESPONSIVE WRAPPER WINDOW */}
      <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
        <table className="w-full min-w-200 text-left border-collapse">
          
          {/* COLUMNS SCHEMATIC SCHEMA MAPPING */}
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 text-secondary-container text-label-lg   tracking-widest">
              <th className="p-4">Staff Name</th>
              <th className="pl-7">Staff Email</th>
              <th className="p-4">Current Status</th>
              <th className="p-4 pr-6 text-right">Action Settings</th>
            </tr>
          </thead>
          
          {/* DATA RECORDS HEADCOUNT STREAM */}
          <tbody className="divide-y divide-slate-100">
             {staffData && staffData.length > 0 ? (
            staffData.map((staff) => (
              <tr key={staff.id} className="hover:bg-slate-50/30 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-label-lg  text-on-surface-variant tracking-tighter">
                      {String(staff.staff_name).toUpperCase()}
                    </span>
                  </div>
                </td>

                {/* 3. Operational Mail Node */}
                <td className="p-4 text-sm font-medium text-slate-500 select-text">
                  {staff.staff_email}
                </td>

                {/* 4. Status Pill Layer Flag */}
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold font-sans tracking-wide ${
                    staff.isActive ===true 
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/50' 
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {/* Tiny green/gray dot indicator asset */}
                    <span className={`w-1.5 h-1.5 rounded-full block ${staff.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                    {staff.isActive===true? "ACTIVE": "INACTIVE"}
                  </span>
                </td>

                {/* 5. Action Settings Operations Buttons Triggers Grid */}
                <td className="p-4 pr-6 text-right">
                  <div className="flex items-center justify-end gap-3.5">
  
  {/* 🔵 Pencil Edit Button - High Visibility Blue */}
            <button 
                onClick={() => handleEdit(staff.id)} 
                className="text-secondary transition-colors p-1 hover:bg-slate-100 rounded-md cursor-pointer" 
                title="Edit Profile"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
            </button>
     <button onClick={() => handleStatusChange(staff.id)} 
    className={`transition-colors p-1 hover:bg-slate-100 rounded-md cursor-pointer ${
      staff.isActive === true ? 'text-tertiary-container' : 'text-emerald-500'
    }`} 
    title={staff.isActive === true ? "Suspend Operator" : "Activate Operator"}
  >
    {staff.isActive === true ? (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    ) : (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )}
  </button>

  <button 
    onClick={() => handleDeleteClick(staff.id, staff.staff_name)} 
    className="text-error transition-colors p-1 hover:bg-slate-100 rounded-md cursor-pointer" 
    title="Delete Account"
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  </button>

</div>
                </td>

              </tr>
            ))):(
              <tr>
      <td colSpan={5} className="p-12 text-center select-none font-sans bg-surface-lowest">
        <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-4 animate-scaleUp">
          
          {/* Subtle Graphic Warning Vector Capsule Indicator */}
          <div className="w-12 h-12 bg-slate-50 border border-slate-200/60 text-slate-400 rounded-xl flex items-center justify-center shadow-3xs">
            <svg className="w-6 h-6 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-3.394M18.354 5.646a9.092 9.094 0 00-3.741-3.394M21 12a9 9 0 11-18 0 9 9 0 0118 0zM12 9v2m0 4h.01" />
            </svg>
          </div>

          {/* Typography Context labels blocks */}
          <div className="space-y-1">
            <h4 className="text-slate-700 tex-xl font-semibold uppercase tracking-tight">
              No Staff Registered Yet
            </h4>
            <p className="text-sm text-slate-500 font-medium ">
              Your terminal operator registry index is empty. Deploy your initial cashier or shift manager credentials to authorize lane checkouts.
            </p>
          </div>

        </div>
      </td>
    </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
            <AddStaffModal isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} 
        // onSaveSuccess={(newStaff) => console.log("Refresh list with incoming row:", newStaff)}
      />
       <AlertModal 
        isOpen={alertConfig.isOpen}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        actionLabel={alertConfig.actionLabel}
        onAction={alertConfig.onAction}
        onClose={closeAlert}
      />
     </div>
    
    </div>
    );
}
