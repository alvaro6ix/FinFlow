import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Wallet, Target, Trophy, PieChart } from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();

  // 5 Secciones clave para el pulgar
  const menuItems = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Inicio' },
    { path: '/expenses', icon: <Wallet size={20} />, label: 'Gastos' },
    { path: '/budgets', icon: <Target size={20} />, label: 'Límites' },
    { path: '/goals', icon: <Trophy size={20} />, label: 'Metas' },
    { path: '/analytics', icon: <PieChart size={20} />, label: 'Análisis' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="lg:hidden fixed bottom-4 left-4 right-4 z-30 
      bg-white/70 dark:bg-secondary-950/70 backdrop-blur-xl 
      border border-white/20 dark:border-white/5 rounded-[2rem] shadow-2xl pb-safe">
      <div className="flex items-center justify-around py-3 px-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`
              flex flex-col items-center gap-1 px-3 transition-all duration-300
              ${isActive(item.path) ? 'text-primary-500 scale-110' : 'text-secondary-400 dark:text-secondary-500'}
            `}
          >
            <div className={`${isActive(item.path) ? 'text-primary-500' : 'text-indigo-500/70'}`}>
              {item.icon}
            </div>
            <span className="text-[7px] font-black uppercase tracking-widest leading-none mt-1">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;