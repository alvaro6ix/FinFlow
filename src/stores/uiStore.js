import { create } from 'zustand';

const useUIStore = create((set) => ({
  // Sidebar
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  closeSidebar: () => set({ isSidebarOpen: false }),
  openSidebar: () => set({ isSidebarOpen: true }),

  // Modal de agregar gasto
  isExpenseModalOpen: false,
  openExpenseModal: () => set({ isExpenseModalOpen: true }),
  closeExpenseModal: () => set({ isExpenseModalOpen: false }),

  // Toast notifications
  toast: null,
  showToast: (message, type = 'info') => set({ toast: { message, type } }),
  hideToast: () => set({ toast: null }),

  // Loading global
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));

export { useUIStore };