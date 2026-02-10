import React, { useMemo } from 'react';
import { Target, Wallet, Calendar, Sparkles, PiggyBank, AlertTriangle, TrendingDown, ArrowRight } from 'lucide-react';

const BudgetStrategy = ({ allIncome = [], allExpenses = [], selectedMonth, onMonthChange }) => {
  
  // 1. FILTRADO ESTRICTO POR MES (Usando props)
  const monthlyData = useMemo(() => {
    // Filtrar Ingresos del Mes Seleccionado
    const incomes = allIncome.filter(inc => {
      if (inc.type === 'fixed' && !inc.date) return true; 
      const d = new Date(inc.date.seconds ? inc.date.seconds * 1000 : inc.date);
      return d.toISOString().slice(0, 7) === selectedMonth;
    });

    // Filtrar Gastos del Mes Seleccionado
    const expenses = allExpenses.filter(exp => {
      const d = new Date(exp.date.seconds ? exp.date.seconds * 1000 : exp.date);
      return d.toISOString().slice(0, 7) === selectedMonth;
    });

    // Calcular Totales
    const totalIncome = incomes.reduce((acc, inc) => acc + Number(inc.amount), 0);
    const totalSpent = expenses.reduce((acc, exp) => acc + Number(exp.amount), 0);
    const balance = totalIncome - totalSpent;

    return { totalIncome, totalSpent, balance };
  }, [allIncome, allExpenses, selectedMonth]);

  // 2. CÁLCULOS 50/30/20
  const initialPlan = {
    needs: monthlyData.totalIncome * 0.50,
    wants: monthlyData.totalIncome * 0.30,
    savings: monthlyData.totalIncome * 0.20
  };

  const remainingPlan = monthlyData.balance > 0 ? {
    needs: monthlyData.balance * 0.50,
    wants: monthlyData.balance * 0.30,
    savings: monthlyData.balance * 0.20
  } : null;

  const StrategyCard = ({ title, amount, color, icon: Icon, label }) => (
    <div className={`p-4 rounded-2xl border backdrop-blur-md ${color} flex flex-col justify-between h-full`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-black uppercase opacity-70">{label}</span>
        <Icon size={16} />
      </div>
      <div>
        <p className="text-lg font-black tracking-tight">${amount.toLocaleString()}</p>
        <p className="text-[9px] opacity-60 font-bold">{title}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER: Selector de Mes (Controlado por el padre) */}
      <div className="flex flex-col sm:flex-row justify-between items-end gap-4 bg-white/40 dark:bg-secondary-900/40 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/20 shadow-lg">
        <div>
          <h2 className="text-xl font-black text-secondary-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
            <Sparkles className="text-[#FFD700]" size={24} />
            Estrategia Mensual
          </h2>
          <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
            Visualiza cómo debiste gastar vs cómo debes terminar el mes.
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-white/50 dark:bg-black/20 p-2 rounded-xl border border-white/10">
          <Calendar size={18} className="text-[#FFD700]" />
          <input 
            type="month" 
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className="bg-transparent text-sm font-black text-secondary-900 dark:text-white outline-none cursor-pointer dark:[color-scheme:dark]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ESCENARIO A: PLAN IDEAL */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-[2.5rem] blur-xl" />
          <div className="relative bg-white/40 dark:bg-secondary-900/40 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-6 shadow-xl h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                <Target size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-indigo-500 tracking-widest">Escenario Ideal</p>
                <h3 className="text-lg font-black text-secondary-900 dark:text-white">Con tu Ingreso Total</h3>
              </div>
              <div className="ml-auto text-right">
                <p className="text-[10px] uppercase text-secondary-400 font-bold">Ingreso Total</p>
                <p className="text-xl font-black text-secondary-900 dark:text-white">${monthlyData.totalIncome.toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <StrategyCard label="50%" title="Necesidades" amount={initialPlan.needs} icon={Target} color="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" />
              <StrategyCard label="30%" title="Deseos" amount={initialPlan.wants} icon={Sparkles} color="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20" />
              <StrategyCard label="20%" title="Ahorro" amount={initialPlan.savings} icon={PiggyBank} color="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" />
            </div>
          </div>
        </div>

        {/* ESCENARIO B: PLAN RESCATE */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-[2.5rem] blur-xl" />
          <div className={`relative bg-white/40 dark:bg-secondary-900/40 backdrop-blur-xl border-l-4 rounded-[2.5rem] p-6 shadow-xl h-full ${monthlyData.balance < 0 ? 'border-red-500' : 'border-[#FFD700]'}`}>
            
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-3 rounded-2xl ${monthlyData.balance < 0 ? 'bg-red-500/20 text-red-500' : 'bg-[#FFD700]/20 text-[#b45309] dark:text-[#FFD700]'}`}>
                {monthlyData.balance < 0 ? <AlertTriangle size={24} /> : <Wallet size={24} />}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70">
                  {monthlyData.balance < 0 ? 'Alerta Crítica' : 'Plan de Rescate'}
                </p>
                <h3 className="text-lg font-black text-secondary-900 dark:text-white">Con lo que te sobra</h3>
              </div>
              <div className="ml-auto text-right">
                <p className="text-[10px] uppercase text-secondary-400 font-bold">Disponible</p>
                <p className={`text-xl font-black ${monthlyData.balance < 0 ? 'text-red-500' : 'text-secondary-900 dark:text-white'}`}>
                  ${monthlyData.balance.toLocaleString()}
                </p>
              </div>
            </div>

            {monthlyData.balance > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                <StrategyCard label="50%" title="Vitales" amount={remainingPlan.needs} icon={Target} color="bg-white/50 dark:bg-black/20 border-white/10 text-secondary-500" />
                <StrategyCard label="30%" title="Libres" amount={remainingPlan.wants} icon={Sparkles} color="bg-white/50 dark:bg-black/20 border-white/10 text-secondary-500" />
                <StrategyCard label="20%" title="Futuro" amount={remainingPlan.savings} icon={PiggyBank} color="bg-white/50 dark:bg-black/20 border-white/10 text-secondary-500" />
              </div>
            ) : (
              <div className="h-32 flex flex-col items-center justify-center text-center p-4 rounded-3xl bg-red-500/10 border border-red-500/20">
                <AlertTriangle size={32} className="text-red-500 mb-2" />
                <p className="text-xs font-black text-red-500 uppercase tracking-widest">Presupuesto Agotado</p>
                <p className="text-[10px] text-secondary-500 dark:text-secondary-400 mt-1">
                  Has gastado ${Math.abs(monthlyData.balance).toLocaleString()} más de lo que ingresaste.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-center px-4 py-3 rounded-2xl bg-secondary-100/50 dark:bg-white/5 border border-secondary-200 dark:border-white/5">
        <div className="flex items-center gap-2 text-red-500">
          <TrendingDown size={16} />
          <span className="text-xs font-bold uppercase">Gastado: ${monthlyData.totalSpent.toLocaleString()}</span>
        </div>
        <div className="h-4 w-px bg-secondary-300 dark:bg-white/10" />
        <div className="flex items-center gap-2 text-emerald-500">
          <ArrowRight size={16} />
          <span className="text-xs font-bold uppercase">Ingresado: ${monthlyData.totalIncome.toLocaleString()}</span>
        </div>
      </div>

    </div>
  );
};

export default BudgetStrategy;