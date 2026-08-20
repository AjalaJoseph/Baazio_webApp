import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom'; 
import api from '../api/axiosClient';
import { useAuthStore } from '../store/authStore';
export default function RecordSalesPage() {
  const searchTimeoutsRef = useRef({});
  const cartBottomAnchorRef = useRef(null);
  const navigate = useNavigate();
   const location = useLocation();
 const accessToken = useAuthStore((state) => state.accessToken);
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

  
  // 🧭 STATE CONTROL CAPSULES
  const [paymentMethod, setPaymentMethod] = useState("CASH"); 
  const [cartItems, setCartItems] = useState(() => {
    const historicalPayload = location.state?.items;
    if (historicalPayload && historicalPayload.length > 0) {
     
      return historicalPayload.map(item => ({
        rowId: item.rowId || Date.now() + Math.random(), 
        id: item.productId,
        productName: item.product_name,
        searchQuery: item.product_name, 
        unit_price: Number(item.unit_price) || 0,
        quantity: Number(item.quantity) || 1,
        showDropdown: false,
        dropdownStyle: null,
        errorMessage: "",
        filteredDropdownList: [] 
      }));
    }

    return [
      { rowId: Date.now(), 
        id: "", 
        productName: "", 
        searchQuery: "", 
        unit_price: 0, 
        quantity: 1, 
        showDropdown: false, 
        dropdownStyle: null, 
        errorMessage: "",
        filteredDropdownList: [] }
    ];
  });

  useEffect(() => {
    if (cartBottomAnchorRef.current) {
      cartBottomAnchorRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest'   
      });
    }
  }, [cartItems.length]);

  const totalTransactionValue = cartItems.reduce((acc, curr) => acc + (curr.unit_price * curr.quantity), 0);

const fetchProductsFromServer = async (rowId, queryText) => {
  try {
    const response = await api.get(`/terminal-product?search=${encodeURIComponent(queryText || "")}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    const apiResults = response.data?.data || [];
    setCartItems(prev => prev.map(item => 
      item.rowId === rowId ? { ...item, filteredDropdownList: apiResults } : item
    ));
  } catch (err) {
    console.error("❌ Terminal Search API Network Handshake Aborted:", err);
    setCartItems(prev => prev.map(item => 
      item.rowId === rowId ? { ...item, filteredDropdownList: [] } : item
    ));
  }
};

  const handleInputFocusChannel = async (e, item, index) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const hasWindow = typeof window !== 'undefined';
  const scrollYOffset = hasWindow ? window.scrollY : 0;
  
  // 📐 Geometric alignment flip parameters tracking table depth [S4]
  const isLowerRow = index >= 2;
  const calculatedTopPosition = isLowerRow 
    ? rect.top + scrollYOffset - 168   // 🚀 Opens Upwards above the row text line
    : rect.bottom + scrollYOffset + 4;  // 🛬 Opens Downwards below the row text line

  // 1. Immediately hydrate your active positioning metrics and show the search dropdown panels [S4]
  setCartItems(prev => prev.map(i => i.rowId === item.rowId ? { 
    ...i, 
    showDropdown: true,
    errorMessage: "",
    dropdownStyle: {
      position: 'fixed',
      top: `${calculatedTopPosition}px`,
      left: `${rect.left + (hasWindow ? window.scrollX : 0)}px`,
      width: `${rect.width}px`
    }
  } : i));

  // 2. Kill pending timeouts for this row block to prevent network race conditions
  if (searchTimeoutsRef.current[item.rowId]) {
    clearTimeout(searchTimeoutsRef.current[item.rowId]);
  }

  // 3. 📡 THE NETWORK HANDSHAKE: Pre-populate the portal with default inventory lines if input is blank 
  if (!item.searchQuery || item.searchQuery.trim() === "") {
    fetchProductsFromServer(item.rowId, "")
  }
};

const handleSearchInputChange = (e, item, index) => {
  const queryText = e.target.value;
  const rect = e.currentTarget.getBoundingClientRect();
  const hasWindow = typeof window !== 'undefined';
  const scrollYOffset = hasWindow ? window.scrollY : 0;
  
  // 📐 Spatial alignment flip calculations based on row table index depth 
  const isLowerRow = index >= 2;
  const calculatedTopPosition = isLowerRow 
    ? rect.top + scrollYOffset - 168 
    : rect.bottom + scrollYOffset + 4;

  // 1. Consolidated State Map Step: Update structural variables and geometry metrics together smoothly
  setCartItems(prev => prev.map(i => {
    if (i.rowId !== item.rowId){
      return i;
    }

    return { 
      ...i, 
      searchQuery: queryText,
      showDropdown: true,
      productName: queryText, 
      unit_price: queryText === "" ? 0 : i.unit_price,
      dropdownStyle: {
        position: 'fixed',
        top: `${calculatedTopPosition}px`,
        left: `${rect.left + (hasWindow ? window.scrollX : 0)}px`,
        width: `${rect.width}px`
      }
    };
  }));

  if (searchTimeoutsRef.current[item.rowId]) {
    clearTimeout(searchTimeoutsRef.current[item.rowId]);
  }

  if (queryText.trim() === "") {
    // If the input field is completely cleared out, load the default items instantly
    fetchProductsFromServer(item.rowId, "");
  } else {
    searchTimeoutsRef.current[item.rowId] = setTimeout(() => {
      // console.log(`📡 [Debounced API Search] Querying backend database rows matching: "${queryText}"`);
      fetchProductsFromServer(item.rowId, queryText);
    }, 300); // 300ms buffer delay threshold window
  }
};



  // 📝 HANDLER: SELECT PRODUCT OPTION FROM DROPDOWN
 const handleSelectProductFromList = (currentRowId, product) => {
   const targetNameNormalized = product.product_name.trim().toLowerCase();
  const duplicateItem = cartItems.find((item) => {
    
    if (item.rowId === currentRowId) {
      return false;
    }
    const matchesId = product.id && item.id === product.id;
    return matchesId ;
  });

  if (duplicateItem) {
    console.log(`♻️ POS Engine: "${product.product_name}" already exists in cart. Merging quantities...`);
    
   setCartItems((prev) =>
      prev.map((item) => {
        if (item.rowId !== currentRowId) return item;
        return {
          ...item,
          id: "",
          productName: "",
          searchQuery: "", // Clears the typed text out completely
          unit_price: 0,
          errorMessage: `⚠️ "${product.product_name.toUpperCase()}" is already in the cart.`,
          showDropdown: false 
        };
      })
    );
    
    return;
  }

  // 📋 STANDARD PATHWAY: If the item is entirely unique, update the row normally as before
  setCartItems((prev) =>
    prev.map((item) => {
      if (item.rowId !== currentRowId) return item;
      return {
        ...item,
        id: product.id,
        productName: product.product_name,
        searchQuery: product.product_name, 
        unit_price: Number(product.sellingPrice) || 0,
        showDropdown: false 
      };
    })
  );
};

const validateRowInputOnLeave = (currentItem, typedValue) => {
  const normalizedTypedValue = String(typedValue || "").trim().toLowerCase();
  
   if (normalizedTypedValue === "") {
    setTimeout(() => {
      setCartItems(prev => prev.map(i => i.rowId === currentItem.rowId ? { ...i, showDropdown: false } : i));
    }, 250);
    return;
  }
  const duplicateExists = cartItems.some((item) => {
    if (item.rowId === currentItem.rowId) {
      return false;
    }
    // Check both standard product names and raw search strings inside your cart array 
    const activeCartName = String(item.productName || item.searchQuery || "").trim().toLowerCase();
    return activeCartName !== "" && activeCartName === normalizedTypedValue;
  });

  if (duplicateExists) {
    // Wipe out the duplicate text and push your inline warning message [S4]
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.rowId !== currentItem.rowId) return item;
        return {
          ...item,
          id: "",
          productName: "",
          searchQuery: "", // Clears the input text field instantly
          unit_price: 0,
          errorMessage: `⚠️ "${typedValue.toUpperCase()}" has already been entered in this cart.`
        };
      })
    );
   
     setTimeout(() => {
    setCartItems(prev => prev.map(i => i.rowId === currentItem.rowId ? { ...i, showDropdown: false } : i));
  }, 250);
  }
};

  // 📝 HANDLER: STEPPER QUANTITY ALTERATION LOOPS
  const handleUpdateQuantity = (rowId, incrementAmount) => {
    setCartItems(prev => prev.map(item => {
      if (item.rowId !== rowId) return item;
      const nextQuantity = item.quantity + incrementAmount;
      return { ...item, quantity: nextQuantity < 1 ? 1 : nextQuantity };
    }));
  };

  // 📝 HANDLER: EVICT PRODUCT FROM ACTIVE BASKET
  const handleRemoveItemFromCart = (rowId) => {
    setCartItems(prev => prev.filter(item => item.rowId !== rowId));
  };

  // 📝 HANDLER: APPEND NEW BASKET ROW TEMPLATE LINK
 const handleAppendBlankItemRow = () => {
  setCartItems(prev => [
    ...prev,
    { 
      rowId: Date.now(), 
      id: "", 
      productName: "", 
      searchQuery: "", 
      unit_price: 0, 
      quantity: 1, 
      showDropdown: false, 
      dropdownStyle: null,
      errorMessage: "",
      filteredDropdownList: [] 
    }
  ]);
};


  const handleProceedToCheckoutReview = () => {
  if (cartItems.length === 0 || cartItems.some(item => !item.productName)) {
    return;
  }

  navigate("/staff-dashboard/checkout-review", {
    state: {
       items: cartItems.map(item => ({
        rowId: item.rowId, 
        productId: item.id,
        product_name: item.productName,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.unit_price * item.quantity
      })),
      paymentMethod: paymentMethod, // e.g., "CASH DRAWER" | "CARD"
      totalAmount: totalTransactionValue
    }
  });
};

  return (
    <div className="w-full min-h-screen flex flex-col gap-2 text-left select-none  font-sans pb-12 bg-[#f8fafc] ">
      
      {/* 📁 UPPER STATUS TRACKER ROADMAP HEADER */}
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
     

      <div className='w-full flex-1 bg-[#f8fafc] px-6 pt-5 flex flex-col gap-6'>
  
      <div className="space-y-1">
        <h1 className="text-lg font-bold text-on-surface tracking-wider">Record Customer Transaction Cart</h1>
        <p className="text-body-md text-slate-400  leading-normal">Input or select multiple product items for a single customer checkout session before proceeding to review.</p>
      </div>

      {/* ========================================================================= */}
      {/* 📦 PRIMARY TRANSACTION FORM CONTAINER CANVAS */}
      {/* ========================================================================= */}
      {/* 🎯 Parent layout frame shell box - marked as overflow-visible so popups can float outside it */}
        <div className="w-full bg-surface-lowest border border-slate-300 rounded-md shadow-xs ">
                
                {/* SECTION A: PAYMENT METHOD SELECTOR BAR ELEMENT */}
                <div className="p-5 border-b border-slate-100 space-y-3 bg-surface-lowest rounded-t-md relative z-10">
                  <label className="text-label-lg uppercase tracking-widerst text-slate-500 font-sans mb-3 block">Select Global Payment Method</label>
                <div className="inline-flex max-w-full items-center gap-1 rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm overflow-x-auto select-none">

                {/* CASH */}
                <button
                type="button"
                onClick={() => setPaymentMethod("CASH")}
                className={`
                flex h-10 shrink-0 items-center gap-2 rounded-lg px-4
                text-sm font-semibold whitespace-nowrap
                transition-all duration-200 cursor-pointer
                ${
                paymentMethod === "CASH"
                ? "bg-primary text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }
                `}
                >
                <svg
                className="h-4 w-4 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                >
                <rect x="3" y="6" width="18" height="12" rx="2" />
                <circle cx="12" cy="12" r="3" />
                <path
                strokeLinecap="round"
                d="M7 9h.01M17 15h.01"
                />
                </svg>

                <span>Cash</span>
                </button>


                {/* POS */}
                <button
                type="button"
                onClick={() => setPaymentMethod("CARD")}
                className={`
                flex h-10 shrink-0 items-center gap-2 rounded-lg px-4
                text-sm font-semibold whitespace-nowrap
                transition-all duration-200 cursor-pointer
                ${
                paymentMethod === "CARD"
                ? "bg-primary text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }
                `}
                >
                <svg
                className="h-4 w-4 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path strokeLinecap="round" d="M3 10h18" />
                <path
                strokeLinecap="round"
                d="M7 15h3"
                />
                </svg>

                <span>POS</span>
                </button>


                {/* TRANSFER */}
                <button
                type="button"
                onClick={() => setPaymentMethod("TRANSFER")}
                className={`
                flex h-10 shrink-0 items-center gap-2 rounded-lg px-4
                text-sm font-semibold whitespace-nowrap
                transition-all duration-200 cursor-pointer
                ${
                paymentMethod === "TRANSFER"
                ? "bg-primary text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }
                `}
                >
                <svg
                className="h-4 w-4 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                >
                <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 7h16M4 7l4-4M4 7l4 4M20 17H4m16 0l-4-4m4 4l-4 4"
                />
                </svg>

                <span>Transfer</span>
                </button>

                </div>
                </div>

                
               <div className="w-full bg-surface-lowest overflow-x-auto max-h-64  scrollbar-thin scrollbar-thumb-slate-200 select-none">
                  <table className="w-full text-xs text-left border-collapse min-w-187.5 overflow-visible table-fixed">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-300 text-[13px] font-semibold  tracking-tight text-slate-700 select-none sticky top-0 z-40">
                        <th className="p-4 font-bold text-center w-12">#</th>
                        <th className="p-4 w-[40%]">Product Item Name</th>
                        <th className="p-4 text-center">Unit Price</th>
                        <th className="p-4 text-center w-36">Qty</th>
                        <th className="p-4 text-right">Subtotal</th>
                        <th className="p-4 text-center w-20">Action</th>
                      </tr>
                    </thead>
                    
                    <tbody className="divide-y divide-slate-200 bg-surface-lowest">  
                    {cartItems.map((item, index) => {
                        
                      return (
                        <tr 
                          key={item.rowId} 
                          className="hover:bg-slate-50/10 transition-colors  w-full overflow-visible max-h-60"
                        >
                          {/* Index Sequence Counter Cell */}
                          <td className="p-4 font-bold text-slate-600 text-sm text-center font-mono select-none w-12">
                            {index + 1}
                          </td>

                          {/* 🎯 FLOATING DROPDOWN PORTAL CAPSULE LAYER */}
                          <td className="p-4 relative overflow-visible w-[40%]">
                            <div className="flex flex-col gap-0.5 w-full text-left relative overflow-visible">
                              <input
                                type="text"
                                value={item.productName || item.searchQuery}
                                onFocus={(e) => handleInputFocusChannel(e, item, index)}
                                onBlur={(e) => validateRowInputOnLeave(item, e.target.value)}
                                onChange={(e) => handleSearchInputChange(e,item, index)}
                                placeholder="Type to search product item name..."
                                className="w-full h-10 px-3 border border-slate-300 rounded-md text-body-md text-slate-700 bg-slate-50/30 placeholder:text-slate-400 focus:outline-none focus:border-primary transition-all shadow-sm"
                              />
                              {item.errorMessage && (
                                <span className="text-body-sm font-bold text-error mt-1 block select-none animate-fadeIn">
                                {item.errorMessage}
                                </span>
                              )}
                              {item.showDropdown && item.filteredDropdownList.length > 0  && (
                              createPortal(
                                <div 
                                  style={item.dropdownStyle || { display: 'none' }}
                                  className="bg-white border border-slate-400 rounded-md shadow-2xl z-9999 max-h-40 overflow-y-auto divide-y divide-slate-300 animate-fadeIn scrollbar-thin scrollbar-thumb-slate-200 text-left flex flex-col"
                                >
                                  <div className="w-full flex flex-row justify-between px-5 py-2 bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-400 select-none sticky top-0 z-20">
                                      <span>Product Name</span>
                                      <span>Stock</span>
                                  </div>
                                    {item.filteredDropdownList.map((product) => (
                                    <button
                                      key={product.id}
                                      type="button"
                                      onMouseDown={() => handleSelectProductFromList(item.rowId, product)}
                                      className="w-full text-left flex flex-row justify-between px-5 py-2.5 hover:bg-slate-50 transition-colors cursor-pointer border-none bg-transparent "
                                    >
                                      <p className="text-xs font-bold text-slate-700 m-0">{product.product_name}</p>
                                      <p className="text-xs font-bold text-slate-700 m-0">{product.stockCount}</p>
                                    </button>
                                  ))}
                                </div>,
                                document.body 
                              )
                              )}
                            </div>
                          </td>

                        {/* 🏷️ EDITABLE UNIT PRICE INPUT COLUMN CELL */}
                          <td className="p-3 sm:p-4 w-36 min-w-36">
                          <div className="shadow-sm flex items-center h-10 w-full border border-slate-300 rounded-md bg-slate-50/30 overflow-hidden">
                            <p className="px-2 text-slate-400 font-mono font-bold text-xs shrink-0">
                              ₦
                            </p>

                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={item.unit_price || ""}
                              onChange={(e) => {
                                const rawValue = e.target.value;
                                const updatedPrice =
                                  rawValue === "" ? 0 : parseFloat(rawValue);

                                setCartItems((prev) =>
                                  prev.map((i) =>
                                    i.rowId === item.rowId
                                      ? { ...i, unit_price: updatedPrice }
                                      : i
                                  )
                                );
                              }}
                              placeholder="0.00"
                              className="w-full min-w-0 h-full px-1 pr-2 border-0 bg-transparent text-right  font-mono text-label-md text-on-surface  focus:outline-none focus:border-primary   [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                          </div>
                        </td>


                          <td className="p-4 w-36">
                            <div className="flex items-center justify-center border border-slate-200 rounded-md bg-surface-low w-max h-9 mx-auto p-1 shadow-sm select-none">
                              <button type="button" onClick={() => handleUpdateQuantity(item.rowId, -1)} className="w-8 h-8 bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 rounded-lg font-bold text-sm cursor-pointer flex items-center justify-center focus:outline-none">-</button>
                              <span className="w-9  text-label-md font-black text-on-surface text-center font-mono">{item.quantity}</span>
                              <button type="button" onClick={() => handleUpdateQuantity(item.rowId, 1)} className="w-8 h-8 bg-white hover:bg-slate-50 border border-slate-100 hover:border-slate-200 text-slate-500 rounded-lg font-bold text-sm cursor-pointer flex items-center justify-center focus:outline-none">+</button>
                            </div>
                          </td>

                          <td className="p-4 ">
                            <p className='text-body-md text-secondary text-right select-none'>
                              ₦{(item.unit_price * item.quantity).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                            </p>
                          </td>

                          <td className="p-4 text-center w-20">
                            <button
                              type="button"
                              disabled={cartItems.length <= 1}
                              onClick={() => handleRemoveItemFromCart(item.rowId)}
                              className="p-2 border border-slate-300 hover:border-error text-slate-400 hover:text-error hover:bg-red-50 rounded-lg transition-all cursor-pointer disabled:cursor-not-allowed flex items-center justify-center mx-auto focus:outline-none"
                            >
                              <svg className="w-4 h-4 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </td>
                        </tr>
                      );
                })}
                </tbody>

                  </table>
                   <div ref={cartBottomAnchorRef} className="h-0 w-full overflow-hidden clear-both" />
                </div>
                {/* SECTION C: APPEND NEW CART DATA ROW INTERACTION LINE BUTTON */}
                <div className="p-4 bg-surface-lowest text-center rounded-b-md border-t border-slate-100 relative z-10">
                  <button
                    type="button"
                    onClick={handleAppendBlankItemRow}
                    className="w-full h-11 border border-dashed border-primary hover:border-blue-400 hover:text-blue-600 rounded-md transition-all bg-white tracking-wider flex items-center justify-center gap-2 cursor-pointer focus:outline-none hover:bg-blue-50/10"
                  >
                    <p className='text-secondary font-sans text-label-md md:text-label-lg lg:text-label-lg m-0'>Append Another Item to Customer Cart</p>
                  </button>
                </div>
        </div>


      {/* ========================================================================= */}
      {/* 🪙 BOTTOM FINANCIAL VALUATION SUMMARY ACTION BAR */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 bg-surface-low border border-slate-300 rounded-md p-5 shadow-xs text-left w-full">
        <div className="space-y-1.5 select-none">
          <span className="text-body-lg sm:text-body-sm uppercase tracking-wider text-slate-400 block">Total Transaction </span>
          <div className="flex items-center ">
            <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
              ₦{totalTransactionValue.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
            </span>
           
          </div>
        </div>

        <button
          type="button"
          onClick={handleProceedToCheckoutReview}
          className="w-full sm:w-auto h-11 min-h-11 bg-primary hover:bg-blue-700 active:scale-[0.99] text-white px-6 rounded-lg transition-all shadow-md shadow-blue-100 flex items-center justify-center gap-2 cursor-pointer text-label-md  tracking-wider shrink-0 border-none"
        >
          <span>Proceed to Checkout</span>
          <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </button>
      </div>
                  
    </div>
    </div>
  );
}