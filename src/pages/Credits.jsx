import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useCreditStore } from '../stores/creditStore';
import CreditWallet from '../components/credits/CreditWallet';
import AddCardModal from '../components/credits/AddCardModal';
import EditCardModal from '../components/credits/EditCardModal';
import AddInstallmentModal from '../components/credits/AddInstallmentModal';
import InstallmentList from '../components/credits/InstallmentList';
import DebtHealthWidget from '../components/credits/DebtHealthWidget'; // ✅ NUEVO
import FreedomTimeline from '../components/credits/FreedomTimeline';   // ✅ NUEVO
import { Loader2, Plus, LayoutGrid } from 'lucide-react';

const Credits = () => {
  const { user } = useAuthStore();
  const { cards, installments, subscribeCards, subscribeInstallments, loading } = useCreditStore();
  
  const [showAddCard, setShowAddCard] = useState(false);
  const [showAddInstallment, setShowAddInstallment] = useState(false);
  const [editingCard, setEditingCard] = useState(null);

  useEffect(() => {
    if (user) {
      const unsubCards = subscribeCards(user.uid);
      const unsubInstallments = subscribeInstallments(user.uid);
      return () => {
        if(unsubCards) unsubCards();
        if(unsubInstallments) unsubInstallments();
      }
    }
  }, [user]);

  return (
    <div className="pb-32 pt-6 px-4 max-w-7xl mx-auto min-h-screen animate-in fade-in">
      
      {/* 1. HEADER & HEALTH SCORE (Reemplaza el texto simple) */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-black text-secondary-900 dark:text-white uppercase tracking-tighter flex items-center gap-2">
                <LayoutGrid size={28} className="text-indigo-500" />
                Créditos
            </h1>
            
            {cards.length > 0 && (
                <button 
                    onClick={() => setShowAddInstallment(true)}
                    className="bg-[#FFD700] text-[#1e1b4b] px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                    <Plus size={18} strokeWidth={3} /> <span className="hidden sm:inline">Nueva Compra</span>
                </button>
            )}
        </div>

        {/* Widget de Salud Financiera */}
        <DebtHealthWidget cards={cards} />
      </section>

      {/* 2. WALLET VIEW */}
      <section className="mb-10">
        <div className="flex items-center justify-between px-2 mb-4">
            <h3 className="text-sm font-black text-secondary-400 uppercase tracking-widest">Mis Tarjetas</h3>
        </div>
        <CreditWallet 
            cards={cards} 
            onAddCard={() => setShowAddCard(true)} 
            onEditCard={(card) => setEditingCard(card)} 
        />
      </section>

      {/* 3. LISTA DETALLADA */}
      <section className="mb-10">
        <InstallmentList cards={cards} installments={installments} />
      </section>

      {/* 4. TIMELINE DE LIBERTAD (Al final, como conclusión) */}
      <section>
         <FreedomTimeline installments={installments} />
      </section>

      {/* Loading & Empty States */}
      {loading && (
        <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[#FFD700]" />
        </div>
      )}

      {!loading && cards.length === 0 && (
        <div className="text-center py-20 opacity-40">
            <p className="text-xs font-black uppercase tracking-widest">Empieza agregando una tarjeta</p>
        </div>
      )}

      {/* MODALES */}
      {showAddCard && <AddCardModal onClose={() => setShowAddCard(false)} />}
      {showAddInstallment && <AddInstallmentModal onClose={() => setShowAddInstallment(false)} />}
      {editingCard && <EditCardModal card={editingCard} onClose={() => setEditingCard(null)} />}
    </div>
  );
};

export default Credits;