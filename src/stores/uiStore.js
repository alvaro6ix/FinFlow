import { create } from 'zustand';

export const useUIStore = create((set) => ({
  isQuickAddModalOpen: false,
  modalType: null, // 'expense' | 'income'
  
  openQuickAddModal: (type = 'expense') => set({ 
    isQuickAddModalOpen: true, 
    modalType: type 
  }),
  
  closeQuickAddModal: () => set({ 
    isQuickAddModalOpen: false, 
    modalType: null 
  }),
}));