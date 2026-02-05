import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Zap, DollarSign, Moon, Sun, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [localError, setLocalError] = useState('');
  const { resetPassword, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const toggleDarkMode = () => document.documentElement.classList.toggle('dark');

  const handleSend = async (e) => {
    // ✅ CORRECCIÓN CRÍTICA: Evitamos la recarga de la página
    e.preventDefault();
    setLocalError('');
    clearError();

    if (!email) {
      setLocalError('El correo es obligatorio para la recuperación');
      return;
    }

    try {
      const result = await resetPassword(email);
      if (result.success) {
        setIsSent(true);
        // Damos tiempo al usuario para leer el mensaje de éxito antes de redirigir
        setTimeout(() => navigate('/login'), 5000);
      }
    } catch (err) {
      setLocalError('Ocurrió un error al intentar enviar el correo');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-secondary-950 transition-colors duration-500 overflow-hidden relative font-sans">
      
      {/* MODO OSCURO */}
      <button 
        onClick={toggleDarkMode} 
        className="absolute top-6 right-6 z-50 p-2.5 bg-secondary-100 dark:bg-secondary-900 rounded-xl text-indigo-600 dark:text-[#FFD700] shadow-lg border dark:border-secondary-800"
      >
        <Sun size={18} className="hidden dark:block" />
        <Moon size={18} className="block dark:hidden" />
      </button>

      {/* --- TORMENTA DE ORO (LENTA) --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(60)].map((_, i) => (
          <div key={i} className="absolute text-[#FFD700] font-black animate-fall select-none opacity-40" style={{ left: `${Math.random() * 100}%`, fontSize: `${Math.random() * 20 + 12}px`, animationDuration: `${Math.random() * 4 + 3}s`, animationDelay: `${Math.random() * 5}s` }}>$</div>
        ))}
      </div>

      {/* --- FORMULARIO LIQUID GLASS --- */}
      <div className="relative z-10 w-full max-w-[340px] mx-4">
        <div className="bg-white/10 dark:bg-secondary-900/10 backdrop-blur-[8px] rounded-[2.5rem] border border-secondary-100 dark:border-white/5 shadow-2xl p-8 text-center overflow-hidden">
          
          <div className="mb-6">
             <div className="relative inline-flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-xl mb-3 shadow-lg">
               <Zap size={24} className="text-[#FFD700] fill-[#FFD700]" />
             </div>
             <h2 className="text-2xl font-black uppercase tracking-tighter italic text-indigo-600 dark:text-indigo-400 leading-none">Recuperar Acceso</h2>
             <p className="text-[9px] font-black text-secondary-400 uppercase tracking-widest mt-2">Protocolo de Seguridad</p>
          </div>

          {isSent ? (
            /* --- MENSAJE DE ÉXITO PROFESIONAL --- */
            <div className="space-y-4 animate-in fade-in zoom-in duration-500">
              <div className="flex justify-center">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-full">
                  <CheckCircle size={48} className="text-emerald-500 animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-black text-secondary-900 dark:text-white uppercase tracking-tight">¡Correo Enviado!</h3>
                <p className="text-[10px] font-bold text-secondary-500 dark:text-secondary-400 leading-relaxed">
                  Hemos enviado una liga de recuperación a <br />
                  <span className="text-indigo-600 dark:text-indigo-400">{email}</span>
                </p>
              </div>
              <p className="text-[8px] font-black text-secondary-400 uppercase tracking-widest pt-4">Redirigiendo al portal...</p>
            </div>
          ) : (
            <form className="space-y-5 text-left" onSubmit={handleSend}>
              {(localError || error) && (
                <div className="p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl flex items-center gap-2 animate-in slide-in-from-top-2">
                  <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
                  <p className="text-[9px] font-bold text-red-600 dark:text-red-400 leading-tight">{localError || error}</p>
                </div>
              )}
              
              <div className="space-y-1">
                <label className="text-[8px] font-black text-indigo-600 dark:text-indigo-400 uppercase ml-2 tracking-widest">Nodo de Correo</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full px-4 py-3 bg-secondary-50/50 dark:bg-white/5 border border-secondary-200 dark:border-white/10 rounded-xl outline-none focus:border-[#FFD700] transition-all text-secondary-900 dark:text-white font-bold text-xs" 
                  placeholder="tu@correo.com" 
                />
              </div>

              {/* --- BOTÓN UIVERSE EXACTO (TEXTO NEGRO) --- */}
              <div className="flex justify-center pt-2">
                <button type="submit" className="uiverse" disabled={loading}>
                  <div className="wrapper">
                    <span>{loading ? '...' : 'ENVIAR LLAVE'} <DollarSign size={14} /></span>
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className={`circle circle-${i + 1}`}></div>
                    ))}
                  </div>
                </button>
              </div>

              <div className="text-center">
                <Link to="/login" className="inline-flex items-center gap-1 text-[8px] font-black text-secondary-400 dark:text-secondary-500 hover:text-indigo-600 transition-colors no-underline uppercase tracking-widest">
                  <ArrowLeft size={10} /> Volver al portal
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fall { 
          0% { transform: translateY(-20vh) rotate(0deg); opacity: 0; } 
          15% { opacity: 1; } 
          85% { opacity: 1; } 
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; } 
        }
        .animate-fall { animation: fall linear infinite; }
        
        .uiverse {
          --duration: 7s;
          --easing: linear;
          --c-color-1: rgba(79, 70, 229, 0.7);
          --c-color-2: #FFD700;
          --c-shadow: rgba(255, 215, 0, 0.3);
          --c-radial-inner: #FFD700;
          --c-radial-outer: #f9c725;
          outline: none;
          position: relative;
          cursor: pointer;
          border: none;
          display: table;
          border-radius: 12px;
          padding: 0;
          font-weight: 900;
          font-size: 11px;
          letter-spacing: 0.12em;
          color: #000;
          background: radial-gradient(circle, var(--c-radial-inner), var(--c-radial-outer) 80%);
          box-shadow: 0 4px 10px var(--c-shadow);
          transition: transform 0.2s;
        }

        .uiverse .wrapper {
          overflow: hidden;
          border-radius: 12px;
          min-width: 140px;
          padding: 10px 0;
          position: relative;
        }

        .uiverse .wrapper span { 
          display: inline-flex; 
          align-items: center; 
          gap: 6px; 
          position: relative; 
          z-index: 1; 
          color: #000 !important; 
        }

        .uiverse .wrapper .circle { 
          position: absolute; 
          left: 0; top: 0; 
          width: 25px; height: 25px; 
          border-radius: 50%; 
          filter: blur(6px); 
          background: #4f46e5; 
          animation: circle-1 var(--duration) linear infinite; 
          opacity: 0.5; 
        }

        @keyframes circle-1 { 
          33% { transform: translate(0px, 12px); } 
          66% { transform: translate(8px, 45px); } 
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;