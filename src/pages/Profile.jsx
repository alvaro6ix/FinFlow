import React from 'react';
import { useAuthStore } from '../stores/authStore';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { LogOut, User, Mail, Shield } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="space-y-6 max-w-md mx-auto pb-24">
      <div className="text-center pt-8">
        <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-[2.5rem] mx-auto flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-primary-500/40 mb-4 uppercase">
          {user?.displayName?.[0] || 'U'}
        </div>
        <h1 className="text-2xl font-black text-secondary-900 dark:text-white uppercase tracking-tighter">Mi Perfil</h1>
        <p className="text-secondary-500 font-medium">Gestiona tu cuenta de FinFlow</p>
      </div>

      <Card>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary-100 dark:bg-secondary-800 rounded-2xl text-secondary-600 dark:text-secondary-400">
              <User size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-secondary-400 uppercase tracking-widest">Nombre Completo</p>
              <p className="font-bold text-secondary-900 dark:text-white">{user?.displayName || 'Usuario de FinFlow'}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary-100 dark:bg-secondary-800 rounded-2xl text-secondary-600 dark:text-secondary-400">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-secondary-400 uppercase tracking-widest">Correo Electrónico</p>
              <p className="font-bold text-secondary-900 dark:text-white">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-2xl text-green-600">
              <Shield size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Estado de Cuenta</p>
              <p className="font-bold text-secondary-900 dark:text-white">Verificada (Firebase)</p>
            </div>
          </div>
        </div>
      </Card>

      <Button 
        variant="ghost" 
        fullWidth 
        onClick={logout} 
        className="py-4 text-red-500 font-black uppercase tracking-widest border-2 border-red-50 dark:border-red-900/20"
      >
        Cerrar Sesión <LogOut className="ml-2" size={18} />
      </Button>

      {/* Referencia al negocio del usuario (Opcional/Easter Egg) */}
      <p className="text-center text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] pt-4">
        Optimizado para Alvaro Aldama
      </p>
    </div>
  );
};

export default Profile;