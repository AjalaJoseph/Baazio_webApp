import React, { useState, useEffect } from 'react';
import api from '../api/axiosClient';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
export default function EditProductModal({ isOpen, onClose, product, onEditSuccess }) {
  const [formData, setFormData] = useState({ product_name: '', selling_price: 0, quantity: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [modalError, setModalError] = useState("");
  const accessToken = useAuthStore((state) => state.accessToken);
  const navigate = useNavigate()
  // 🔄 HYDRATION ENGINE EFFECT: Pre-populates the input fields cleanly when the modal canvas opens
  useEffect(() => {
    if (isOpen && product) {
      setFormData({
        product_name: product.product_name || '',
        selling_price: parseFloat(product.sellingPrice) || 0,
        quantity: parseInt(product.stockCount) || 0
      });
      setModalError("");
      setIsSuccess(false);
    }
  }, [isOpen, product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalError("");

    const trimmedName = formData.product_name.trim();
    const parsedPrice = parseFloat(formData.selling_price) || 0;
    const parsedQty = parseInt(formData.quantity) || 0;

    // 🛡️ FRONTEND CLIENT-SIDE DATA SANITIZATION CONTRACTS
    if (!trimmedName) {
      setModalError("Product Name cannot be left blank.");
      return;
    }
    if (parsedPrice <= 0) {
      setModalError("Selling Price must be a valid amount greater than ₦0.00.");
      return;
    }
    if (parsedQty < 0) {
      setModalError("Inventory Quantity cannot be a negative value.");
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const response = await api.patch(`/products/${product.id}/edit`,
        {
          product_name:trimmedName,
          sellingPrice:parsedPrice,
          quantity:parsedQty
        },
        { headers: { Authorization: `Bearer ${accessToken}` } })
      if (response.data.status === "success" || response.status === 200) {
      if (onEditSuccess) {
        onEditSuccess({
          id: product.id,
          product_name: trimmedName,
          sellingPrice: parsedPrice,
          stockCount: parsedQty
        });
      }
    }
      setIsSuccess(true);
    } catch (err) {
      console.error("Failed to write updated inventory parameter logs:", err);
      const statusCode = err.response?.status;
    const backendMessage = err.response?.data?.message;
       if (statusCode && statusCode !== 500) {
      setModalError(backendMessage || `Request rejected with code ${statusCode}. Please check your parameters.`);
    } else if (statusCode === 500) {
       window.location.href = "/server-error";
    } else {
       setModalError("Network Timeout Error: Unable to reach the server. Please verify your connection.");
    }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      
      {/* 📱 1. BACKDROP BLUR MASK LAYER OVERLAY */}
      <div 
        onClick={isSubmitting ? null : onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 ease-in-out animate-fadeIn"
      />

      {/* 🖥️ 2. CENTERED CONFIGURATION CANVAS WINDOW */}
      <div className="w-full max-w-md bg-surface-lowest border border-slate-300 rounded-lg shadow-xl z-50 flex flex-col overflow-hidden transition-all duration-300 transform scale-100 max-h-[90vh]">
        
        {/* CLOSE ACTION FLOATING CROSS BUTTON */}
        {!isSubmitting && (
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <svg className="w-5 h-5 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {!isSuccess ? (
          <>
            {/* HEADLINE TITLE TOP SECTION BAR */}
            <div className="p-6 pb-4 border-b border-slate-300 text-left bg-surface-lowest">
              <h3 className="font-sans text-on-surface text-2xl font-semibold tracking-tight">
                Modify Product Specifications
              </h3>
              <p className="text-body-sm text-slate-400 mt-0.5 font-medium">
                Update core data profiles and adjust live terminal catalog parameters for{" "}
                <span className="font-mono text-blue-600 font-bold select-all">{product.product_name}</span>
              </p>
            </div>

            {/* ERROR BANNER SLIP: Renders inside modal bounds seamlessly if validation misses */}
            {modalError && (
              <div className="mx-6 mt-4 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-start gap-2 text-left animate-scaleUp">
                <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="leading-normal">{modalError}</span>
              </div>
            )}

            {/* CONTROL INPUTS VIEWPORT CORE */}
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 text-left overflow-y-auto">
              
              {/* Field A: Product Title String Field Input */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="edit-prod-name" className="text-label-md  tracking-widest text-slate-700 font-sans">
                  Product Name
                </label>
                <input
                  id="edit-prod-name"
                  type="text"
                  name="product_name"
                  required
                  value={formData.product_name|| "" }
                  onChange={handleChange}
                  placeholder="e.g., Whole Wheat Sourdough"
                  className="w-full h-10 px-3 border border-slate-300 rounded-md mt-1 text-label-md text-slate-700 placeholder-slate-300 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-semibold"
                />
              </div>

              {/* Field B: Selling Price Numerical Currency Block */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="edit-prod-price" className="text-label-md  tracking-widest text-slate-700 font-sans">
                  Selling Price
                </label>
                <div className="relative flex items-center justify-end w-full">
                  <span className="absolute left-3.5 text-sm text-slate-400 font-black pointer-events-none">₦</span>
                  <input
                    id="edit-prod-price"
                    type="number"
                    name="selling_price"
                    step="0.01"
                    min="0"
                    required
                    value={formData.selling_price || ''}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full h-10 pl-8 pr-4 border border-slate-300 rounded-md text-label-md mt-1 text-slate-800 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                  />
                </div>
              </div>

              {/* Field C: In Stock Quantity Level Selector Counter */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="edit-prod-qty" className="text-label-md  tracking-widest text-slate-700 font-sans">
                  Quantity
                </label>
                <input
                  id="edit-prod-qty"
                  type="number"
                  name="quantity"
                  min="0"
                  required
                  value={formData.quantity !== undefined ? formData.quantity : ''}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full h-10 px-4 border border-slate-300 rounded-md mt-1 text-label-md  text-slate-800 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                />
              </div>

            </form>

            {/* ACTION CONTROLS FOOTER RETANGLE LAYOUT */}
            <div className="p-4 bg-surface-high border-t border-slate-400 flex items-center justify-end gap-2.5">
              <button 
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 h-9 border bg-error border-error hover:bg-slate-100 rounded-lg text-xs font-bold text-surface-lowest transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.product_name}
                className="px-5 h-10 bg-primary-container hover:bg-primary disabled:bg-slate-300 text-surface-lowest rounded-lg text-xs font-bold shadow-sm shadow-blue-100 transition-all cursor-pointer disabled:cursor-not-allowed disabled:text-slate-500"
              >
                {isSubmitting ? "Saving Matrix..." : "Save Product Adjustments"}
              </button>
            </div>
          </>
        ) : (
          /* 🎉 PRO-UX SUCCESS CONFIRMATION VIEW SCREEN CONTEXT */
          <div className="p-8 flex flex-col items-center justify-center text-center animate-scaleUp">
            
            {/* Animated Success Ring Vector Asset */}
           <div className="w-16 h-16 bg-blue-50 border-4 border-blue-100 rounded-full flex items-center justify-center text-blue-500 mb-5 shadow-inner shrink-0">
    {/* ✅ THE FIX: Added the clean vector checkmark paths and safely closed the SVG tag */}
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            </div>

            {/* Confirmation Sub-Branding Heading */}
            <h4 className="text-on-surface text-headline-md  tracking-tight">
                Product Updated!
            </h4>
            
            {/* ✅ THE FIX: Paragraph text now sits safely in its own clean layout slot beneath the icon */}
            <p className="text-slate-600 text-body-sm leading-relaxed max-w-xs mt-1.5 font-medium">
                Inventory specifications matching <strong className="text-slate-800 font-mono font-bold select-all bg-slate-50 px-1.5 py-0.5 border border-slate-100 rounded-md">{product.product_name}</strong> have been re-indexed. Fresh parameters are now live across all counter POS instances.
            </p>


            {/* Clear Primary Action Gate Return Button */}
            <button 
              type="button"
              onClick={onClose}
              className="mt-6 w-full max-w-xs h-11 bg-secondary hover:bg-primary-container text-white rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              Return to Registry List
            </button>

          </div>
         )}
        </div>
     
    </div>
  );
}
