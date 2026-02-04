import { create } from 'zustand';

export const useUIStore = create((set) => ({
  isQuickAddModalOpen: false,
  editingExpense: null,

  // Para crear un gasto nuevo desde cero
  openQuickAddModal: () =>
    set({ isQuickAddModalOpen: true, editingExpense: null }),

  // Para abrir el modal con la información de un gasto existente
  openEditExpenseModal: (expense) => 
    set({ isQuickAddModalOpen: true, editingExpense: expense }),

  closeQuickAddModal: () =>
    set({ isQuickAddModalOpen: false, editingExpense: null }),
}));