import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react'; 

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`El usuario decidió: ${outcome}`);
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96 animate-in slide-in-from-bottom duration-500">
      <div className="bg-[#1e1b4b] border border-indigo-500/50 p-4 rounded-2xl shadow-2xl flex items-center gap-4 text-white">
        
        {/* CORRECCIÓN: Ahora mostramos tu Logo Real */}
        <div className="shrink-0">
           <img 
             src="/pwa-192x192.png" 
             alt="Logo FinFlow" 
             className="w-12 h-12 rounded-xl shadow-lg border border-white/10"
           />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm text-[#FFD600] uppercase tracking-wide">
            Instalar FinFlow
          </h3>
          <p className="text-xs text-gray-300 mt-0.5 truncate">
            Acceso rápido y funciona sin internet.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsVisible(false)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
          
          <button 
            onClick={handleInstall}
            className="bg-[#FFD600] text-black text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-yellow-400 transition-transform active:scale-95 shadow-lg shadow-yellow-500/20"
          >
            INSTALAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;