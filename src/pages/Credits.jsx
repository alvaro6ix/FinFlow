import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useCreditStore } from '../stores/creditStore';
import CreditWallet from '../components/credits/CreditWallet';
import AddCardModal from '../components/credits/AddCardModal';
import EditCardModal from '../components/credits/EditCardModal';
import AddInstallmentModal from '../components/credits/AddInstallmentModal';
import InstallmentList from '../components/credits/InstallmentList';
import DebtHealthWidget from '../components/credits/DebtHealthWidget';
import FreedomTimeline from '../components/credits/FreedomTimeline';
import SmartAlerts from '../components/credits/SmartAlerts';         // ✅ NUEVO
import PaymentOptimizer from '../components/credits/PaymentOptimizer'; // ✅ NUEVO
import SettlementSimulator from '../components/credits/SettlementSimulator'; // ✅ NUEVO
import { Loader2, Plus, LayoutGrid, BrainCircuit } from 'lucide-react';

const Credits = () => {
  const { user } = useAuthStore();
  const { cards, installments, subscribeCards, subscribeInstallments, loading } = useCreditStore();
  
  const [showAddCard, setShowAddCard] = useState(false);
  const [showAddInstallment, setShowAddInstallment] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  
  // Estado para el Simulador (Se activa desde las alertas o lista)
  const [simulatingItem, setSimulatingItem] = useState(null); 
  const [showOptimizer, setShowOptimizer] = useState(false);

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
      
      {/* 1. HEADER & ACTIONS */}
      <section className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h1 className="text-3xl font-black text-secondary-900 dark:text-white uppercase tracking-tighter flex items-center gap-2">
                <LayoutGrid size={28} className="text-indigo-500" />
                Créditos
            </h1>
            
            <div className="flex gap-2">
                {cards.length > 0 && (
                    <>
                        <button 
                            onClick={() => setShowOptimizer(!showOptimizer)}
                            className={`px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 border ${showOptimizer ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-white dark:bg-white/5 text-secondary-500 border-secondary-200 dark:border-white/10'}`}
                        >
                            <BrainCircuit size={18} /> <span className="hidden sm:inline">Estrategia</span>
                        </button>
                        <button 
                            onClick={() => setShowAddInstallment(true)}
                            className="bg-[#FFD700] text-[#1e1b4b] px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                        >
                            <Plus size={18} strokeWidth={3} /> <span className="hidden sm:inline">Nueva Compra</span>
                        </button>
                    </>
                )}
            </div>
        </div>

        {/* Widget de Salud */}
        <DebtHealthWidget cards={cards} />
      </section>

      {/* 2. CEREBRO FINANCIERO (Alertas y Optimizador) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 space-y-6">
            <SmartAlerts cards={cards} installments={installments} />
            
            {/* OPTIMIZADOR DESPLEGABLE */}
            {showOptimizer && (
                <div className="animate-in slide-in-from-top-4">
                    <PaymentOptimizer installments={installments} />
                </div>
            )}

            {/* WALLET VIEW */}
            <div className="flex items-center justify-between px-2 mb-2">
                <h3 className="text-sm font-black text-secondary-400 uppercase tracking-widest">Mis Tarjetas</h3>
            </div>
            <CreditWallet 
                cards={cards} 
                onAddCard={() => setShowAddCard(true)} 
                onEditCard={(card) => setEditingCard(card)} 
            />
        </div>

        {/* COLUMNA DERECHA: TIMELINE & RESUMEN */}
        <div className="lg:col-span-1">
             <FreedomTimeline installments={installments} />
        </div>
      </section>

      {/* 3. LISTA DETALLADA */}
      <section className="mb-10">
        <InstallmentList cards={cards} installments={installments} />
      </section>

      {loading && <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#FFD700]" /></div>}

      {!loading && cards.length === 0 && (
        <div className="text-center py-20 opacity-40">
            <p className="text-xs font-black uppercase tracking-widest">Agrega tu primera tarjeta para comenzar</p>
        </div>
      )}

      {/* MODALES */}
      {showAddCard && <AddCardModal onClose={() => setShowAddCard(false)} />}
      {showAddInstallment && <AddInstallmentModal onClose={() => setShowAddInstallment(false)} />}
      {editingCard && <EditCardModal card={editingCard} onClose={() => setEditingCard(null)} />}
      
      {/* SIMULADOR (Puede ser invocado desde la lista o alertas en el futuro) */}
      {simulatingItem && (
        <SettlementSimulator 
            installment={simulatingItem} 
            onClose={() => setSimulatingItem(null)} 
        />
      )}
    </div>
  );
};

export default Credits;