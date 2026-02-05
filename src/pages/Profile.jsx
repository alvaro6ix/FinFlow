import React, { useState, useRef } from 'react';
import useAuth from '../hooks/useAuth';
import Card from '../components/common/Card';
import { 
  LogOut, User, Mail, Shield, Camera, 
  Globe, Coins, Save, CheckCircle, Key, Trash2, Languages 
} from 'lucide-react';

const Profile = () => {
  const { 
    user, loading, signOut, resetPassword, deleteAccount,
    updateUserProfile, currency, setCurrency, language, setLanguage 
  } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(user?.displayName || '');
  const [msg, setMsg] = useState(null);
  const fileInputRef = useRef(null);

  const handleSaveName = async () => {
    const res = await updateUserProfile({ displayName: tempName });
    if (res.success) {
      setMsg("Nombre actualizado");
      setIsEditing(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setMsg("Subiendo imagen...");
      const res = await updateUserProfile({ photoFile: file });
      if (res.success) setMsg("Foto de perfil actualizada");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-32 animate-in fade-in duration-700">
      
      {/* SECCIÓN AVATAR */}
      <div className="text-center pt-8">
        <div className="relative w-32 h-32 mx-auto mb-6 group">
          <div className="w-full h-full bg-indigo-600 rounded-[3rem] flex items-center justify-center text-white text-5xl font-black shadow-2xl overflow-hidden border-4 border-white/20">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              user?.displayName?.[0] || 'U'
            )}
            {loading && <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-xs text-white">Cargando...</div>}
          </div>
          <button 
            onClick={() => fileInputRef.current.click()}
            className="absolute bottom-0 right-0 p-3 bg-white dark:bg-secondary-900 rounded-2xl shadow-xl text-indigo-600 hover:scale-110 transition-all"
          >
            <Camera size={20} />
          </button>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        </div>
        <h1 className="text-3xl font-black text-secondary-900 dark:text-white uppercase tracking-tighter">
          {user?.displayName || 'Usuario'}
        </h1>
      </div>

      {msg && (
        <div className="bg-primary-500/10 text-primary-600 dark:text-primary-500 p-4 rounded-2xl border border-primary-500/20 text-xs font-black uppercase text-center animate-pulse">
          {msg}
        </div>
      )}

      {/* CARD: PREFERENCIAS (Aquí se soluciona la persistencia) */}
      <Card className="bg-white/40 dark:bg-secondary-900/40 backdrop-blur-xl border-white/20 rounded-[2.5rem] p-8">
        <h3 className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-6 flex items-center gap-2"><Globe size={16}/> Preferencias Globales</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[9px] font-black text-secondary-400 uppercase ml-2 tracking-widest">Moneda</label>
            <select 
              value={currency} 
              onChange={e => setCurrency(e.target.value)} 
              className="w-full p-4 rounded-2xl bg-white/50 dark:bg-secondary-800 border-none font-black text-xs uppercase cursor-pointer focus:ring-2 focus:ring-primary-500 shadow-sm"
            >
              <option value="MXN">Pesos (MXN)</option>
              <option value="USD">Dólar (USD)</option>
              <option value="EUR">Euro (EUR)</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black text-secondary-400 uppercase ml-2 tracking-widest">Idioma</label>
            <select 
              value={language} 
              onChange={e => setLanguage(e.target.value)} 
              className="w-full p-4 rounded-2xl bg-white/50 dark:bg-secondary-800 border-none font-black text-xs uppercase cursor-pointer focus:ring-2 focus:ring-primary-500 shadow-sm"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </Card>

      {/* IDENTIDAD */}
      <Card className="bg-white/40 dark:bg-secondary-900/40 backdrop-blur-xl border-white/20 rounded-[2.5rem] p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-indigo-600 flex items-center gap-2"><User size={16}/> Datos de cuenta</h3>
          <button onClick={() => setIsEditing(!isEditing)} className="text-[10px] font-black uppercase text-secondary-500 hover:text-primary-500 transition-colors">
            {isEditing ? 'Cancelar' : 'Editar Nombre'}
          </button>
        </div>
        
        {isEditing ? (
          <div className="flex gap-2">
            <input value={tempName} onChange={e => setTempName(e.target.value)} className="flex-1 p-4 rounded-2xl bg-white/50 dark:bg-secondary-800 border-none font-bold text-sm shadow-inner" />
            <button onClick={handleSaveName} className="px-6 bg-primary-500 rounded-2xl shadow-lg shadow-primary-500/20 active:scale-90 transition-all font-black text-[10px] uppercase">Guardar</button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white/30 dark:bg-white/5 border border-white/10">
              <p className="text-[8px] font-black text-secondary-400 uppercase mb-1">Nombre Público</p>
              <p className="font-bold text-secondary-900 dark:text-white uppercase tracking-tight">{user?.displayName || 'Usuario Sin Nombre'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/30 dark:bg-white/5 border border-white/10 opacity-60">
              <p className="text-[8px] font-black text-secondary-400 uppercase mb-1">Nodo de Correo (Protegido)</p>
              <p className="font-bold text-secondary-900 dark:text-white truncate">{user?.email}</p>
            </div>
          </div>
        )}
      </Card>

      {/* SEGURIDAD */}
      <Card className="bg-white/40 dark:bg-secondary-900/40 backdrop-blur-xl border-white/20 rounded-[2.5rem] p-8">
        <h3 className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-6 flex items-center gap-2"><Shield size={16}/> Seguridad</h3>
        <button onClick={() => resetPassword(user?.email)} className="w-full flex items-center justify-between p-5 bg-indigo-600/10 hover:bg-indigo-600/20 rounded-3xl transition-all group">
          <div className="flex items-center gap-4">
            <Key size={20} className="text-indigo-600 group-hover:rotate-12 transition-transform" />
            <span className="text-xs font-bold dark:text-white uppercase tracking-widest">Resetear Contraseña</span>
          </div>
          <CheckCircle size={18} className="text-indigo-500/40" />
        </button>
      </Card>

      <div className="space-y-4">
        <button 
          onClick={signOut}
          className="w-full py-5 bg-white dark:bg-secondary-900 border-2 border-secondary-100 dark:border-white/5 text-secondary-900 dark:text-white rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-[10px] shadow-xl hover:bg-secondary-50 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-3"
        >
          <LogOut size={20} /> Cerrar Sesión
        </button>

        <button onClick={() => { if(window.confirm("¿BORRAR CUENTA? Esta acción es irreversible.")) deleteAccount() }} className="w-full text-[8px] font-black text-red-500 uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity">
          Eliminar cuenta del sistema permanentemente
        </button>
      </div>
    </div>
  );
};

export default Profile;