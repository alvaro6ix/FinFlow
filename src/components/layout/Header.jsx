import React from 'react';
import { useAuthStore } from '../../stores/authStore';
import useOnline from '../../hooks/useOnline';
import Alert from '../common/Alert';
import { Menu, Wallet } from 'lucide-react'; 

const Header = ({ onMenuClick }) => {
  const { user } = useAuthStore();
  const isOnline = useOnline();

  return (
    <>
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-[60] p-2 animate-in slide-in-from-top duration-300">
          <Alert type="offline" message="Modo Offline activo. Datos locales." />
        </div>
      )}

      <header className={`lg:hidden fixed left-0 right-0 z-40 bg-white/90 dark:bg-secondary-900/90 backdrop-blur-md border-b border-secondary-200 dark:border-secondary-800 transition-all duration-300 ${!isOnline ? 'top-16' : 'top-0'}`}>
        <div className="flex items-center justify-between p-4">
          <button onClick={onMenuClick} className="p-2 text-secondary-600 dark:text-secondary-300 active:scale-90" aria-label="Menu">
            <Menu size={24} />
          </button>
          
          <h1 className="text-xl font-black text-amber-500 flex items-center gap-2 uppercase tracking-tighter leading-none">
            <Wallet size={20} /> FinFlow
          </h1>

          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-sm font-black shadow-lg shadow-amber-500/20 uppercase">
            {user?.displayName?.[0] || 'U'}
          </div>
        </div>
      </header>

      {/* Espaciado responsivo dinámico */}
      <div className={`lg:hidden transition-all duration-300 ${!isOnline ? 'h-32' : 'h-16'}`} />
    </>
  );
};

export default Header;