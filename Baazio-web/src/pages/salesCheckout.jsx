import React, { useState, useEffect , useRef} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SalesSuccessModal from '../components/SalesSuccessModel';
import { useReactToPrint } from 'react-to-print';
import { ThermalReceiptTemplate } from '../components/TherminalReciept';
import AlertModal from "../components/alert"
import api from '../api/axiosClient';
import { useAuthStore } from '../store/authStore';


export default function CheckoutReviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const [isSubmitting, setIsSubmitting] = useState(false);
   const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [finalizedInvoiceId, setFinalizedInvoiceId] = useState("");
  const componentToPrintRef = useRef(null);
  const [selectedTxForPrint, setSelectedTxForPrint] =useState(null)
  const [userData, setUserData] = useState({})
   const [targetPaperWidth, setTargetPaperWidth] = useState("80mm");
   const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
    actionLabel: ""
  });
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

    const handleCloseModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }));

    useEffect(() =>{
      const getUserData = async () =>{
        const response = await api.get("/auth/me",{headers:{Authorization: `Bearer ${accessToken}`}})
        setUserData(response.data.data)
      }
      getUserData()
    },[accessToken] )
  const checkoutData = location.state || { items: [], paymentMethod: "CASH DRAWER", totalAmount: 0 };
    // console.log(checkoutData)
  const handleConfirmAndSaveTransaction = async () => {
    if (checkoutData.items.length === 0) {
        return;
    }
    setIsSubmitting(true);
    try {
      console.log("📡 Committing absolute POS payload array to server endpoint...");
        const items = checkoutData.items.map((item) => {
            return {
            productId: item.productId || null,
            product_name: item.product_name,
            unit_price: item.unit_price,
            quantity: item.quantity,
            };
        });

        const payload = {
        payment_method: checkoutData.paymentMethod,
        items: items,
        };
       const idempotencyKey = crypto.randomUUID();
      const response = await api.post("/sales/record-sales", payload, {
        headers: { Authorization: `Bearer ${accessToken}`,  "Idempotency-Key": idempotencyKey, }
      });

      console.log("🎉 Transaction committed successfully to database records!");
       const transactionId = response.data?.data?.saleHeader.id || "";
      setFinalizedInvoiceId(transactionId);
      setIsSuccessOpen(true);

    } catch (err) {
      console.error(err);
      const serverFeedbackMessage = err.response?.data?.message || "Failed to finalize database records transaction.";
       setModalConfig({
        isOpen: true,
        type: "danger", 
        title: "Transaction Refused",
        message: serverFeedbackMessage,
        actionLabel: "Try Again" // Maps cleanly to your {actionLabel} parameter element [S4]
      });
      // alert(err.response?.data?.message || "Failed to finalize database records transaction.");
    } finally {
      setIsSubmitting(false);
    }
  };

   const executeTherminalHardwarePrint = useReactToPrint({
      contentRef:componentToPrintRef,
      documentTitle:`Receipt-${selectedTxForPrint?.invoiceHash || 'POS'}`,
      onAfterPrint: () =>{
         console.log("🎉 Print pipeline handshake cleared. Initiating cache and navigation purge...");
         setSelectedTxForPrint(null); 
        setIsSuccessOpen(false);
        navigate("/staff-dashboard/record-sales", { state: null, replace: true });
      }
    })
   const handleTriggerReceiptPrint = async (sales_id, total_amount,payment_method) => {
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
  return (
        <div className="w-full min-h-screen flex flex-col gap-2 text-left select-none  font-sans pb-12 bg-[#f8fafc] ">
        <div className='flex flex-row justify-between bg-surface-lowest border-b border-slate-400 px-6 py-4'>
         <div className="flex items-center gap-2 text-md tracking-tight font-semibold text-on-surface select-none">
        <span>Live Terminal</span>
        <span className="w-2 h-2 mt-1 rounded-full bg-emerald-500 animate-pulse" />
      </div>
       <div className="bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl shadow-3xs flex items-center gap-2 text-slate-600 text-xs font-bold font-mono">
            <svg className="w-4 h-4 text-slate-400 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{currentTime}</span>
          </div>
      </div>

      <div className="w-full space-y-6 font-sans select-none  bg-[#f8fafc] px-6 pt-5">
      <div className="flex items-center gap-2 text-label-md text-on-surface-variant select-none">
        <span className='font-sans'>Checkout</span>
        <span className=''>&rsaquo;</span>
        <span className="text-primary">Review &amp; Confirmation</span>
      </div>

      <div className="w-full bg-surface-lowest border border-slate-400 rounded-md p-6 md:p-8 shadow-md space-y-6">
        
        {/* HEADER BRANDING DESCRIPTIONS */}
        <div className="space-y-2 border-b border-slate-300 pb-5 text-left">
          <h1 className="text-2xl font-bold text-on-surface ">Review &amp; Confirm Checkout Details</h1>
          <p className="text-body-sm text-slate-500  leading-relaxed max-w-2xl">
            Carefully cross-check your entry numbers. If an accounting error is spotted, return to edit parameters instantly before finalizing transaction records.
          </p>
        </div>

        {/* 📊 CONFIRMATION DATA LEDGER TABLE GRID */}
        <div className="w-full border border-slate-300 rounded-sm overflow-x-auto bg-slate-50/50">

  <table className="w-full min-w-150 text-xs text-left border-collapse">

    {/* =========================
        TABLE HEADER
    ========================== */}
    <thead>
      <tr className="bg-slate-50 border-b border-slate-300 text-[12px] font-black uppercase tracking-wider text-slate-400 select-none">

        <th className="p-3 sm:p-4 pl-4 sm:pl-6 min-w-55">
          Item Name
        </th>

        <th className="p-3 sm:p-4 text-right min-w-30">
          Price
        </th>

        <th className="p-3 sm:p-4 text-center w-24 min-w-22.5">
          Qty
        </th>

        <th className="p-3 sm:p-4 text-right pr-4 sm:pr-6 min-w-35">
          Total
        </th>

      </tr>
    </thead>


    {/* =========================
        TABLE BODY
    ========================== */}
    <tbody className="divide-y divide-slate-100 bg-white font-medium text-slate-700">

      {checkoutData.items.map((item, idx) => (

        <tr
          key={item.productId || idx}
          className="hover:bg-slate-50/20 transition-colors text-label-md"
        >

          {/* ITEM NAME */}
          <td className="p-3 sm:p-4 pl-4 sm:pl-6 text-slate-800 align-middle">

            <div
              className="max-w-70 truncate"
              title={item.product_name}
            >
              {item.product_name}
            </div>

          </td>


          {/* UNIT PRICE */}
          <td className="p-3 sm:p-4 font-mono text-right whitespace-nowrap align-middle">

            ₦
            {Number(item.unit_price).toLocaleString("en-NG", {
              minimumFractionDigits: 2,
            })}

          </td>


          {/* QUANTITY */}
          <td className="p-3 sm:p-4 text-center font-mono text-slate-400 whitespace-nowrap align-middle">

            x {item.quantity}

          </td>


          {/* TOTAL */}
          <td className="p-3 sm:p-4 font-mono text-slate-900 text-right pr-4 sm:pr-6 whitespace-nowrap align-middle">

            ₦
            {Number(item.total_price).toLocaleString("en-NG", {
              minimumFractionDigits: 2,
            })}

          </td>

        </tr>

      ))}

    </tbody>

  </table>

</div>

        {/* 💵 LOWER TOTAL METRICS STRIP CONTAINER */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-4 border-t border-slate-100">

  {/* =========================
      SELECTED PAYMENT CHANNEL
  ========================== */}
  <div className="
    inline-flex
    w-full
    sm:w-auto
    items-center
    gap-2
    px-3
    py-2
    bg-slate-50
    border
    border-slate-200
    rounded-lg
    text-label-md
    text-slate-600
    shadow-sm
    select-none
    min-w-0
  ">

    <svg
      className="w-5 h-5 text-secondary stroke-2 shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18" />
    </svg>

    <span className="text-label-md leading-relaxed min-w-0">
      Selected Payment Channel:{" "}
      <span className="uppercase text-primary font-serif font-semibold">
        {checkoutData.paymentMethod}
      </span>
    </span>

  </div>


  {/* =========================
      GRAND TOTAL
  ========================== */}
  <div className="
    w-full
    sm:w-auto
    text-left
    sm:text-right
    space-y-0.5
    select-none
  ">

    <span className="
      text-label-md
      uppercase
      tracking-wider
      text-slate-500
      block
    ">
      Total Final Payment Due
    </span>

    <span className="
      text-2xl
      sm:text-3xl
      font-black
      text-blue-600
      font-mono
      tracking-tight
      block
      whitespace-nowrap
    ">
      ₦
      {Number(checkoutData.totalAmount).toLocaleString("en-NG", {
        minimumFractionDigits: 2,
      })}
    </span>

  </div>

</div>

      </div>

      {/* ========================================================================= */}
      {/* BUTTON SYSTEM ACTION ROW */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
        {/* Back Link Button: safely lets the cashier return to make additions with zero loss of row array input data */}
        <button
          type="button"
          disabled={isSubmitting}
            onClick={() => navigate("/staff-dashboard/record-sales", {state: { items: checkoutData.items }})}
          className="w-full sm:w-auto h-11 px-5 border border-tertiary hover:border-error bg-red-50/40 text-tertiary hover:bg-red-50 rounded-md  text-label-md  tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer focus:outline-none disabled:opacity-50"
        >
          <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          <span>Click to Edit Order</span>
        </button>

        {/* Confirm Save database pipeline execution trigger button */}
        <button
          type="button"
          disabled={isSubmitting || checkoutData.items.length === 0}
          onClick={handleConfirmAndSaveTransaction}
          className="w-full sm:w-auto h-11 px-6 bg-primary-container hover:bg-blue-700 active:scale-[0.995] text-surface-lowest rounded-md font-black text-label-md tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-md shadow-blue-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-none"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          )}
          <span>{isSubmitting ? "Saving Transaction..." : "Confirm & Save Transaction"}</span>
        </button>
      </div>

          {/* ========================================================================= */}
{/* 🛡️ AUDIT TRAIL COMPLIANCE INFORMATIONAL CARD ALERT */}
{/* ========================================================================= */}
<div className="w-full bg-[#f4f7fe] border border-[#dbe4f9] rounded-xl p-4 flex items-start gap-3 text-left mt-4 select-none animate-fadeIn">
  
  {/* Info Circular Icon Vector Anchor */}
  <div className="text-[#1d4ed8] mt-0.5 shrink-0">
    <svg className="w-6 h-6 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0-4h.01" />
    </svg>
  </div>

  {/* Description Metadata Stack Container */}
  <div className="space-y-0.5 font-sans">
    {/* Alert Header Title */}
    <h4 className="text-headline-md font-black text-slate-800 tracking-tight">
      Audit Trail Active
    </h4>
    
    {/* Alert Body Information Copy */}
    <p className="text-body-md text-slate-600 font-sans leading-relaxed tracking-normal">
      This transaction will be finalized and recorded under your active cashier profile with a timestamp of{" "}
      <span className="font-mono font-bold text-slate-800">
        {new Date().toLocaleDateString('en-GB')} {new Date().toLocaleTimeString('en-GB')}
      </span>
      . Ensure physical collection balances with the terminal matrix before finalizing.
    </p>
  </div>

</div>

    </div>
     <SalesSuccessModal 
        isOpen={isSuccessOpen}
        invoiceId={finalizedInvoiceId}
        totalPaid={checkoutData.totalAmount}
         onPrint={() => {
            handleTriggerReceiptPrint(
              finalizedInvoiceId, 
              checkoutData.totalAmount, 
              checkoutData.paymentMethod
            );
          }}
        onNewSale={() => {
          setIsSuccessOpen(false);
          navigate("/staff-dashboard/record-sales", { state: null }); 
        }}
      />

        <div>
          <ThermalReceiptTemplate 
          ref={componentToPrintRef} 
          transactionData={selectedTxForPrint} 
          paperSize={targetPaperWidth} 
        />
        </div>

         <AlertModal 
            isOpen={modalConfig.isOpen}
            type={modalConfig.type}
            title={modalConfig.title}
            message={modalConfig.message}
            actionLabel={modalConfig.actionLabel}
            onAction={handleCloseModal} // 🎯 Direct confirmation handler button path [S4]
            onClose={handleCloseModal}  // 🎯 Background backdrop clicking safety paths
          />
    </div>
    
  );
}
