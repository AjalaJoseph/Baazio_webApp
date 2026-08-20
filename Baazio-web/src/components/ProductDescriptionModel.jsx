import React, { useState, useEffect } from 'react';
import api from '../api/axiosClient';

export default function ProductDescriptionModal({ isOpen, salesId, onClose, accessToken }) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch the itemized breakdown whenever a valid salesId is passed into the portal
  useEffect(() => {
    if (!isOpen || !salesId) return;

    const fetchSalesDescription = async () => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        console.log(`[Description Desk] Pulling receipt items for ID: ${salesId}`);
        const response = await api.get(`/sales/${salesId}/sales-description`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setItems(response.data?.data || []);
      } catch (err) {
        console.error(err);
        setErrorMessage(err.response?.data?.message || "Failed to load product breakdown records.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalesDescription();
  }, [isOpen, salesId, accessToken]);

  if (!isOpen) return null;

  // Calculate overall basket sums on the fly safely [S4]
  const totalBill = items.reduce((acc, curr) => acc + (Number(curr.total_price) || 0), 0);
  const totalQty = items.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);

  return (
    <div 
      onClick={onClose} // Backdrop click closes the overlay window cleanly
      className="fixed inset-0 w-full h-full flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs z-50 select-none animate-fadeIn font-sans"
    >
      {/* Card Content Shell - stopPropagation prevents modal from closing when clicking inside the white box */}
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl relative animate-scaleUp text-left"
      >
        
        {/* Upper Absolute X Close button link */}
        <button 
          type="button" 
          onClick={onClose} 
          className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center"
        >
          <svg className="w-4 h-4 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header Block Description */}
        <div className="space-y-1 mb-5">
          <h3 className="text-headline-md  text-on-surface tracking-wide font-sans">
            Transaction Itemized Breakdown
          </h3>
          <p className="text-sm text-slate-400 font-bold font-mono truncate max-w-[90%]">
            TX-ID: #{salesId}
          </p>
        </div>

        {/* ========================================================================= */}
        {/* CORE STATUS INTERFACES (Loading / Errors / Table Data Loops) */}
        {/* ========================================================================= */}
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <div className="w-6 h-6 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
            <span className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">Hydrating Matrix...</span>
          </div>
        ) : errorMessage ? (
          <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-700 text-xs font-semibold text-center leading-relaxed">
            {errorMessage}
          </div>
        ) : (
          <div className="space-y-4">

  {/* =========================================================
      ITEMS TABLE
  ========================================================== */}
  <div className="border border-slate-100 rounded-md max-h-[260px] overflow-auto">

    <table className="w-full min-w-[600px] text-xs text-left border-collapse">

      {/* TABLE HEADER */}
      <thead>
        <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-black uppercase tracking-wider text-slate-400 select-none">
          <th className="p-3 text-left min-w-[200px]">Items Name</th>
          <th className="p-3 text-center w-20">Qty </th>
          <th className="p-3 text-center min-w-[120px]">Unit Price</th>
          <th className="p-3 text-right pr-4 min-w-[130px]">Subtotal</th>
        </tr>
      </thead>

      {/* TABLE BODY */}
      <tbody className="divide-y divide-slate-50 bg-white font-medium text-slate-600">
        {items && items.length > 0 ? (
          items.map((item, idx) => (
            <tr key={item.id || idx} className="hover:bg-slate-50/40 transition-colors">

              {/* PRODUCT NAME */}
              <td className="p-3 font-bold text-slate-800 uppercase max-w-[220px]">
                <span className="block truncate" title={item.productName}>
                  {item.productName}
                </span>
              </td>

              {/* QUANTITY */}
              <td className="p-3 text-center font-bold font-mono whitespace-nowrap">
                {item.quantity}
              </td>

              {/* UNIT PRICE */}
              <td className="p-3 text-center font-mono whitespace-nowrap">
                ₦
                {Number(item.unit_price).toLocaleString("en-NG", {
                  minimumFractionDigits: 0,
                })}

              </td>

              {/* SUBTOTAL */}
              <td className="p-3 text-right font-bold font-mono text-slate-800 pr-4 whitespace-nowrap">
                ₦{Number(item.total_price).toLocaleString("en-NG", {
                  minimumFractionDigits: 0,
                })}
              </td>
            </tr>
          ))
        ) : (

          <tr>
            <td
              colSpan={4}
              className="p-8 text-center text-slate-400 font-bold uppercase text-[10px]"
            >
              No items map to this batch log records.
            </td>
          </tr>

        )}

      </tbody>

    </table>

  </div>


  {/* =========================================================
      TOTAL SUMMARY
  ========================================================== */}
  <div className="
  p-4
  bg-slate-50
  border
  border-slate-100
  rounded-md
  flex
  flex-col
  sm:flex-row
  sm:items-center
  sm:justify-between
  gap-4
  text-label-md
  font-sans
  font-black
  text-slate-700
">

  {/* ITEM STATISTICS */}
  <div className="
    flex
    items-center
    justify-between
    sm:justify-start
    gap-6
    sm:gap-4
    w-full
    sm:w-auto
  ">

    <div className="flex flex-row sm:flex-row sm:items-center gap-0.5 sm:gap-1 whitespace-nowrap">
      <p>ITEMS:</p>

      <p className="font-mono text-primary font-black">
        {items.length}
      </p>
    </div>
    <div className="flex flex-row sm:flex-row sm:items-center gap-0.5 sm:gap-1 whitespace-nowrap">
      <p>TOTAL QTY:</p>
      <p className="font-mono text-primary font-black">
        {totalQty}
      </p>
    </div>

  </div>

  {/* GROSS BILL */}
  <div className="
    w-full
    sm:w-auto
    flex
    items-center
    justify-between
    sm:justify-end
    pt-3
    sm:pt-0
    border-t
    sm:border-t-0
    border-slate-200
    text-left
    sm:text-right
    whitespace-nowrap
  ">

    <span className="text-label-md">
      GROSS BILL:
    </span>

    <span className="font-mono text-sm font-black text-slate-900">
      ₦
      {totalBill.toLocaleString("en-NG", {
        minimumFractionDigits: 2,
      })}
    </span>

  </div>

</div>

</div>
        )}

        {/* Bottom Closing Action Control Row */}
        <div className="mt-5 pt-3 border-t border-slate-300 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-label-md transition-colors cursor-pointer focus:outline-none"
          >
            Close Sheet
          </button>
        </div>

      </div>
    </div>
  );
}
