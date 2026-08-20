import React, { useState, useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import api from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ThermalReceiptTemplate } from '../components/TherminalReciept';
import ProductDescriptionModal from '../components/ProductDescriptionModel';

export default function SalesHistoryPage() {
    const navigate = useNavigate()
  const accessToken = useAuthStore((state) => state.accessToken);
  const [salesRecords, setSalesRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activePrintingId, setActivePrintingId] = useState(null);
  const [userData, setUserData] = useState({})
  const [activeDropdownRowId, setActiveDropdownRowId] = useState(null);
    const [selectedSalesId, setSelectedSalesId] = useState(null);
    const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  // 📋 PAGINATION TRACKING PARAMETERS
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});

  // 🖨️ PHYSICAL PRINT COMPILER CACHE STATES
  const componentToPrintRef = useRef(null);
  const [selectedTxForPrint, setSelectedTxForPrint] = useState(null);
  const searchTimeoutRef = useRef(null);

    useEffect(()=>{
        const getAccountData = async()=>{
           const response = await api.get("/auth/me",{headers:{Authorization: `Bearer ${accessToken}`}})
           setUserData(response.data.data)
        }
        getAccountData()
    }, [accessToken])

  // 📡 CORE NETWORKING ENGINE: Hits your target /sales/my-sales API endpoint 
  const fetchSalesDataFromServer = async (pageNumber, currentSearch) => {
    try {
      setIsLoading(true);
      const response = await api.get(`/sales/my-sales?page=${pageNumber}&limit=5&search=${currentSearch}`, { headers: { Authorization: `Bearer ${accessToken}` }
      });

      const payload = response.data || {};
      setSalesRecords(payload.data || []);
      setPagination(payload.pagination)

    } catch (err) {
      console.error("❌ Failed to compile sales history grids:", err);
      setSalesRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 📐 INITIAL RENDER SEED TRIGGER
  useEffect(() => {
    fetchSalesDataFromServer(currentPage, "");
  }, [currentPage, accessToken]);

  // 📝 DEBOUNCED SEARCH EVENT HANDLER: Stops your database from getting spammed on every keystroke 
  const handleLiveHistorySearchChange = (e) => {
    const freshInputValue = e.target.value;
    setSearchQuery(freshInputValue); 
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    setCurrentPage(1);
    searchTimeoutRef.current = setTimeout(() => {
      fetchSalesDataFromServer(1, freshInputValue.toUpperCase());
    }, 300);
  };

  // =========================================================================
  // 🖨️ THERMAL SCRIPTING SPARK BRIDGING LIFECYCLES
  // =========================================================================

   const handleOpenDescriptionDrawer = (id) => {
    setSelectedSalesId(id);
    setIsDescriptionOpen(true);
  };
//   reciept printing function 

const executeTerminalHardwarePrint = useReactToPrint({
    contentRef:componentToPrintRef,
    documentTitle: `Receipt-${selectedTxForPrint?.invoiceHash || 'POS'}`,
    onAfterPrint: () => {
      console.log("🎉 Print ledger handshake cleared successfully.");
      setSelectedTxForPrint(null);
      setActivePrintingId(null)
    }
  });

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
         executeTerminalHardwarePrint();
        }, 150);

      }catch (err) {
    console.error("❌ Print Dispatch Handshake Aborted:", err);
    setActivePrintingId(null)
    alert(err.response?.data?.message || "Hardware Connection Error: Failed to compile receipt lines data parameters.");
  }
  };

  return (
       <div className="w-full min-h-screen flex flex-col gap-2 text-left select-none  font-sans pb-12 bg-[#f8fafc] ">
            <div className="w-full bg-surface-lowest px-4 sm:px-6 pt-3 pb-3 border-b border-slate-400">

  <div className="w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 lg:gap-6">

    {/* =========================
        BREADCRUMB
    ========================== */}
    <div className="flex items-center gap-1.5 sm:gap-2 text-label-lg text-on-surface font-sans select-none min-w-0 max-w-full">

      <span className="shrink-0">
        Sales
      </span>

      <span className="shrink-0 text-slate-400">
        &rsaquo;
      </span>

      <span className="text-blue-600 min-w-0 break-words">
        Sales Transactions History
      </span>

    </div>


    {/* =========================
        SEARCH
    ========================== */}
    <div className="w-full lg:max-w-lg relative flex items-center shadow-xs group animate-fadeIn">

      {/* Search Icon */}
      <span className="absolute left-4 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none">

        <svg
          className="w-4 h-4 stroke-[2.5]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

      </span>


      {/* Search Input */}
      <input
        type="text"
        value={searchQuery}
        onChange={handleLiveHistorySearchChange}
        placeholder="Search for sales history by amount or payment method"
        className="
          w-full
          h-11
          pl-11
          pr-4
          border
          border-slate-300
          bg-surface-low
          hover:bg-slate-50
          focus:bg-white
          text-sm
          font-semibold
          text-slate-800
          placeholder-slate-400
          rounded-full
          focus:outline-hidden
          focus:border-blue-500
          focus:ring-1
          focus:ring-blue-500
          transition-all
          duration-200
        "
      />

    </div>

  </div>

</div>
      <div className='w-full flex-1 bg-[#f8fafc] px-6 py-6 flex flex-col gap-6'>
      

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-300 pb-5">
        <div className="space-y-1 text-left">
          <h1 className="text-headline-md font-sans text-on-surface tracking-tight">Personal Sales Recorded</h1>
          <p className="text-slate-700 text-body-md font-sans">
            Your personalized sales history from your active cashier sessions.
          </p>
        </div>

       
        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          {/* <button className="h-9 px-4 border border-slate-400 hover:bg-slate-50 bg-surface-lowest text-slate-700 text-label-md font-bold rounded-sm transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs">
            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter
          </button> */}
          <button onClick={() =>navigate("/staff-dashboard/record-sales")} className="h-9 px-5 bg-primary-container hover:bg-primary text-white text-label-md  rounded-sm transition-all cursor-pointer flex items-center gap-1.5 shadow-sm shadow-blue-100">
            <svg className="w-3.5 h-3.5 stroke-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Record Sales
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 📊 CORE SALES LEDGER DATA ROWS GRID */}
      {/* ========================================================================= */}
      <div className="w-full bg-surface-lowest border border-slate-300 rounded-md shadow-sm overflow-hidden">

  {/* =========================
      LOADING STATE
  ========================== */}
  {isLoading ? (
    <div className="w-full min-h-[280px] py-20 px-4 flex flex-col items-center justify-center gap-3">
      <div className="w-7 h-7 border-3 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />

      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
        Syncing database entries...
      </span>
    </div>
  ) : (

    /* =========================
       TABLE SCROLL CONTAINER
    ========================== */
    <div className="w-full overflow-x-auto">

      <table className="w-full min-w-[700px] text-xs text-left border-collapse">

        {/* =========================
            TABLE HEADER
        ========================== */}
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-400 select-none">

            <th className="p-3 sm:p-4 pl-4 sm:pl-6 w-[20%] min-w-[150px]">
              Payment Method
            </th>

            <th className="p-3 sm:p-4 text-center w-[20%] min-w-[140px]">
              Total Amount
            </th>

            <th className="p-3 sm:p-4 text-center w-[20%] min-w-[140px]">
              Timestamp
            </th>

            <th className="p-3 sm:p-4 text-right pr-4 sm:pr-6 w-[40%] min-w-[240px]">
              Actions
            </th>

          </tr>
        </thead>


        {/* =========================
            TABLE BODY
        ========================== */}
        <tbody className="divide-y divide-slate-300 bg-white font-medium text-slate-600">

          {/* =========================
              EMPTY STATE
          ========================== */}
          {salesRecords.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-0 border-none">
                <div className="w-full min-h-[280px] py-16 px-4 flex flex-col justify-center items-center text-center bg-white">
                  <div className="w-full max-w-md space-y-1">

                    {/* Warning / Empty Icon */}
                    <div className="w-10 h-10 bg-primary-container border border-primary-container rounded-full flex items-center justify-center mx-auto mb-3 text-surface-lowest">
                      <svg
                        className="w-5 h-5 stroke-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="3"
                        />
                      </svg>
                    </div>
                    <p className="text-label-md font-sans text-on-surface uppercase tracking-widest m-0">
                      No Sales Recorded Yet
                    </p>
                    <p className="text-body-sm text-on-surface-variant max-w-sm mx-auto font-sans leading-relaxed px-4 mt-1">
                      Your personal transaction record is currently empty.
                      Open the sales desk terminal to process and record your
                      very first customer checkout bill!
                    </p>
                  </div>
                </div>
              </td>
            </tr>
          ) : (

            /* =========================
               SALES RECORDS
            ========================== */
            salesRecords.map((sale) => (
              <tr
                key={sale.id}
                className="hover:bg-slate-50/30 transition-colors"
              >
                {/* =========================
                    PAYMENT METHOD
                ========================== */}
                <td className="p-3 sm:p-4 pl-4 sm:pl-6 align-middle">
                  <span
                    className={`
                      inline-flex
                      items-center
                      gap-1.5
                      px-2.5
                      py-1
                      rounded-lg
                      text-label-md
                      uppercase
                      tracking-wider
                      whitespace-nowrap
                      ${
                        sale.payment_method === "CASH"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : "bg-blue-50 text-blue-700 border border-blue-100"
                      }
                    `}
                  >
                    <span
                      className={`
                        w-1.5
                        h-1.5
                        rounded-full
                        shrink-0
                        ${
                          sale.payment_method === "CASH"
                            ? "bg-emerald-500"
                            : "bg-blue-500"
                        }
                      `}
                    />
                    {sale.payment_method}
                  </span>
                </td>

                {/* =========================
                    TOTAL AMOUNT
                ========================== */}
                <td className="p-3 sm:p-4 font-mono text-on-surface text-center text-label-md align-middle whitespace-nowrap">
                  ₦{Number(sale.total_amount).toLocaleString("en-NG", {minimumFractionDigits: 2, })}
                </td>

                {/* =========================
                    TIMESTAMP
                ========================== */}
                <td className="p-3 sm:p-4 font-mono text-center text-slate-400 align-middle whitespace-nowrap">
                  {new Date(sale.createdAt).toLocaleDateString("en-GB")}
                </td>

                {/* =========================
                    ACTIONS
                ========================== */}
                <td className="p-3 sm:p-4 text-right pr-4 sm:pr-6 align-middle">
                  <div className="flex items-center justify-end gap-2 flex-wrap">

                    {/* VIEW */}
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenDescriptionDrawer(sale.id)
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
                        whitespace-nowrap
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

                      <span>
                        View
                      </span>
                    </button>


                    {/* PRINT */}
                    <button
                      type="button"
                      disabled={activePrintingId === sale.id}
                      onClick={() =>
                        handleTriggerReceiptPrint(
                          sale.id,
                          sale.total_amount,
                          sale.payment_method
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
                        whitespace-nowrap
                        ${
                          activePrintingId === sale.id
                            ? "cursor-not-allowed border-slate-300 hover:text-slate-400 text-slate-500"
                            : "cursor-pointer text-primary hover:text-secondary"
                        }
                      `}
                    >

                      <svg
                        className="w-4 h-4 stroke-2 text-slate-400 shrink-0"
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
                        {activePrintingId === sale.id
                          ? "Processing..."
                          : "Print Receipt"}
                      </span>

                    </button>

                  </div>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>
  )}

</div>

      {/* ========================================================================= */}
      {/* 🧭 LOWER CONTROL PAGINATION NAV STRIP */}
      {/* ========================================================================= */}
            <div className="p-3 sm:p-4 px-3 sm:px-6 bg-surface-low border rounded-md border-slate-300 flex items-center justify-between gap-2 sm:gap-4 select-none">

        {/* Previous Page */}
        <button
            type="button"
            disabled={pagination.hasPreviousPage === false || isLoading}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            className="shrink-0 px-2 sm:px-5 h-9 text-primary border text-label-md border-primary bg-surface-lowest hover:bg-slate-50 rounded-sm transition-all disabled:opacity-40
            flex
            items-center
            justify-center
            gap-1.5
            cursor-pointer
            disabled:cursor-not-allowed
            "
        >
            <svg
            className="w-3.5 h-3.5 stroke-[2.5] shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
            />
            </svg>

            <span className="hidden sm:inline">
            Previous Page
            </span>
        </button>


        {/* Page Information */}
        <div className="min-w-0 flex-1 text-center">

            <p className="text-label-md text-slate-600 font-sans leading-relaxed">

            Page{" "}
            <span className="text-on-surface font-sans text-label-md font-semibold">
                {pagination.currentPage || 1}
            </span>{" "}
            of{" "}
            <span className="text-on-surface font-sans text-label-md font-semibold">
                {pagination.totalPages || 0}
            </span>

            <span className="mx-1 sm:mx-2 text-slate-400">
                •
            </span>

            <span className="text-slate-500 font-medium font-sans">
                Showing{" "}
                {Number(pagination.totalRecords) === 0
                ? 0
                : ((currentPage - 1) * Number(pagination.limit)) + 1}
                {" - "}
                {Math.min(
                currentPage * Number(pagination.limit),
                Number(pagination.totalRecords)
                )}{" "}
                of {Number(pagination.totalRecords)}{" "}
                <span className="hidden sm:inline">
                total Sales
                </span>
                <span className="sm:hidden">
                Sales
                </span>
            </span>

            </p>

        </div>


        {/* Next Page */}
        <button
            type="button"
            disabled={pagination.hasNextPage === false || isLoading}
            onClick={() => setCurrentPage(p => p + 1)}
            className="
            shrink-0
            px-2 sm:px-5
            h-9
            text-primary
            border
            text-label-md
            border-primary
            bg-surface-lowest
            hover:bg-slate-50
            rounded-sm
            transition-all
            disabled:opacity-40
            flex
            items-center
            justify-center
            gap-1.5
            cursor-pointer
            disabled:cursor-not-allowed
            "
        >
            <span className="hidden sm:inline">
            Next Page
            </span>

            <svg
            className="w-3.5 h-3.5 stroke-[2.5] shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
            />
            </svg>
        </button>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🖨️ OUT-OF-SCREEN HARDWARE PRINT ENGINE SPARK CANVAS */}
      {/* ========================================================================= */}
                <div>
                    <ThermalReceiptTemplate 
                      ref={componentToPrintRef} 
                      transactionData={selectedTxForPrint} 
                      paperSize="80mm" 
                    />
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
    </div>
  );
}


