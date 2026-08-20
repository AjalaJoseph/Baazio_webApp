import React, {useState, useEffect, useRef} from 'react';
import api from '../api/axiosClient';
import { useReactToPrint } from 'react-to-print';
import { ThermalReceiptTemplate } from '../components/TherminalReciept';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import ProductDescriptionModal from '../components/ProductDescriptionModel';
import PasswordResetModal from '../components/updatePassword';
export default function StaffDashboardHome() {
    const accessToken = useAuthStore((state) => state.accessToken)
  const navigate = useNavigate();
  const [staffSummury, setStaffSummury] = useState({})
  const [salesHistory, setSalesHistory] = useState([])
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [userData, setUserData] = useState({})
  const componentToPrintRef = useRef(null);
  const [selectedTxForPrint, setSelectedTxForPrint] = useState(null);
  const [activePrintingId, setActivePrintingId] = useState(null);
   const [selectedSalesId, setSelectedSalesId] = useState(null);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [targetPaperWidth, setTargetPaperWidth] = useState("80mm");
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }));
  useEffect(() => {
    const clockTimer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }));
    }, 1000);
    return () => clearInterval(clockTimer);
  }, []);
const sales_id = "01c9eeef-7564-452d-babf-98fec04bf875"
  useEffect(() =>{
    const getStaffData = async () =>{
        try{
          const [userDateResponse,staffSalesSummaryResponse,getSalesHistoryResponse]= await Promise.all([
              api.get("/auth/me",{headers:{Authorization: `Bearer ${accessToken}`}}),
              api.get("/sales/my-summary", { headers: { Authorization: `Bearer ${accessToken}` } }),
              api.get("/sales/sales-history", { headers: { Authorization: `Bearer ${accessToken}` } }),
          ])

          const freshUserData = userDateResponse.data?.data;
                if(freshUserData.isPasswordChanged ===false){
                    setIsPasswordModalOpen(true)
                  }

           setUserData(freshUserData)
            setStaffSummury(staffSalesSummaryResponse.data.data)
            setSalesHistory(getSalesHistoryResponse.data.salesHistory)

        }catch(error){
            console.log(error.response?.data.message)
        }
    }
    getStaffData()
  }, [accessToken])
// console.log(userData)
// if(userData.isPasswordChanged ===true){
//   setIsPasswordModalOpen(true)
//  }
const initials = userData?.staff_name
  ? userData.staff_name
      .split(" ")
      .map(n => n[0])
      .join("")
  : "";
 
   const formatInvoiceTimestamp = (isoString) => {
        if (!isoString){
          return { dateWords: "N/A", timeString: "00:00" };
        } 
        const parsedDateInstance = new Date(isoString);
        const dateWords = parsedDateInstance.toLocaleDateString('en-US', {
          month: 'long',   
          day: 'numeric',  
          year: 'numeric'  
        });

        // 2. Compile hours and minutes into a standardized 12-hour AM/PM string marker [S4]
        const timeString = parsedDateInstance.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true     // Forces standard 12-hour AM/PM formatting clock parameters
        });

        return { dateWords, timeString };
};

  // Fallback structural mock states to handle rendering data maps cleanly
  const revenueToday = staffSummury?.daily?.revenue || 0;
  const revenueWeek = staffSummury?.weekly?.revenue || 0;
  const revenueMonth =  staffSummury?.monthly?.revenue || 0;
  
  const salesToday =  staffSummury?.daily?.transactions || 0;
  const salesWeek =  staffSummury?.weekly?.transactions || 0;
  const salesMonth =  staffSummury?.monthly?.transactions || 0;

  const executeTherminalHardwarePrint = useReactToPrint({
    contentRef:componentToPrintRef,
    documentTitle:`Receipt-${selectedTxForPrint?.invoiceHash || 'POS'}`,
    onAfterPrint: () =>console.log("🎉 Print pipeline handshake cleared successfully.")
  })

   const handleTriggerReceiptPrint = async (sales_id, total_amount,payment_method) => {
    setActivePrintingId(sales_id)
    try{
        const response = await api.get(`/sales/${sales_id}/sales-description`,{ headers: { Authorization: `Bearer ${accessToken}` } })
         const fetchedItemsArray = response.data?.data || [];
          if (!fetchedItemsArray || fetchedItemsArray.length === 0) {
          return;
        }
         const printerData = {
            invoiceHash: sales_id.substring(0, 8).toUpperCase(), 
            businessName: userData?.business?.business_name, // Pulled dynamically if available
            recordedBy: userData?.staff_name,
            channel: payment_method, 
            totalAmount: total_amount,
            items: fetchedItemsArray.map((item) => ({
              productId: item.id,
              productName: item.productName || "",
              quantity: Number(item.quantity) || 1, // Fallback safe integer guard
              unit_price: Number(item.unit_price) || 0,
              total_price: Number(item.total_price)
            }))
    };

      setSelectedTxForPrint(printerData);
        setTimeout(() => {
         executeTherminalHardwarePrint();
        }, 150);

      }catch (err) {
    console.error("❌ Print Dispatch Handshake Aborted:", err);
    setActivePrintingId(null)
    alert(err.response?.data?.message || "Hardware Connection Error: Failed to compile receipt lines data parameters.");
  }
  };
  
  const handleOpenDescriptionDrawer = (id) => {
    setSelectedSalesId(id);
    setIsDescriptionOpen(true);
  };
  return (
    <div className="w-full min-h-screen flex flex-col gap-2 text-left select-none  font-sans pb-12 bg-[#f8fafc] ">
        <div className="w-full bg-surface-lowest px-4 sm:px-6 pt-3 pb-3 border-b border-slate-400">
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <h1 className="text-headline-md text-on-surface font-sans">
          Staff Dashboard
        </h1>
        <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3">
          <div className=" bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl  shadow-3xs flex items-center gap-2 text-slate-600 text-xs font-bold font-mono whitespace-nowrap">
            <svg
              className="w-4 h-4 text-slate-400 stroke-2 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span> {currentTime} </span>
          </div>


          {/* User Profile */}
          <button
            type="button"
            onClick={()=>navigate("/staff-dashboard/profile")}
            className="
              inline-flex
              items-center
              justify-center
              p-0.5
              rounded-full
              hover:bg-slate-100
              dark:hover:bg-slate-800
              transition-colors
              duration-200
              outline-none
              focus-visible:ring-2
              focus-visible:ring-primary
              focus-visible:ring-offset-2
              cursor-pointer
              group
              shadow-xs
              select-none
              shrink-0
            "
            aria-label="Open user account profile settings menu"
            title='open profile'
          >

            <div className="
              w-9
              h-9
              rounded-full
              bg-primary
              text-white
              border
              border-blue-400/20
              flex
              items-center
              justify-center
              font-bold
              font-sans
              text-[13px]
              uppercase
              shrink-0
              shadow-md
              transition-transform
              duration-200
              group-hover:scale-95
            ">
              {initials}
            </div>

          </button>

        </div>

      </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: REVENUE VELOCITY TRACKING GRIDS */}
      {/* ========================================================================= */}
      <div className='w-full flex-1 bg-[#f8fafc] px-6 pt-5 flex flex-col gap-6'>
        <div className="space-y-2.5">
        <p className="text-label-lg font-sans uppercase tracking-wide mb-3 text-slate-500 flex items-center gap-1.5">
          My Revenue Generation
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Card: Revenue Today */}
          <div className="bg-surface-lowest border border-slate-300 rounded-md  px-5 pt-3 pb-5 shadow-md  flex flex-col justify-between min-h-35 lg:max-w-80">
            <div className="flex items-center justify-between w-full gap-2">
              <span className="text-label-lg font-sans text-slate-500">My Revenue (Today)</span>
              <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                <svg className="w-5 h-5 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2 10h20M7 15h.01M11 15h.01" />
                </svg>
              </div>
            </div>
            <p className="text-headline-md font-black text-slate-800 font-mono  tracking-tight ">₦{revenueToday.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</p>
            <p className="text-body-sm uppercase text-slate-500 border-t border-slate-200  tracking-widest mt-3 pt-4">Live Drawer Cache</p>
          </div>

          {/* Card: Revenue This Week */}
          <div className="bg-surface-lowest border border-slate-300 rounded-md  px-5 pt-3 pb-5 shadow-md  flex flex-col justify-between min-h-35 lg:max-w-80">
            <div className="flex items-center justify-between w-full gap-2">
              <span className="text-label-lg font-bold text-slate-500">My Revenue (This Week)</span>
              <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                <svg className="w-5 h-5 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <p className="text-headline-md font-black text-slate-800 font-mono  tracking-tight">₦{revenueWeek.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</p>
            <p className="text-body-sm uppercase text-slate-500 border-t border-slate-200  tracking-widest mt-3 pt-4">Calculated Shift Volume</p>
          </div>

          {/* Card: Revenue This Month */}
          <div className="bg-surface-lowest border border-slate-300 rounded-md  px-5 pt-3 pb-5 shadow-md  flex flex-col justify-between min-h-35 lg:max-w-80">
            <div className="flex items-center justify-between w-full gap-2">
              <span className="text-label-lg font-bold text-slate-500">My Revenue (This Month)</span>
              <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                <svg className="w-5 h-5 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <p className="text-headline-md font-black text-slate-800 font-mono tracking-tight">₦{revenueMonth.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</p>
            <p className="text-body-sm uppercase text-slate-500 border-t border-slate-200  tracking-widest mt-3 pt-4">Aggregate Records</p>
          </div>
        </div>
      </div>
         {/* ========================================================================= */}
      {/* SECTION 2: PRODUCT VELOCITY COUNTS */}
      {/* ========================================================================= */}
    <div className="space-y-2.5 pt-2">
        <p className="text-label-lg font-bold text-slate-500">
           My Product Velocity Counts
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Units Today */}
          <div className="bg-surface-lowest border border-slate-300 rounded-md px-5 pt-3 pb-5 shadow-md  flex flex-col justify-between min-h-35 lg:max-w-80">
            <div className="flex items-center justify-between w-full gap-2">
              <p className="text-label-lg font-sans text-slate-500">Transactions (Today)</p>
              <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                <svg className="w-7 h-7 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14v14m0-14L4 7m0 0v10l8 4" />
                </svg>
              </div>
            </div>
            <p className="text-headline-lg font-mono text-slate-800 tracking-tight  ">{salesToday.toLocaleString()}{" "} <span className="text-label-lg font-sans text-slate-500">Sales</span></p>
            <p className="text-body-sm uppercase text-slate-500 border-t border-slate-200  tracking-widest mt-3 pt-4">Total Checked Out Customers</p>
          </div>

          {/* Units Week */}
          <div className="bg-surface-lowest border border-slate-300 rounded-md p-5 shadow-md  flex flex-col justify-between min-h-35 lg:max-w-80">
            <div className="flex justify-between items-start">
              <span className="text-label-lg font-sans text-slate-500">Transactions (This Week)</span>
              <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                <svg className="w-6 h-6 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6m6 0h2m0 0v-4a2 2 0 012-2h2a2 2 0 012 2v4m-6 0h6m0 0v-10a2 2 0 012-2h2a2 2 0 012 2v10m-6 0h6" />
                </svg>
              </div>
            </div>
            <p className="text-headline-lg font-mono text-slate-800 tracking-tight ">{salesWeek.toLocaleString()}{" "} <span className="text-label-lg font-sans text-slate-500">Sales</span></p>
            <p className="text-body-sm uppercase text-slate-500 border-t border-slate-200  tracking-widest mt-3 pt-4">Total Checked Out Customers</p>
          </div>

          {/* Units Month */}
          <div className="bg-surface-lowest border border-slate-300 rounded-md p-5 shadow-md  flex flex-col justify-between min-h-35 lg:max-w-80">
            <div className="flex justify-between items-start">
              <span className="text-label-lg font-sans text-slate-500">Transactions (This Month)</span>
              <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                <svg className="w-5 h-5 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v18M15 3v18M3 9h18M3 15h18" />
                </svg>
              </div>
            </div>
            <p className="text-headline-lg font-mono text-slate-800 tracking-tight ">{salesMonth.toLocaleString()}{" "} <span className="text-label-lg font-sans text-slate-500">Sales</span></p>
            <p className="text-body-sm uppercase text-slate-500 border-t border-slate-200  tracking-widest mt-3 pt-4">Total Checked Out Customers</p>
          </div>
        </div>
      </div>
        {/* ========================================================================= */}
      {/* SECTION 3: AUDIT LOG TRANSACTION FEED HEADER CONTAINER */}
      {/* ========================================================================= */}
      <div className="w-full bg-surface-lowest border border-slate-400 rounded-md shadow-sm text-left font-sans select-none overflow-hidden animate-scaleUp">

  {/* =========================================================
      HEADER
  ========================================================== */}
  <div className="p-4 border-b border-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
    <h3 className="text-headline-md sm:text-headline-md text-on-surface-variant font-sans tracking-tight">
      Staff Console Audit Log Feed
    </h3>
    <button
      type="button"
      onClick={() => navigate("/staff-dashboard/record-sales")}
      className="
        w-full
        sm:w-auto
        h-9
        px-4
        bg-secondary
        hover:bg-primary
        text-label-md
        text-white
        rounded-md
        transition-all
        shadow-md
        shadow-blue-100
        flex
        items-center
        justify-center
        gap-2
        cursor-pointer
        border-none
        shrink-0
      "
    >
      <svg
        className="w-3.5 h-3.5 stroke-[2.5]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 12h14M5 16h14M5 20h14"
        />
        <rect
          x="3"
          y="8"
          width="18"
          height="13"
          rx="2"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 8V4a1 1 0 00-1-1H9a1 1 0 00-1 1v4"
        />
      </svg>

      <span>Record Sales</span>
    </button>

  </div>


  {/* =========================================================
      TABLE
  ========================================================== */}
  <div className="w-full overflow-x-auto">
    <table className="w-full min-w-180 text-xs border-collapse">
      <thead>
        <tr className="bg-surface-low border-b border-slate-400 text-label-md uppercase font-mono text-slate-600 select-none">
          <th className="p-3 sm:p-4 text-left min-w-40">Payment Method</th>
          <th className="p-3 sm:p-4 text-left min-w-40">Total Amount</th>
          <th className="p-3 sm:p-4 text-left min-w-37.5">Timestamp</th>
          <th className="p-3 sm:p-4 text-center pr-4 sm:pr-6 min-w-65">Actions</th>
        </tr>
      </thead>


      {/* ================= BODY ================= */}
      <tbody className="divide-y divide-slate-300 bg-white">
        {salesHistory.map((tx) => {
          const { dateWords, timeString } =
            formatInvoiceTimestamp(tx.createdAt);
          return (
            <tr
              key={tx.id}
              className="hover:bg-slate-50/30 transition-colors"
            >

              {/* PAYMENT METHOD */}
              <td className="p-3 sm:p-4 text-slate-500 text-body-lg font-sans whitespace-nowrap">{tx.payment_method} </td>
              {/* TOTAL AMOUNT */}
              <td className="p-3 sm:p-4 font-bold text-slate-800 text-body-lg font-mono whitespace-nowrap">
                ₦
                {Number(tx.total_amount).toLocaleString("en-NG", {
                  minimumFractionDigits: 2,
                })}
              </td>
              {/* TIMESTAMP */}
              <td className="p-3 sm:p-4 text-slate-400 font-medium">
                <div className="flex  min-w-0">
                  <p className="text-body-lg text-slate-700 whitespace-nowrap">
                    {dateWords}
                  </p>

                  {/*
                  <p className="text-body-md text-slate-500">
                    {timeString}
                  </p>
                  */}

                </div>

              </td>


              {/* ACTIONS */}
              <td className="p-3 sm:p-4 text-right pr-4 sm:pr-6">
                <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                  {/* VIEW */}
                  <button
                    type="button"
                    onClick={() =>
                      handleOpenDescriptionDrawer(tx.id)
                    }
                    className="
                      h-8
                      px-3
                      border
                      border-primary-container
                      hover:border-primary
                      bg-primary-container
                      text-surface-lowest
                      hover:bg-primary
                      rounded-md
                      font-bold
                      text-[11px]
                      transition-all
                      cursor-pointer
                      shadow-sm
                      inline-flex
                      items-center
                      justify-center
                      gap-1.5
                      focus:outline-none
                      disabled:opacity-50
                      disabled:cursor-not-allowed
                      shrink-0
                    "
                  >

                    <svg
                      className="w-3.5 h-3.5 stroke-2 text-surface-lowest"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>

                    <span>View</span>

                  </button>
                  
                  {/* PRINT */}
                  <button
                    type="button"
                    disabled={activePrintingId !== null}
                    onClick={() =>
                      handleTriggerReceiptPrint(
                        tx.id,
                        tx.total_amount,
                        tx.payment_method
                      )
                    }
                    className={`
                      h-9
                      px-3
                      border
                      border-secondary
                      hover:border-slate-400
                      bg-surface-lowest
                      rounded-md
                      font-bold
                      text-label-md
                      transition-colors
                      inline-flex
                      items-center
                      justify-center
                      gap-1.5
                      shadow-sm
                      shrink-0
                      ${
                        activePrintingId === tx.id
                          ? "cursor-not-allowed border-slate-300 hover:text-slate-400 text-slate-500"
                          : "cursor-pointer text-primary hover:text-secondary"
                      }
                    `}
                  >

                    <svg
                      className="w-4 h-4 stroke-2 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 9V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 13h10v6a1 1 0 01-1 1H8a1 1 0 01-1-1v-6z"
                      />
                    </svg>

                    <span>
                      {activePrintingId === tx.id
                        ? "Processing..."
                        : "Print Receipt"}
                    </span>

                  </button>

                </div>

              </td>

            </tr>
          );
        })}

      </tbody>

    </table>

  </div>


  {/* =========================================================
      FOOTER
  ========================================================== */}
  <div className="p-4 bg-slate-200 border-t border-slate-300 flex justify-center w-full">

    <button
      type="button"
      onClick={() => navigate("/staff-dashboard/sales")}
      className="
        text-label-md
        text-primary-container
        hover:text-secondary
        hover:underline
        flex
        items-center
        gap-1.5
        cursor-pointer
        bg-transparent
        border-none
        p-0
        transition-colors
        focus:outline-none
      "
    >

      <span>View Full History</span>

      <svg
        className="w-4 h-4 stroke-[2.2]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>

    </button>

  </div>

</div>
     <ProductDescriptionModal 
        isOpen={isDescriptionOpen}
        salesId={selectedSalesId}
        accessToken={accessToken}
        onClose={() => {
          setIsDescriptionOpen(false);
          setSelectedSalesId(null); 
        }}
      />
            <div>
              <ThermalReceiptTemplate 
                ref={componentToPrintRef} 
                transactionData={selectedTxForPrint} 
                paperSize={targetPaperWidth} 
              />
           </div>

            <PasswordResetModal 
              isOpen={isPasswordModalOpen} 
              onClose={() => setIsPasswordModalOpen(false)} 
            />
      </div>
</div>
  )
}
