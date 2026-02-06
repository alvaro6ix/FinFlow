import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Wallet, Target, Trophy, 
  PieChart, Settings, Moon, Sun, LogOut, Zap, User 
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { signOut } = useAuthStore();
  
  const [isDark, setIsDark] = useState(
    localStorage.getItem('theme') === 'dark' || 
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // ORDEN CORREGIDO: Metas antes de Análisis
  const menuItems = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/expenses', icon: <Wallet size={20} />, label: 'Gastos' },
    { path: '/budgets', icon: <Target size={20} />, label: 'Presupuestos' },
    { path: '/goals', icon: <Trophy size={20} />, label: 'Metas' },
    { path: '/analytics', icon: <PieChart size={20} />, label: 'Análisis' },
    { path: '/profile', icon: <User size={20} />, label: 'Perfil' },
    { path: '/settings', icon: <Settings size={20} />, label: 'Configuración' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-72 
      bg-white/70 dark:bg-secondary-950/70 backdrop-blur-xl
      border-r border-white/20 dark:border-white/5
      transform transition-transform duration-300
      
      /* ✅ CORRECCIÓN AQUÍ: Sticky en lugar de Static */
      lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen
      
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="flex flex-col h-full p-6 overflow-y-auto custom-scrollbar"> {/* Agregado overflow-y-auto por seguridad */}
        
        {/* LOGO LIQUID STYLE */}
        <div className="flex items-center gap-3 mb-10 px-2 group shrink-0">
          <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 transition-transform group-hover:rotate-12">
            <Zap size={24} className="text-primary-500 fill-primary-500" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tighter italic leading-none">
            <span className="text-indigo-600 dark:text-indigo-400">FIN</span>
            <span className="text-primary-500">FLOW</span>
          </h1>
        </div>

        {/* NAVEGACIÓN LIQUID GLASS */}
        <nav className="flex-1 space-y-1.5">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`
                flex items-center gap-4 px-4 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300
                ${isActive(item.path)
                  ? 'bg-primary-500 text-black shadow-lg shadow-primary-500/30 scale-[1.03]'
                  : 'text-secondary-500 dark:text-secondary-400 hover:bg-white/50 dark:hover:bg-white/5 hover:text-indigo-600 dark:hover:text-primary-500'}
              `}
            >
              <span className={`${isActive(item.path) ? 'text-black' : 'text-indigo-500'}`}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* FOOTER SIDEBAR GLASS */}
        <div className="pt-6 border-t border-white/10 space-y-3 shrink-0">
          <button
            onClick={() => setIsDark(!isDark)}
            className="w-full flex items-center justify-between p-4 bg-white/40 dark:bg-white/5 rounded-2xl text-secondary-600 dark:text-secondary-400 font-black text-[9px] uppercase tracking-widest hover:scale-[1.02] transition-all"
          >
            <div className="flex items-center gap-3">
              {isDark ? <Sun size={18} className="text-primary-500" /> : <Moon size={18} className="text-indigo-600" />}
              <span>{isDark ? 'Luz' : 'Noche'}</span>
            </div>
            <div className={`w-8 h-4 rounded-full p-1 transition-colors ${isDark ? 'bg-primary-500' : 'bg-secondary-600'}`}>
              <div className={`w-2 h-2 bg-white rounded-full transition-transform ${isDark ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </button>

          <button
            onClick={signOut}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-red-500 font-black text-[9px] uppercase tracking-widest hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;