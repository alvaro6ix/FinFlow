import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Zap, Globe, DollarSign, Moon, Sun, AlertCircle, User, Mail, Lock } from 'lucide-react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [localError, setLocalError] = useState('');
  const { signUp, signInWithGoogle, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const toggleDarkMode = () => document.documentElement.classList.toggle('dark');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (!name || !email || !password) {
      setLocalError('Todos los campos son obligatorios');
      return;
    }
    const result = await signUp(email, password, name);
    if (result.success) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-secondary-950 transition-colors duration-500 overflow-hidden relative font-sans">
      <button onClick={toggleDarkMode} className="absolute top-6 right-6 z-50 p-2.5 bg-secondary-100 dark:bg-secondary-900 rounded-xl text-indigo-600 dark:text-[#FFD700] shadow-lg border dark:border-secondary-800"><Sun className="hidden dark:block" size={18} /><Moon className="block dark:hidden" size={18} /></button>

      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(60)].map((_, i) => (
          <div key={i} className="absolute text-[#FFD700] font-black animate-fall select-none opacity-40" style={{ left: `${Math.random() * 100}%`, fontSize: `${Math.random() * 20 + 12}px`, animationDuration: `${Math.random() * 4 + 3}s`, animationDelay: `${Math.random() * 5}s` }}>$</div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-[340px] mx-4">
        <div className="bg-white/10 dark:bg-secondary-900/10 backdrop-blur-[8px] rounded-[2.5rem] border border-secondary-100 dark:border-white/5 shadow-2xl p-6 md:p-8 overflow-hidden text-center">
          <div className="mb-6">
            <div className="relative inline-flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-xl mb-2 shadow-lg"><Zap size={24} className="text-[#FFD700] fill-[#FFD700]" /></div>
            <h1 className="text-3xl font-black uppercase tracking-tighter italic leading-none"><span className="text-indigo-600 dark:text-indigo-400">FIN</span><span className="text-[#FFD700]">FLOW</span></h1>
            <p className="text-[8px] font-black text-secondary-500 dark:text-secondary-400 uppercase tracking-widest mt-2 italic leading-none">Nueva Identidad Financiera</p>
          </div>

          {(localError || error) && (
            <div className="mb-4 p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl flex items-center gap-2 animate-in fade-in zoom-in duration-300">
              <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
              <p className="text-[9px] font-bold text-red-600 dark:text-red-400 text-left leading-tight">{localError || error}</p>
            </div>
          )}

          <form className="space-y-3.5 text-left" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-[8px] font-black text-indigo-600 dark:text-indigo-400 uppercase ml-2 tracking-widest">Nombre</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 bg-secondary-50/50 dark:bg-white/5 border border-secondary-200 dark:border-white/10 rounded-xl outline-none focus:border-[#FFD700] transition-all text-secondary-900 dark:text-white font-bold text-xs" placeholder="Tu nombre" />
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-black text-indigo-600 dark:text-indigo-400 uppercase ml-2 tracking-widest">Correo</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 bg-secondary-50/50 dark:bg-white/5 border border-secondary-200 dark:border-white/10 rounded-xl outline-none focus:border-[#FFD700] transition-all text-secondary-900 dark:text-white font-bold text-xs" placeholder="tu@correo.com" />
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-black text-indigo-600 dark:text-indigo-400 uppercase ml-2 tracking-widest">Contraseña</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 bg-secondary-50/50 dark:bg-white/5 border border-secondary-200 dark:border-white/10 rounded-xl outline-none focus:border-[#FFD700] transition-all text-secondary-900 dark:text-white font-bold text-xs" placeholder="••••••••" />
            </div>

            <div className="flex justify-center pt-2">
              <button type="submit" className="uiverse" disabled={loading}>
                <div className="wrapper">
                  <span>{loading ? '...' : 'REGISTRARME'} <DollarSign size={14} /></span>
                  {[...Array(12)].map((_, i) => (<div key={i} className={`circle circle-${i + 1}`}></div>))}
                </div>
              </button>
            </div>
          </form>

          <div className="relative my-6 flex items-center">
            <div className="flex-grow h-px bg-secondary-100 dark:bg-white/5" />
            <div className="flex-grow h-px bg-secondary-100 dark:bg-white/5" />
          </div>

          <div className="space-y-3">
            <button onClick={() => signInWithGoogle()} className="w-full py-2.5 bg-white dark:bg-white/5 border border-secondary-100 dark:border-white/10 rounded-xl flex items-center justify-center gap-3 text-secondary-600 dark:text-white/60 hover:border-indigo-600 transition-all group shadow-sm">
              <Globe size={14} className="text-[#FFD700] group-hover:rotate-180 transition-transform duration-700" />
              <span className="text-[9px] font-black uppercase tracking-widest">Registrarse con Google</span>
            </button>
            <p className="text-center text-[9px] font-black text-secondary-400 dark:text-secondary-500 uppercase tracking-widest">
              ¿Ya tienes cuenta? <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:text-[#FFD700] transition-colors font-black no-underline">Inicia Sesión</Link>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fall { 0% { transform: translateY(-20vh) rotate(0deg); opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { transform: translateY(110vh) rotate(360deg); opacity: 0; } }
        .animate-fall { animation: fall linear infinite; }
        .uiverse { --duration: 7s; --easing: linear; --c-color-1: rgba(79,70,229,0.7); --c-color-2: #FFD700; --c-color-3: #4f46e5; --c-color-4: rgba(255,215,0,0.8); --c-shadow: rgba(255,215,0,0.3); --c-shadow-inset-top: rgba(255,215,0,0.6); --c-shadow-inset-bottom: rgba(255,255,255,0.5); --c-radial-inner: #FFD700; --c-radial-outer: #f9c725; outline: none; position: relative; cursor: pointer; border: none; display: table; border-radius: 12px; padding: 0; font-weight: 900; font-size: 11px; letter-spacing: 0.12em; color: #000; background: radial-gradient(circle, var(--c-radial-inner), var(--c-radial-outer) 80%); box-shadow: 0 4px 10px var(--c-shadow); transition: transform 0.2s; }
        .uiverse:active { transform: scale(0.96); }
        .uiverse:before { content: ""; pointer-events: none; position: absolute; z-index: 3; left: 0; top: 0; right: 0; bottom: 0; border-radius: 12px; box-shadow: inset 0 2px 8px var(--c-shadow-inset-top), inset 0 -2px 3px var(--c-shadow-inset-bottom); }
        .uiverse .wrapper { overflow: hidden; border-radius: 12px; min-width: 125px; padding: 10px 0; position: relative; }
        .uiverse .wrapper span { display: inline-flex; align-items: center; gap: 6px; position: relative; z-index: 1; color: #000 !important; }
        .uiverse .wrapper .circle { position: absolute; left: 0; top: 0; width: 25px; height: 25px; border-radius: 50%; filter: blur(6px); background: var(--background, transparent); transform: translate(var(--x, 0), var(--y, 0)) translateZ(0); animation: var(--animation, none) var(--duration) var(--easing) infinite; }
        .uiverse .wrapper .circle.circle-1, .circle-9, .circle-10 { --background: var(--c-color-4); }
        .uiverse .wrapper .circle.circle-3, .circle-4 { --background: var(--c-color-2); --blur: 10px; }
        .uiverse .wrapper .circle.circle-5, .circle-6 { --background: var(--c-color-1); --blur: 12px; }
        .uiverse .wrapper .circle.circle-2, .circle-7, .circle-8, .circle-11, .circle-12 { --background: var(--c-color-3); --blur: 8px; }
        .uiverse .wrapper .circle.circle-1 { --x: 0; --y: -30px; --animation: circle-1; }
        .uiverse .wrapper .circle.circle-2 { --x: 70px; --y: 5px; --animation: circle-2; }
        .uiverse .wrapper .circle.circle-3 { --x: -10px; --y: -10px; --animation: circle-3; }
        .uiverse .wrapper .circle.circle-4 { --x: 60px; --y: -10px; --animation: circle-4; }
        @keyframes circle-1 { 33% { transform: translate(0px, 12px); } 66% { transform: translate(8px, 45px); } }
        @keyframes circle-2 { 33% { transform: translate(60px, -8px); } 66% { transform: translate(50px, -35px); } }
        @keyframes circle-3 { 33% { transform: translate(15px, 8px); } 66% { transform: translate(8px, 2px); } }
        @keyframes circle-4 { 33% { transform: translate(55px, -8px); } 66% { transform: translate(80px, -4px); } }
      `}</style>
    </div>
  );
};

export default Register;