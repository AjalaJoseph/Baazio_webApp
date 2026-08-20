import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosClient';
import EditProductModal from '../components/editProduct';
import { useAuthStore } from '../store/authStore';
import AlertModal from '../components/alert';
export default function ViewproductsPage() {
  // 🧭 STATE MATRIX CONTROLLERS
  const [products, setProducts] = useState([]);
    const accessToken = useAuthStore((state) => state.accessToken);
    const setAuthSession = useAuthStore((state) => state.setAuthSession);
  const [searchTyped, setSearchTyped] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5)
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
   const [alertConfig, setAlertConfig] = useState({ isOpen: false, type: "success", title: "", message: "", actionLabel: "", onAction: () => {} });
    const triggerAlert = (config) => setAlertConfig({ ...config, isOpen: true });
    const closeAlert = () => setAlertConfig((prev) => ({ ...prev, isOpen: false }));
const navigate = useNavigate()
  // ⏱️ DEBOUNCE EFFECT FILTER: Restricts network execution thread overheads while user types
        useEffect(() => {
            const typingTimer = setTimeout(() => {
            setSearchDebounced(searchTyped);
            setPage(1); 
            }, 400);
            return () => clearTimeout(typingTimer);
        }, [searchTyped]);

  useEffect(() =>{
    const fetchProduct = async () =>{
        setIsLoading(true)
         let currentToken = accessToken;
                
        // 2. CHECK IF REFRESH IS NEEDED: If Zustand token is null/empty, trigger rotation
        if (!currentToken) {
            try {
            const response = await api.post('/auth/refresh-token',{}, {
                withCredentials: true 
            });
            currentToken = response.data.accessToken; 
            setAuthSession(currentToken)
            } catch (refreshErr) {
            console.error("Session expired. Please log in again.", refreshErr);
            return; // Halt execution if refresh fails
            }
        }
    
        if (!currentToken) {
            return;
        }
        
        try{
            const response = await api.get(`/products?page=${page}&limit=${limit}&search=${searchDebounced}`,
                { headers: { Authorization: `Bearer ${currentToken}` } })
            setProducts(response.data.data)
            setPagination(response.data.pagination)
            // console.log(response.data.pagination)
        }catch(err){
            console.log(err)
        }finally {
        setIsLoading(false);
      }
    }
    fetchProduct()
  },[accessToken, searchDebounced, page])
//   console.log(searchDebounced)
  // ACTION TRAGETS LOGGING
  const handleEditClick = (productItem) => {
    setSelectedProduct(productItem); // Capture the target row item object in state memory
    setIsEditModalOpen(true);        // Mount the modal canvas immediately
  };
  const handleUpdateSuccess = (updatedFields) => {
    console.log(updatedFields)
    setProducts((prevList) =>
      prevList.map((item) =>
        item.id === updatedFields.id 
          ? { 
              ...item, 
              product_name: updatedFields.product_name, 
              sellingPrice: updatedFields.sellingPrice, 
              stockCount: updatedFields.stockCount 
            } 
          : item
      )
    );
  };
  const handleDeleteProduct = async (product_id, product_name) =>{
     triggerAlert({
      type: "danger",
      title: "Permanently Delete Product?",
    message: (
      <span>
        This will permanently drop the inventory registry record for{" "}
        <strong className="text-secondary font-black font-sans">
          {product_name}
        </strong>
        . This stock profile will instantly become unavailable for checkouts across all cashier terminal register instances.
      </span>
    ),
      actionLabel: "Permanently Delete",
      onClose: closeAlert,
      onAction: () => executeDeleteRequest(product_id) // Forwards call to the actual execution pipeline
    });
  }
  const executeDeleteRequest = async (product_id) =>{
    closeAlert()
    try{
      const response = await api.delete(`/products/${product_id}/delete`, { headers: { Authorization: `Bearer ${accessToken}` } })
     if(response.data.status === "succes" ||response.status === 200 ){
      setProducts((prevList) => prevList.filter((item) => item.id !== product_id));
       setTimeout(() => {
        triggerAlert({
          type: "success",
          title: "Product Deleted Successfully",
          message: "The product item and all its associated batch parameters have been cleanly wiped from the master stock database catalog ledger.",
          actionLabel: "Return to Product List",
          onAction: closeAlert,
          onClose: closeAlert
        });
      }, 150);
     }
      } catch (err) {
      console.error("Product deletion sequence exception intercepted:", err);
      const statusCode = err.response?.status
      const errorMessage = err.response?.data?.message
      if(statusCode === 403){
        setTimeout(() => {
            triggerAlert({
              type: "danger",
              title: "Deletion Dropped",
              message: errorMessage,
              actionLabel: "Dismiss Warning",
              onAction: closeAlert,
              onClose: closeAlert
            });
          }, 150)
      }
      else if (statusCode === 500){
        window.location.href = "/server-error"
      }else{
        setTimeout(() => {
          triggerAlert({
            type: "danger",
            title: "Network Error Intercepted",
            message: errorMessage || "Unable to complete transaction. The database connection timed out or the record was not found.",
            actionLabel: "Dismiss Warning",
            onAction: closeAlert,
            onClose: closeAlert
          });
        }, 150)
      }
      
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col gap-2 text-left select-none  font-sans pb-12 bg-[#f8fafc] ">
       <div className="w-full bg-surface-lowest flex px-6 pt-3  sm:flex-row items-start sm:items-center justify-between   gap-4 border-b border-slate-400 pb-2">
        <h1 className="text-label-lg text-on-surface  font-sans">View / Edit Stock</h1>
        <div className="w-full max-w-lg relative flex items-center shadow-xs group animate-fadeIn">
        {/* 🔍 Left Element: Clean Vector Search Magnifying Glass Icon Anchor */}
        <span className="absolute left-4 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none">
        <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        </span>

        {/* 🖥️ Input Interface: Soft muted tint layout matching your exact preview capsule */}
        <input 
        type="text"
        value={searchTyped} // Binds directly to your active typing state variable hook
        onChange={(e) => setSearchTyped(e.target.value)}
        placeholder="Search registry..."
        className="w-full h-11 pl-11 pr-4 border border-slate-300 bg-surface-low hover:bg-slate-50 focus:bg-white text-sm font-semibold text-slate-800 placeholder-slate-400 rounded-full focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
        />
        </div>
      </div>
      {/* 📋 PAGE TOP ACTIONS BAR CONTROLS SECTION */}
       <div className='w-full flex-1 bg-[#f8fafc] px-6 py-6 flex flex-col gap-6'>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-left">
          <h2 className="text-headline-md font-sans text-on-surface tracking-tight">View Product List</h2>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold mt-1">
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className='text-slate-700 text-body-md font-sans'>{pagination.totalProducts} total items tracked in inventory</span>
          </div>
        </div>

        {/* Top Filter and Addition Action Coupling Anchors */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <button className="h-9 px-4 border border-slate-400 hover:bg-slate-50 bg-surface-lowest text-slate-700 text-label-md font-bold rounded-sm transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs">
            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter
          </button>
          <button onClick={() =>navigate("/admin-dashboard/add-inventory")} className="h-9 px-5 bg-primary-container hover:bg-primary text-white text-label-md  rounded-sm transition-all cursor-pointer flex items-center gap-1.5 shadow-sm shadow-blue-100">
            <svg className="w-3.5 h-3.5 stroke-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add New
          </button>
        </div>
      </div>

      {/* 🗃️ PRIMARY REGISTRY CENTRAL CARD CANVAS CONTAINER */}
      <div className="w-full bg-surface-lowest border border-slate-400 rounded-md shadow-xs overflow-hidden">
        
        {/* Registry Table Header Banner Identity Row */}
        <div className="p-4 px-6 border-b border-slate-400 flex items-center justify-center bg-surface-low">
          <h3 className="text-on-surface text-label-md  uppercase tracking-widest font-sans">
            Central Stock Registry & Analytics Hub
          </h3>
        </div>

        {/* 📱 HORIZONTAL RESPONSIVE SWEEP LAYOUT WRAPPER WINDOW CONTAINER */}
        <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
          <table className="w-full min-w-212.5 text-left border-collapse table-fixed">
            
            {/* COLUMN LAYOUT HEADINGS SCHEMA METRICS */}
            <thead>
              <tr className="border-b border-slate-300 text-slate-400 text-label-md  uppercase bg-surface-bright font-sans">
                {/* <th className="p-4 pl-6 w-32">Product ID</th> */}
                <th className="p-4 w-64">Product Name</th>
                <th className="p-4 w-44">Selling Price</th>
                <th className="p-4 w-44">In-Stock Qty</th>
                <th className="p-4 w-36">Units Sold</th>
                <th className="p-4 pr-6 w-36 text-center">Actions</th>
              </tr>
            </thead>

            {/* LIVE INVENTORY DATA POPULATION DATA STREAM */}
            <tbody className="divide-y divide-slate-300">
                { products.length === 0?(
                    <tr>
                    <td colSpan={6} className="p-12 text-center animate-fadeIn bg-white">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">

                    {/* Muted Gray Box Cube Vector Anchor Graphic */}
                    <div className="w-14 h-14 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 mb-4 shadow-2xs">
                    <svg className="w-6 h-6 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    </div>

                    {/* Heading context feedback title info */}
                    <h4 className="text-slate-800 text-headline-md font-black tracking-tight">
                    {searchDebounced ? "No Matching Products Found" : "Your Stock Registry is Empty"}
                    </h4>

                    {/* Descriptive helper text details label rows */}
                    <p className="text-slate-400 text-xs font-medium leading-relaxed mt-1">
                    {searchDebounced 
                    ? `We couldn't find any inventory rows matching "${searchDebounced}". Double check your spelling or clear the filters.`
                    : "You haven't provisioned any product profiles yet. Upload an Excel batch sheet or add manual lines to launch your catalog database."
                    }
                    </p>

                    {/* Contextual Action Button to clear search if active */}
                    {searchDebounced && (
                    <button 
                    type="button"
                    onClick={() => { setSearchTyped(""); setSearchDebounced(""); }}
                    className="mt-4 px-3 h-8 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                    >
                    Clear Search Query
                    </button>
                    )}

                    </div>
                    </td>
                    </tr>
                ):(
                products.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                  
                  {/* 1. Code Token Link cell */}
                  {/* <td className="p-4 pl-6 font-mono text-xs text-blue-600 font-bold select-all tracking-tight">
                    {item.id}
                  </td> */}

                  {/* 2. String Title name cell */}
                  <td className="p-4 text-[18px] font-sans text-on-surface tracking-tight leading-snug">
                    {item.product_name}
                  </td>

                  {/* 3. Numerical localized Currency cell */}
                  <td className="p-4 text-body-md font-mono  text-on-surface">
                    ₦{item.sellingPrice.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                  </td>

                  {/* 4. Active Quantity capacity metrics layer with indicator check flags */}
                  <td className="p-4 text-body-md font-mono  text-slate-800">
                    {item.stockCount}{" "}
                    <span className="text-sm font-medium text-slate-600 font-sans tracking-wide">units</span>
                  </td>

                  {/* 5. Volumetric Units Sold history tracker column */}
                  <td className="p-4 text-body-md font-mono  text-slate-400">
                    null
                  </td>

                  {/* 6. Form Operations Utility controllers coupling block */}
                  <td className="p-4 pr-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      
                      {/* Active Edit Pencil action capsule trigger */}
                      <button 
                        onClick={() => handleEditClick(item)}
                        className="h-8 px-3 border border-slate-300 hover:bg-slate-50 bg-surfacce-lowest text-primary font-bold rounded-sm text-body-md transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                      >
                        <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Edit
                      </button>

                      {/* Drop account trash file wipe trigger */}
                      <button 
                        onClick={() => handleDeleteProduct(item.id, item.product_name)}
                        className="p-1.5 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                        title="Delete product entry"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>

                    </div>
                  </td>

                </tr>
              ))
            )
        }
            </tbody>
          </table>
        </div>

               {/* 📑 PAGINATION NAVIGATION FOOTER ACTION CONTROL ROW BAR */}
        <div className="p-3 sm:p-4 px-3 sm:px-6 bg-surface-low border rounded-md border-slate-300 flex items-center justify-between gap-2 sm:gap-4 select-none">
        {/* Previous Page */}
        <button
            type="button"
            disabled={page === 1 || isLoading}
            onClick={() => setPage(p => Math.max(1, p - 1))}
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
                : ((page - 1) * Number(pagination.limit)) + 1}
                {" - "}
                {Math.min(page * Number(pagination.limit),
                Number(pagination.totalProducts)
                )}{" "}
                of {Number(pagination.totalProducts)}{" "}
                <span className=" ">
                total Items
                </span>
            </span>
            </p>

        </div>


        {/* Next Page */}
        <button
            type="button"
            disabled={pagination.hasNextPage === false || isLoading}
            onClick={() => setPage(p => p + 1)}
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
      <EditProductModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={selectedProduct}
        onEditSuccess={handleUpdateSuccess}
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
