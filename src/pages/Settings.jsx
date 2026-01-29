import React from 'react';
import { useAuthStore } from '../stores/authStore';
import { exportToCSV } from '../utils/exportUtils';
import { useExpenseStore } from '../stores/expenseStore';
import Card from '../components/common/Card';

const Settings = () => {
  const { user, signOut } = useAuthStore();
  const { expenses } = useExpenseStore();

  return (
    <div className="space-y-6 pb-24">
      <header>
        <h1 className="text-2xl font-bold dark:text-white">Configuración</h1>
        <p className="text-secondary-500 text-sm">Gestiona tu cuenta y preferencias</p>
      </header>

      {/* Perfil del Usuario (Req 1.3) */}
      <Card className="flex items-center gap-4">
        <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
          {user?.displayName?.charAt(0) || 'U'}
        </div>
        <div>
          <h2 className="font-bold dark:text-white text-lg">{user?.displayName || 'Usuario FinFlow'}</h2>
          <p className="text-sm text-secondary-500">{user?.email}</p>
        </div>
      </Card>

      {/* Preferencias de App (Req 12.1 y 12.2) */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-secondary-500 uppercase px-1">Preferencias</h3>
        <Card className="divide-y divide-secondary-100 dark:divide-secondary-800 p-0 overflow-hidden">
          <div className="p-4 flex justify-between items-center">
            <span className="dark:text-white">Moneda Principal</span>
            <span className="font-bold text-primary-500">MXN</span>
          </div>
          <div className="p-4 flex justify-between items-center">
            <span className="dark:text-white">Idioma</span>
            <span className="font-bold text-primary-500">Español</span>
          </div>
        </Card>
      </div>

      {/* Exportación y Datos (Req 11.1) */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-secondary-500 uppercase px-1">Datos y Respaldo</h3>
        <button 
          onClick={() => exportToCSV(expenses)}
          className="w-full"
        >
          <Card className="flex items-center gap-4 hover:bg-secondary-50 transition-colors">
            <span className="text-xl">📊</span>
            <div className="text-left">
              <p className="font-bold dark:text-white">Exportar a CSV</p>
              <p className="text-xs text-secondary-500">Descarga todos tus gastos para Excel</p>
            </div>
          </Card>
        </button>
      </div>

      {/* Sesión */}
      <button 
        onClick={signOut}
        className="w-full py-4 bg-danger-50 text-danger-600 rounded-2xl font-bold hover:bg-danger-100 transition-colors"
      >
        Cerrar Sesión
      </button>
      
      <p className="text-center text-[10px] text-secondary-400">
        FinFlow v1.0.0 - Built by Alvaro Aldama
      </p>
    </div>
  );
};

export default Settings;