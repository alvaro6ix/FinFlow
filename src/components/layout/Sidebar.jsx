import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  Target, 
  Trophy, 
  PieChart, 
  Settings, 
  Moon, 
  Sun,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { signOut } = useAuthStore();
  
  // Lógica de Modo Oscuro integrada
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

  const menuItems = [
    { path: '/dashboard', icon: <LayoutDashboard size={22} />, label: 'Dashboard' },
    { path: '/expenses', icon: <Wallet size={22} />, label: 'Gastos' },
    { path: '/budgets', icon: <Target size={22} />, label: 'Presupuestos' },
    { path: '/goals', icon: <Trophy size={22} />, label: 'Metas' },
    { path: '/analytics', icon: <PieChart size={22} />, label: 'Análisis' },
    { path: '/settings', icon: <Settings size={22} />, label: 'Configuración' },
  ];

  return (
    <aside className={`
      fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-secondary-900 
      border-r border-secondary-200 dark:border-secondary-800
      transition-transform duration-300 lg:translate-x-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="flex flex-col h-full">
        {/* Branding con Amarillo Principal */}
        <div className="p-8 border-b border-secondary-100 dark:border-secondary-800">
          <h1 className="text-2xl font-black text-amber-500 flex items-center gap-2 uppercase tracking-tighter">
            <span className="text-3xl">💰</span> FinFlow
          </h1>
        </div>

        {/* Navegación Principal */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto mt-4">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center gap-4 px-4 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all duration-300
                  ${active 
                    ? 'bg-amber-500 text-white shadow-xl shadow-amber-500/30 scale-105' 
                    : 'text-secondary-500 hover:bg-amber-50 dark:hover:bg-amber-950/30 hover:text-amber-600'}
                `}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* SECCIÓN INFERIOR: TEMA Y CIERRE */}
        <div className="p-4 border-t border-secondary-100 dark:border-secondary-800 space-y-2">
          {/* BOTÓN DE MODO OSCURO (¡AQUÍ ESTÁ!) */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="w-full flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-2xl text-secondary-600 dark:text-secondary-400 font-black text-[10px] uppercase tracking-widest hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-all"
          >
            <div className="flex items-center gap-3">
              {isDark ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-amber-500" />}
              <span>{isDark ? 'Modo Claro' : 'Modo Oscuro'}</span>
            </div>
            <div className={`w-8 h-4 rounded-full p-1 transition-colors ${isDark ? 'bg-amber-500' : 'bg-secondary-300'}`}>
              <div className={`w-2 h-2 bg-white rounded-full transition-transform ${isDark ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </button>

          {/* Botón de Salida */}
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 p-4 text-red-500 font-black text-[10px] uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-950/20 rounded-2xl transition-all"
          >
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;