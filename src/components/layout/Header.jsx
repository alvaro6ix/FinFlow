import React from 'react';
import { useAuthStore } from '../../stores/authStore';
import { Menu, Zap } from 'lucide-react'; 

const Header = ({ onMenuClick }) => {
  const { user } = useAuthStore();

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-40 
      bg-white/70 dark:bg-secondary-950/70 backdrop-blur-xl 
      border-b border-white/10 transition-all duration-300">
      <div className="flex items-center justify-between p-4">
        <button onClick={onMenuClick} className="p-2 text-indigo-600 dark:text-indigo-400 active:scale-90 transition-transform">
          <Menu size={24} />
        </button>
        
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md">
            <Zap size={18} className="text-primary-500 fill-primary-500" />
          </div>
          <h1 className="text-xl font-black uppercase tracking-tighter italic leading-none">
            <span className="text-indigo-600 dark:text-indigo-400">FIN</span>
            <span className="text-primary-500">FLOW</span>
          </h1>
        </div>

        {/* AVATAR DINÁMICO: Foto de Google o Inicial */}
        <div className="w-10 h-10 rounded-xl overflow-hidden bg-indigo-600 flex items-center justify-center shadow-lg border border-white/20">
          {user?.photoURL ? (
            <img 
              src={user.photoURL} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-primary-500 font-black text-sm uppercase">
              {user?.displayName?.[0] || user?.email?.[0] || 'U'}
            </span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;