import { create } from "zustand";

export const useAlertStore = create((set) => ({
  modalConfig: {
    isOpen: false,
    type: "danger",
    title: "",
    message: "",
    actionLabel: "Acknowledge"
  },
  
  // Directly invoked by your core Axios response interceptor lanes
  triggerGlobalAlert: (title, message, type = "danger") => set({
    modalConfig: { 
      isOpen: true, 
      type:type, 
      title: title, 
      message :message, 
      actionLabel: "Acknowledge" 
    }
  }),
  
  // Safely collapses your page-covering backdrop filters
  closeGlobalAlert: () => set((state) => ({
    modalConfig: { ...state.modalConfig, isOpen: false }
  }))
}));
