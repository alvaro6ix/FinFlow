import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Wallet, Target, PieChart, CreditCard } from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();

  // Orden solicitado: Dashboard, Expenses, Credit, Budgets, Analytics
  const menuItems = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Inicio' },
    { path: '/expenses', icon: <Wallet size={20} />, label: 'Gastos' },
    { path: '/credits', icon: <CreditCard size={20} />, label: 'Créditos' },
    { path: '/budgets', icon: <Target size={20} />, label: 'Límites' },
    { path: '/analytics', icon: <PieChart size={20} />, label: 'Análisis' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="lg:hidden fixed bottom-4 left-4 right-4 z-30 
      bg-white/80 dark:bg-secondary-900/80 backdrop-blur-xl 
      border border-white/40 dark:border-white/10 rounded-[2rem] shadow-2xl pb-safe">
      <div className="flex items-center justify-around py-3 px-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`
              flex flex-col items-center gap-1 px-3 transition-all duration-300
              ${isActive(item.path) 
                ? 'text-indigo-600 dark:text-white scale-110' 
                : 'text-secondary-400 dark:text-secondary-500 hover:text-secondary-600 dark:hover:text-secondary-300'
              }
            `}
          >
            <div className={`
              p-1.5 rounded-xl transition-all duration-300
              ${isActive(item.path) ? 'bg-indigo-50 dark:bg-white/10 shadow-sm' : 'bg-transparent'}
            `}>
              {item.icon}
            </div>
            <span className="text-[9px] font-black uppercase tracking-wider">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;