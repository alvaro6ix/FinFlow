import React from 'react';
import { useUIStore } from '../../stores/uiStore';
import { Plus } from 'lucide-react'; 

const FloatingActionButton = () => {
  const { openQuickAddModal } = useUIStore();

  return (
    <button
      onClick={() => openQuickAddModal('expense')}
      className={`
        fixed z-[100] bottom-24 right-4 lg:bottom-10 lg:right-10 
        w-16 h-16 
        bg-[#FFD700] hover:bg-amber-500 
        text-[#1e1b4b] 
        rounded-full 
        shadow-[0_10px_40px_-10px_rgba(255,215,0,0.5)]
        border-4 border-white/20 backdrop-blur-md
        flex items-center justify-center 
        transition-all duration-300
        hover:scale-110 active:scale-95
        animate-in zoom-in duration-300
      `}
      aria-label="Agregar gasto rápido"
    >
      <Plus size={32} strokeWidth={3} />
    </button>
  );
};

export default FloatingActionButton;