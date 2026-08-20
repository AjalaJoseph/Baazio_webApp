import React from 'react';

export const ThermalReceiptTemplate = React.forwardRef(({ transactionData, paperSize = "80mm" }, ref) => {
  if (!transactionData) {
    return ;
  }
  // Dynamically swap layout pixel constraints matching hardware dimensions
  const is80mm = paperSize === "80mm";
  const containerWidthClass = is80mm ? "w-[288px]" : "w-[180px]"; 
  return (
    <div className="hidden">
      {/* 🖨️ THE PRINTING TARGET ZONE */}
      <div 
        ref={ref}
        className={`${containerWidthClass} bg-surface-lowest text-black p-2 font-sans text-[11px] leading-tight select-none`}
        style={{ color: '#000000', backgroundColor: '#ffffff',WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }} 
       >
        {/* Strict CSS Media Query Injection to tell the printer hardware precisely where to cut paper roll */}
       <style dangerouslySetInnerHTML={{__html: `
            @media print {
              @page { 
                size: ${is80mm ? '80mm auto' : '50mm auto'}; 
                margin: 0mm; 
              }
              body { 
                margin: 0mm; 
                background: #ffffff !important; 
                color: #000000 !important; 
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              /* 🎯 FIXED: Force solid black lines to appear on thermal print heads */
              .receipt-border-solid { border-bottom: 1.5px solid #000000 !important; }
              .receipt-border-dashed { border-bottom: 1.5px dashed #000000 !important; }
              .receipt-border-dotted { border-bottom: 1.5px dotted #000000 !important; }
            }
          `}} />

        {/* 🏬 STORE IDENTITY BANNER */}
        <div className="text-center space-y-0.5 receipt-border-dashed pb-3 mb-3">
          <h4 className="text-headline-md font-sans uppercase">{transactionData.businessName}</h4>
          <p className="text-label-md text-slate-700">{new Date(Date.now()).toLocaleString()}</p>
        </div>

        {/* 🧾 INVOICE META DETAILS */}
        <div className="space-y-0.5  text-[10px] receipt-border-dotted pb-3 mb-2">
          {/* <div className="flex justify-between"><span>Invoice:</span><span className="font-bold">#{transactionData.invoiceHash}</span></div> */}
          <div className="flex flex-row justify-between">
            <p className='text-slate-700 text-label-md font-sans'>SERVED BY:</p>
            <p className="font-black text-black uppercase">{transactionData.recordedBy}</p>
            </div>
          <div className="flex flex-row justify-between">
            <p className='text-slate-700 text-label-md font-sans mt-2'>SETTLEMENT:</p>
            <p className="font-bold text-black uppercase mt-2">{transactionData.channel}</p>
            </div>
        </div>

        {/* 🛒 ITEMISED TRANSACTION MATRIX */}
        <div className=" receipt-border-dashed border-black pb-2 mb-2">
          
          {/* 🎯 THE MATRIX HEADER FIX: Structured explicitly across 4 functional column slots */}
          <div className="grid grid-cols-12  text-[9px] font-black tracking-wider mb-2  receipt-border-dotted border-black/40 pb-1">
            <p className="col-span-6 text-left">Item</p>
            <p className="col-span-1 text-center">Qty</p>
            <p className="col-span-2 text-right">Price</p>
            <p className="col-span-3 text-right">Total</p>
          </div>
          
          {/* THE MATRIX ROW DATA GENERATOR LOOP */}
          <div className="space-y-1.5">
            {transactionData.items && transactionData.items.length > 0 ? (
              transactionData.items.map((item, idx) => (
                <div key={item.productId || idx} className="grid grid-cols-12 items-start text-[10px] gap-0.5">
                  
                  {/* Column 1: Item Name (Stretches cleanly across left panel grid) */}
                  <span className="col-span-6 text-[12px] font-semibold text-slate-900  truncate block tracking-tight text-left">
                    {item.productName}
                  </span>
                  
                  {/* Column 2: Quantity Tracker Integer */}
                  <span className="col-span-1 text-center font-mono font-medium">
                    {item.quantity}
                  </span>
                  
                  {/* Column 3: Unit Base Price Decimal (Wrapped in Number conversion) [S4] */}
                  <span className="col-span-2 text-right font-mono tracking-tighter">
                    {Number(item.unit_price).toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </span>
                  
                  {/* Column 4: Total Accumulated Price Decimal row [S4] */}
                  <span className="col-span-3 text-right font-black font-mono">
                    {Number(item.total_price).toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </span>

                </div>
              ))
            ) : (
              <div className="text-center font-bold text-slate-400 py-2 text-[9px] uppercase">
                No Line Items Recorded
              </div>
            )}
          </div>
        </div>

        {/* 🪙 TOTAL SUMMARY ZONE */}
        <div className="space-y-1 text-right text-[10px] font-bold  receipt-border-dashed pb-2 mb-2">
          <div className="flex flex-row justify-between text-label-md font-sans ">
            <p>TOTAL AMOUNT:</p>
            <p>₦{Number(transactionData.totalAmount).toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
            </div>
        </div>

        {/* 🎯 COMPLIANCE FOOTER SHIELD */}
        <div className="text-center text-[9px] pt-1 space-y-0.5  mt-8">
          <p className={`${is80mm?'text-label-md ':"uppercase"}`}>Thank You for Your Purchase!</p>
          <p className="font-bold tracking-widest text-[8px] pt-1">*** BAAZIO SaaS syatem  ***</p>
        </div>

      </div>
    </div>
  );
});

ThermalReceiptTemplate.displayName = "ThermalReceiptTemplate";
