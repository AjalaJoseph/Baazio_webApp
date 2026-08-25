import React, { useState, useMemo, useRef, useEffect } from 'react';
import api from '../api/axiosClient';
import { useAuthStore } from '../store/authStore';
import { parseExcelStockSheet } from '../utils/excelparser';

export default function UploadInventoryPage() {
    const accessToken = useAuthStore((state) => state.accessToken);
   const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const [inventoryRows, setInventoryRows] = useState([
    { id: 'INIT-1', product_name: '', sellingPrice: 0, quantity: 0 }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [userData, setUserData] = useState(null)
  // 📐 LIVE TELEMETRY MATRIX AGGREGATIONS
  const totalBatchCalculatedValue = useMemo(() => {
    return inventoryRows.reduce((sum, item) => sum + (Number(item.sellingPrice) * Number(item.quantity || 0)), 0);
  }, [inventoryRows]);
  useEffect(() =>{
    const getUserData = async () =>{
        try{
        const user = await api.get('/auth/me', { headers: { Authorization: `Bearer ${accessToken}` } })
        setUserData(user.data.data);
        }catch(error){
            console.log(error)
        }
    }
    getUserData()
  }, [accessToken])

  const initials = userData?.owner_name
  ? userData.owner_name
      .split(" ")
      .map(n => n[0])
      .join("")
  : "";
  // 🔄 FIELD MUTATION HANDLER (Updates target fields instantly in local memory state)
  const handleInputChange = (id, fieldName, value) => {
    setInventoryRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [fieldName]: value } : row))
    );
  };

  // ➕ Add a blank row manually to the end of the stock matrix grid table
  const handleAddNewProductRow = () => {
    const freshNode = { id: `MANUAL-${Date.now()}`, product_name: '', sellingPrice: 0, quantity: 0 };
    setInventoryRows((prev) => [...prev, freshNode]);
  };

  // 🗑️ Delete a row from your active local mutable collection loop
  const handleRemoveProductRow = (id) => {
    if (inventoryRows.length <= 1) {
        return; 
    }// Keep at least one row active on screen
    setInventoryRows((prev) => prev.filter((row) => row.id !== id));
  };

  // 📡 EXCEL FILE DROP/SELECTION PARSE HANDSHAKE
  const handleExcelUpload = async (e) => {
    const targetedFile = e.target.files?.[0];
    if (!targetedFile) {
        return;
    }
    setUploadError("");
    setIsProcessing(true);
    try {
      const parsedDataset = await parseExcelStockSheet(targetedFile);
      if (parsedDataset.length === 0) {
        throw new Error("Targeted spreadsheet contains no valid row data.");
      }
      const validatedPayload = parsedDataset
      .map(row => ({
        product_name: row.product_name?.trim(),
        sellingPrice: parseFloat(row.selling_price) || 0,
        quantity: parseInt(row.quantity) || 0
      }))
      .filter(row => row.product_name !== ""); // Drops empty rows safely [S4]

    if (validatedPayload.length === 0) {
      throw new Error("Validation Error: Please fill out at least one product row with a valid name.");
    }
    const response = await api.post("/upload-products", {
      products: validatedPayload
    },
    { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (response.data.status === 'success' || response.status === 201) {
        setIsSuccess(true);
    }
    } catch (err) {
      setUploadError(err.message || "Failed to parse document files safely.");
    } finally {
      setIsProcessing(false);
    }
  };

  // 🚀 BULK DEPLOYMENT SUBMISSION TRANSMISSION PIPELINE
  const handleDeployBulkStock = async () => {
  setUploadError("");

  const finalPayload = [];

  // 🛡️ SCAN ALL ROWS LAYER-BY-LAYER
  for (let i = 0; i < inventoryRows.length; i++) {
    const row = inventoryRows[i];
    const rowNum = i + 1;
    const trimmedName = row.product_name?.trim();
    const price = parseFloat(row.sellingPrice) || 0;
    const qty = parseInt(row.quantity) || 0;

    // SCENARIO 1: The row is completely untouched and blank -> Skip/Drop it silently
    if (!trimmedName && price === 0 && qty === 0) {
      continue; 
    }

    // SCENARIO 2: Incomplete row entry data -> Hard block and alert the owner immediately
    if (trimmedName && (price <= 0 || qty < 0)) {
      setUploadError(
        `Configuration Fault on Row ${String(rowNum).padStart(2, '0')}: ` +
        `"${trimmedName}" needs a valid selling price greater than ₦0.00.`
      );
      return; // Stop the execution line completely before hitting your database API
    }

    if (!trimmedName && (price > 0 || qty > 0)) {
      setUploadError(
        `Configuration Fault on Row ${String(rowNum).padStart(2, '0')}: ` +
        `Please specify a Product Name for this entry line.`
      );
      return; // Stop the execution line completely
    }

    // SCENARIO 3: The row is completely valid -> Add it to our clean deploy batch bundle
    finalPayload.push({
      product_name: trimmedName,
      sellingPrice: price,
      quantity: qty
    });
  }

  // SCENARIO 4: The owner didn't type anything at all across the entire matrix canvas
  if (finalPayload.length === 0) {
    setUploadError("Validation Error: Your stock matrix is completely empty. Please fill out at least one product row.");
    return;
  }

  // 🚀 DISPATCH TRANSACTIONS SECURELY ONCE ALL VALIDATIONS PASS
  setIsProcessing(true);
  try {
    console.log("Bulk upload validation passed. Shipping payload array to backend...", finalPayload);
    
    const response = await api.post("/upload-products", {
      products: finalPayload
    },
    { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (response.data.status === 'success' || response.status === 201) {
        setIsSuccess(true);
      setInventoryRows([{ id: 'RESET-1', name: '', selling_price: 0, quantity: 0 }]);
    }
  } catch (err) {
    console.error(err);
    const errorCode = err.response?.data?.status
    const backendMessage = err.response?.data?.message;
    if(errorCode === 400){
        setUploadError(backendMessage || "Input validation error: Please verify your row data values.");
    }else{
        window.location.href = "/server-error";
    }
  } finally {
    setIsProcessing(false);
  }
};
const triggerTemplateDownloadAction = async () => {
  try {
    console.log("📡 Dispatching authenticated Axios data-stream extraction...");

    setIsDownloadingTemplate(true);
    const response = await api.get("/products/download-template", {
      responseType: "blob", // 🎯 CRUCIAL: Tells Axios to treat the data as a downloadable file asset
    });

    const blobFileUrl = window.URL.createObjectURL(new Blob([response.data], { type: "text/csv" }));
    
    // 3. Construct a virtual anchor element mapping directly to your filesystem layout guidelines
    const virtualDownloadLink = document.createElement("a");
    virtualDownloadLink.href = blobFileUrl;
    
    // Explicitly define the saving layout target file name string natively
    virtualDownloadLink.setAttribute("download", "baazio_product_upload_template.csv");
  
    document.body.appendChild(virtualDownloadLink);
    virtualDownloadLink.click();
    document.body.removeChild(virtualDownloadLink);
    window.URL.revokeObjectURL(blobFileUrl);

  } catch (error) {
    console.error("❌ Failed to stream down bulk storage spreadsheet asset:", error);
  }finally{
    setIsDownloadingTemplate(false)
  }
};

  return (
   <div className="w-full min-h-screen flex flex-col gap-2 text-left select-none  font-sans pb-12 bg-[#f8fafc] ">
      
      {/* HEADER SECTION TITLE CONTROL */}
       <div className="w-full bg-surface-lowest flex items-center justify-between gap-3 px-4 sm:px-6 pt-3 pb-2 border-b border-slate-400">
        <h1 className="text-label-lg text-on-surface  font-sans">Add / Upload Stock</h1>
         <button  type="button"  className="inline-flex items-center justify-center p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer group shadow-xs select-none"
             aria-label="Open user account profile settings menu">
            <div className="w-9 h-9 rounded-full bg-primary text-white border border-blue-400/20 flex items-center justify-center font-bold font-sans text-[13px] uppercase shrink-0 shadow-md transition-transform duration-200 group-hover:scale-95">
                {initials}
            </div>
        </button>
      </div>
        <div className='w-full flex-1 bg-[#f8fafc] px-6 py-6 flex flex-col gap-6'>
      {/* 📥 LAYER 1: EXCEL DRAG & DROP SEED DROPZONE PANEL */}
      <div className='border p-5 rounded-md border-slate-400'>
        <div className="w-full bg-surface-lowest border border-dashed border-slate-400 rounded-md p-7 flex flex-col items-center justify-center text-center shadow-xs transition-colors hover:bg-slate-50/50">
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleExcelUpload}
          accept=".xlsx, .xls, .csv" 
          className="hidden" 
        />
        
        {/* Blue download icon ring */}
        <div className="w-13 h-13 bg-primary-container border-4 border-primary-container rounded-full flex items-center justify-center  mb-4 ">
          <svg className="w-6 h-6  text-surface-lowest" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </div>

        <h3 className="text-on-surface-variant text-headline-md tracking-tight flex items-center gap-1.5 font-sans">
          <svg className="w-5 h-5 text-slate-500 hidden md:block lg:block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Import Stock via Excel Spreadsheet
        </h3>
        
        <p className="text-[13px] text-on-surface-variant/50 font-sans max-w-sm mt-1 ">
          Drag and drop your spreadsheet bulk data log file here (.xlsx or .csv) to auto-populate your inventory layout instantly.
        </p>

        {/* Control Button Elements row coupling */}
        <div className="flex flex-col lg:flex-row  md:flex-row items-center gap-3 mt-5">
          <button 
            type="button"
            disabled={isProcessing}
            onClick={() => fileInputRef.current?.click()}
            className="h-8 px-7 bg-primary font-sans hover:bg-primary-container disabled:bg-slate-200 text-surface-lowest rounded-md text-body-md   transition-all  cursor-pointer disabled:cursor-not-allowed"
          >
            {isProcessing ? "Processing Data Sheet..." : "Select File"}
          </button>
          <button
            type="button"
            onClick={triggerTemplateDownloadAction}
            disabled={isDownloadingTemplate} // 🛡️ Hard lock: Blocks double clicks completely while running! [S4]
            className={`className="h-8 px-5 border hover:bg-surface  bg-surface-lowest border-slate-300  text-on-surface rounded-md text-body-md font-sans transition-colors cursor-pointer active:scale-[0.98] disabled:cursor-not-allowed"`}
          >
            {isDownloadingTemplate ? "Processing File...": "Download Template"}
          </button>
        </div>
      </div>
      </div>

      {/* 🚨 REUSE ACCENTED EXCEPTION NOTIFICATION ERROR ALERT BOX */}
      {/* 🚨 EXPERT TOP-SLIDING OVERLAY MODAL: Fixed viewport positioning anchors */}
        {uploadError && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-55 pointer-events-auto animate-slideDown">
            <div className="w-full bg-white border border-error rounded-xl p-4 flex items-start gap-3 shadow-lg shadow-red-100/50 text-left">
              
              {/* Red Hexagon Warning Visual Icon Accent */}
              <div className="w-8 h-8 bg-red-50 border border-red-100 rounded-lg flex items-center justify-center text-tertiary-container shrink-0">
                <svg className="w-5 h-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>

              {/* Main Context Error Content Information Message */}
              <div className="flex-1 min-w-0 pt-0.5">
                <h4 className="text-on-surface text-xs font-black uppercase tracking-wider font-sans">
                  Upload Error Exception
                </h4>
                <div className="text-slate-600 text-body-sm leading-relaxed font-sans mt-1 pr-2 wrap-break-words">
                  {uploadError}
                </div>
              </div>

              {/* Close Action Trigger Button Capsule */}
              <button 
                type="button"
                onClick={() => setUploadError("")} // Instantly clears out error string to drop overlay shut
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
                aria-label="Dismiss alert"
              >
                <svg className="w-5 h-5 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

            </div>
          </div>
        )}


      {/* 📊 LAYER 2: THE BULK PRODUCT ENTRY MATRIX GRID SECTION */}
      <div className="w-full bg-white border border-slate-400 rounded-md shadow-xs overflow-hidden">
        
        {/* Matrix Row Label Title */}
        <div className="p-4 border-b border-slate-400 flex items-center justify-between">
          <div>
            <h4 className=" font-sans text-on-surface text-headline-md">Bulk Product Entry & Stock Matrix</h4>
            <p className="text-body-sm text-slate-600 mt-0.5 font-medium font-sans">Add multiple product parameters row-by-row before committing updates to the central database.</p>
          </div>
          <span className="hidden lg:inline-flex md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[10px] font-bold  tracking-wider uppercase font-sans bg-slate-100 text-slate-500 border border-blue-100/50">
            <span className="w-1.5 h-1.5 rounded-full bg-primary block animate-pulse" />
            Live Edit Mode
          </span>
        </div>

        {/* TABLE COMPONENT ELEMENT VIEWPORT WINDOW WITH MOBILE RESPONSIVE OVERFLOW */}
        <div className="w-full max-h-60 overflow-auto scrollbar-thin scrollbar-thumb-slate-200">
          <table className="w-full min-w-200 text-left border-collapse">
            <thead>
              <tr className="bg-surface-low border-b border-slate-100 text-slate-400 text-[11px]  uppercase tracking-widest">
                <th className="p-4 pl-6 w-20">Row </th>
                <th className="p-4">Product Name</th>
                <th className="p-4 w-48 text-right">Selling Price (₦)</th>
                <th className="p-4 w-36 text-center">Quantity</th>
                <th className="p-4 pr-6 w-20 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300 bg-slate-50">
              {inventoryRows.map((row, index) => (
                <tr key={row.id} className="hover:bg-slate-50/30 transition-colors">
                  
                  {/* Row index padding numbering output */}
                  <td className="p-4 pl-6 font-mono text-sm  text-slate-700">
                    {String(index + 1).padStart(2, '0')}
                  </td>

                  {/* Input Interface Field: Product Name string tag mapping */}
                  <td className="p-4">
                    <input 
                      type="text"
                      value={row.product_name}
                      onChange={(e) => handleInputChange(row.id, 'product_name', e.target.value)}
                      placeholder="Product Name"
                      className="w-full h-11 px-3 border border-slate-300 focus:border-blue-500  bg-surface-lowest rounded-md text-label-md  text-on-surface-variant placeholder-slate-500 focus:outline-hidden transition-all shadow-sm"
                    />
                  </td>

                  {/* Input Interface Field: Selling price numerical bounds tracking */}
                  <td className="p-4">
                    <div className="relative flex items-center justify-end">
                      <span className="absolute left-3 text-sm text-slate-400 font-bold pointer-events-none">₦</span>
                      <input 
                        type="number"
                        min="1"
                        value={row.sellingPrice || ''}
                        onChange={(e) => handleInputChange(row.id, 'sellingPrice', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        className="w-full h-11 pl-7 pr-3 border border-slate-400 focus:border-primary  bg-surface-lowest rounded-md text-label-md text-on-surface-variant focus:outline-hidden placeholder-slate-500 transition-all font-sans shadow-sm"
                      />
                    </div>
                  </td>

                  {/* Input Interface Field: Item Quantity counter selector */}
                  <td className="p-4">
                    <input 
                      type="number"
                      min="0"
                      value={row.quantity || ''}
                      onChange={(e) => handleInputChange(row.id, 'quantity', parseInt(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full h-10 px-3 text-center border placeholder-slate-500 border-slate-400 focus:border-primary-container bg-surface-lowest rounded-md text-label-md font-bold text-slate-800 focus:outline-hidden transition-all font-mono shadow-sm"
                    />
                  </td>

                  {/* Delete Trash individual cell row execution link toggle */}
                  <td className="p-4 pr-6 text-center">
                    <button 
                      type="button"
                      disabled={inventoryRows.length <= 1}
                      onClick={() => handleRemoveProductRow(row.id)}
                      className="text-slate-800 hover:text-red-500 disabled:opacity-30 disabled:hover:text-slate-300 p-1.5 rounded-md hover:bg-slate-50 transition-all cursor-pointer disabled:cursor-not-allowed"
                      title="Drop product row"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ➕ APPEND BLANK MATRIX ROW ENTRY CONTROL FOOTER SLIDER ACTION INTERFACE KEY */}
        <div className="p-4 bg-slate-50/50 border-t border-slate-100">
          <button 
            type="button"
            onClick={handleAddNewProductRow}
            className="w-full h-11 border border-dashed border-primary hover:bg-white text-slate-500 hover:text-blue-600 hover:border-blue-400  rounded-md text-label-md transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Another Product Row
          </button>
        </div>
      </div>

      {/* 📊 LAYER 3: REAL-TIME TELEMETRY MATRIX METRICS AGGREGATOR BANNER BOTTOM ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-6">
        
        {/* Box A: Row Count Capacity Total indicator */}
        <div className="bg-surface-lowest border border-slate-400 rounded-md p-4 flex items-center gap-3.5 shadow-2xs">
          <div className="w-9 h-9 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-label-md font-sans uppercase  text-slate-400 ">Active Entry Rows</span>
            <p className="text-xl font-black text-slate-800 tracking-tight leading-none mt-0.5">{inventoryRows.length}</p>
          </div>
        </div>

        {/* Box B: Estimated Batch Total Evaluation Currency counter */}
        <div className="bg-surface-lowest border border-slate-400 rounded-md p-3 flex items-center gap-3.5 shadow-2xs">
          <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16M14 6H10" />
            </svg>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-label-md  uppercase mb-1 text-slate-400 font-sans">Est. Batch Value</span>
            <p className="text-xl font-black text-slate-800 tracking-tight leading-none mt-0.5 font-mono">
              ₦{totalBatchCalculatedValue.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Box C: Historical Action Timestamp indicator anchor */}
        <div className="bg-surface-lowest border border-slate-400 rounded-md p-3 flex items-center gap-3.5 shadow-2xs">
          <div className="w-10 h-10 bg-amber-50 border border-amber-100 rounded-lg flex items-center justify-center text-amber-500 shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sans">Last Submission</span>
            <p className="text-sm font-bold text-slate-700 tracking-tight mt-0.5 leading-none">Just now tracking</p>
          </div>
        </div>
      </div>

      {/* 🚀 LAYER 4: CENTRAL DEPLOYMENT TRANSACTION SUBMIT ROUTINE TRIGGER */}
      <div className="w-full flex flex-col items-center justify-center gap-2 pt-4">
        <button 
          type="button"
          disabled={isProcessing}
          onClick={handleDeployBulkStock}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white rounded-md text-sm font-bold flex items-center justify-center gap-2 tracking-wide transition-all shadow-md shadow-blue-100 cursor-pointer disabled:cursor-not-allowed disabled:text-slate-400"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-400 border-t-blue-600 rounded-full animate-spin" />
              Processing Stock Deployment Matrix...
            </>
          ) : (
            <>
              Save All Inventory Items & Deploy Stock 
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>
        <p className="text-body-md text-slate-400 font-medium tracking-wide">
          Upon deployment, these items will be immediately available across all warehouse and active cashier terminal instances.
        </p>
      </div>
          </div>
          {/* 🎉 EXPERT INVENTORY SUCCESS STATUS CONFIRMATION OVERLAY MODAL */}
      {isSuccess && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
          
          {/* Backdrop blur shield masking layer */}
          <div 
            onClick={() => setIsSuccess(false)} 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 ease-in-out animate-fadeIn" 
          />

          {/* Centered micro-canvas panel container screen view */}
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-6 flex flex-col items-center justify-center text-center animate-scaleUp">
            
            {/* Animated Success Ring Vector Asset */}
            <div className="w-16 h-16 bg-emerald-50 border-4 border-emerald-100 rounded-full flex items-center justify-center text-emerald-500 mb-5 shadow-inner">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Confirmation Title Branding */}
            <h4 className="text-on-surface text-headline-md  tracking-tight font-sans">
              Inventory Upload Successfully!
            </h4>
            
            {/* High-Utility UX Delivery Message Description */}
            <p className="text-slate-500 text-body-sm leading-relaxed max-w-xs mt-2 font-medium">
              Batch stock parameters have been committed to the database ledger. These items are now live and fully transactional across all cashier terminal instances.
            </p>

            {/* Clear Primary Action Gate Return Button */}
            <button 
              type="button"
              onClick={() => setIsSuccess(false)} // Dismisses success modal cleanly
              className="mt-6 w-full h-11 bg-secondary hover:bg-on-secondary-container text-surface-low rounded-lg text-body-md  transition-all shadow-md cursor-pointer"
            >
              Return to Batch Workspace
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

