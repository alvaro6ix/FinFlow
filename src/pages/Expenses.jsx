import React, { useEffect, useMemo, useState } from "react";
import { useExpenseStore } from "../stores/expenseStore";
import { useAuthStore } from "../stores/authStore";
import { useUIStore } from "../stores/uiStore";
import { useCategoryStore } from "../stores/categoryStore"; // Importar el nuevo store
import ExpenseList from "../components/expenses/ExpenseList";
import ExpenseFilters from "../components/expenses/ExpenseFilters";
import CategoryManager from "../components/expenses/CategoryManager"; // Importar el manager
import FloatingActionButton from "../components/common/FloatingActionButton";
import QuickAddModal from "../components/expenses/QuickAddModal";
import { Search, SlidersHorizontal, X, Calendar as CalendarIcon, Trash2, Loader2, Tag } from "lucide-react";

const Expenses = () => {
  const { expenses, subscribeExpenses, deleteExpense, clearAllExpenses, loading } = useExpenseStore();
  const { user } = useAuthStore();
  const { openQuickAddModal } = useUIStore();
  const { subscribeCategories } = useCategoryStore(); // Store de categorías
  
  const [showFilters, setShowFilters] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filters, setFilters] = useState({ 
    categories: [], 
    range: "month", 
    search: "", 
    paymentMethod: "all", 
    minAmount: "", 
    maxAmount: "",
    sortBy: "date-desc"
  });

  // Suscripción de Datos (Gastos y Categorías)
  useEffect(() => {
    if (user?.uid) {
      const unsubExpenses = subscribeExpenses(user.uid);
      const unsubCategories = subscribeCategories(user.uid);
      
      return () => {
        if (unsubExpenses) unsubExpenses();
        if (unsubCategories) unsubCategories();
      };
    }
  }, [user?.uid, subscribeExpenses, subscribeCategories]);

  // Lógica de borrado masivo corregida
  const handleDeleteAll = async () => {
    if (!expenses || expenses.length === 0) {
      alert("No hay gastos para eliminar");
      return;
    }

    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar TODOS los gastos? (${expenses.length} registros)\n\n⚠️ Esta acción NO se puede deshacer.`
    );

    if (!confirmDelete) return;

    setIsDeleting(true);
    const result = await clearAllExpenses(user.uid);
    
    if (result.success) {
      alert("✅ Historial limpiado exitosamente");
    } else {
      alert("❌ Error: " + result.error);
    }
    setIsDeleting(false);
  };

  const filteredExpenses = useMemo(() => {
    if (!expenses) return [];
    
    return expenses.filter(e => {
      const s = filters.search.toLowerCase();
      const matchSearch = !s || 
        (e.description?.toLowerCase() || "").includes(s) || 
        (e.categoryName?.toLowerCase() || "").includes(s) ||
        (e.tags?.some(tag => tag.toLowerCase().includes(s)));
      
      const matchCat = filters.categories.length === 0 || filters.categories.includes(e.categoryId);
      const matchPayment = filters.paymentMethod === "all" || e.paymentMethod === filters.paymentMethod;
      const matchMinAmount = !filters.minAmount || e.amount >= Number(filters.minAmount);
      const matchMaxAmount = !filters.maxAmount || e.amount <= Number(filters.maxAmount);
      
      let matchDate = true;
      if (filters.range) {
        const expenseDate = new Date(e.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (filters.range === "today") {
          const expenseDay = new Date(expenseDate);
          expenseDay.setHours(0, 0, 0, 0);
          matchDate = expenseDay.getTime() === today.getTime();
        } else if (filters.range === "week") {
          const weekAgo = new Date(today);
          weekAgo.setDate(today.getDate() - 7);
          matchDate = expenseDate >= weekAgo;
        } else if (filters.range === "month") {
          const monthAgo = new Date(today);
          monthAgo.setMonth(today.getMonth() - 1);
          matchDate = expenseDate >= monthAgo;
        } else if (filters.range === "year") {
          const yearAgo = new Date(today);
          yearAgo.setFullYear(today.getFullYear() - 1);
          matchDate = expenseDate >= yearAgo;
        }
      }
      return matchSearch && matchCat && matchPayment && matchMinAmount && matchMaxAmount && matchDate;
    });
  }, [expenses, filters]);

  const groupedExpenses = useMemo(() => {
    const groups = {};
    let sorted = [...filteredExpenses];
    
    switch(filters.sortBy) {
      case "date-desc": sorted.sort((a, b) => b.date - a.date); break;
      case "date-asc": sorted.sort((a, b) => a.date - b.date); break;
      case "amount-desc": sorted.sort((a, b) => b.amount - a.amount); break;
      case "amount-asc": sorted.sort((a, b) => a.amount - b.amount); break;
      case "category": sorted.sort((a, b) => (a.categoryName || "").localeCompare(b.categoryName || "")); break;
      default: sorted.sort((a, b) => b.date - a.date);
    }
    
    sorted.forEach(expense => {
      const d = new Date(expense.date);
      const dateKey = d.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' }).toUpperCase();
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(expense);
    });
    return groups;
  }, [filteredExpenses, filters.sortBy]);

  return (
    <div className="pb-32 pt-2 px-2 sm:px-6 max-w-4xl mx-auto overflow-x-hidden">
      <header className="flex justify-between items-center mb-4 px-2 pt-4">
        <h1 className="text-xl font-black text-secondary-900 dark:text-white uppercase tracking-tighter leading-none">
          Movimientos
        </h1>
        <div className="flex items-center gap-2">
          {/* GESTIÓN DE CATEGORÍAS */}
          <button 
            onClick={() => setShowCategoryManager(true)}
            className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-xl hover:scale-105 transition-transform"
            title="Gestionar Categorías"
          >
            <Tag size={18} />
          </button>

          {/* BOTÓN BORRAR TODO */}
          {expenses && expenses.length > 0 && (
            <button 
              onClick={handleDeleteAll}
              disabled={isDeleting}
              className={`p-2.5 rounded-xl shadow-sm transition-all ${
                isDeleting ? 'bg-gray-400' : 'bg-red-500 text-white active:scale-90'
              }`}
            >
              {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
            </button>
          )}
          
          <button 
            onClick={() => setShowFilters(!showFilters)} 
            className={`p-2.5 rounded-xl transition-all ${showFilters ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white dark:bg-secondary-900 shadow-sm'}`}
          >
            {showFilters ? <X size={18}/> : <SlidersHorizontal size={18} />}
          </button>
        </div>
      </header>

      {/* BARRA DE BÚSQUEDA */}
      <div className="px-1 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={14} />
          <input 
            type="text" 
            placeholder="Buscar descripción o tags..." 
            className="w-full pl-9 pr-4 py-3.5 rounded-2xl bg-white dark:bg-secondary-900 shadow-sm border-none font-bold text-xs" 
            value={filters.search} 
            onChange={(e) => setFilters(p => ({...p, search: e.target.value}))}
          />
        </div>
      </div>

      {/* PANEL DE FILTROS */}
      {showFilters && (
        <div className="px-1 mb-6 animate-in slide-in-from-top-2 duration-200">
          <ExpenseFilters filters={filters} onChange={setFilters} />
        </div>
      )}

      {/* LISTA DE MOVIMIENTOS */}
      <div className="space-y-6">
        {loading && expenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-indigo-600 mb-2" size={32} />
            <p className="text-[10px] font-black uppercase text-secondary-400 tracking-widest">Sincronizando...</p>
          </div>
        ) : Object.keys(groupedExpenses).length === 0 ? (
          <div className="text-center py-20 opacity-30 uppercase font-black text-[10px] tracking-widest">
            Sin resultados
          </div>
        ) : (
          Object.entries(groupedExpenses).map(([date, items]) => (
            <div key={date} className="space-y-2">
              <div className="flex items-center gap-1.5 ml-2 opacity-60">
                <CalendarIcon size={10} className="text-indigo-500" />
                <p className="text-[8px] font-black uppercase text-secondary-400 tracking-[0.2em]">{date}</p>
              </div>
              <ExpenseList expenses={items} onDelete={deleteExpense} />
            </div>
          ))
        )}
      </div>

      <FloatingActionButton onClick={openQuickAddModal} />
      
      {/* MODALES */}
      <QuickAddModal />
      {showCategoryManager && <CategoryManager onClose={() => setShowCategoryManager(false)} />}
    </div>
  );
};

export default Expenses;