import React, { useState } from 'react';
import { useUIStore } from '../../stores/uiStore';
import { SYSTEM_CATEGORIES } from '../../constants/categories';
import { useExpenseStore } from '../../stores/expenseStore';
import { useAuthStore } from '../../stores/authStore';

const FloatingActionButton = () => {
  const { openQuickAddModal } = useUIStore();

  return (
    <button
      onClick={() => openQuickAddModal('expense')}
      className="fixed bottom-24 lg:bottom-8 right-6 w-16 h-16 bg-primary-500 text-white rounded-full shadow-2xl flex items-center justify-center text-3xl hover:bg-primary-600 transition-transform active:scale-90 z-40 animate-bounce"
      aria-label="Agregar gasto rápido"
    >
      <span>＋</span>
    </button>
  );
};

export default FloatingActionButton;