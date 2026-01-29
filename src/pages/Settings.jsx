import React from 'react';
import { useAuthStore } from '../stores/authStore';
import { useExpenseStore } from '../stores/expenseStore';
import { useBudgetStore } from '../stores/budgetStore';
import { useGoalStore } from '../stores/goalStore';
import { exportToCSV, exportFullBackupJSON } from '../utils/exportUtils';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const Settings = () => {
  const { user, signOut, deleteAccount } = useAuthStore();
  const { expenses } = useExpenseStore();
  const { budgets } = useBudgetStore();
  const { goals } = useGoalStore();

  const handleFullBackup = () => {
    // Requerimiento 11.2: Respaldo de TODOS los datos
    const fullData = {
      profile: { email: user.email, name: user.displayName },
      expenses,
      budgets,
      goals,
      backupDate: new Date().toISOString()
    };
    exportFullBackupJSON(fullData);
  };

  return (
    <div className="space-y-8 pb-24 px-2">
      <header>
        <h1 className="text-3xl font-black text-secondary-900 dark:text-white uppercase tracking-tighter">Configuración</h1>
      </header>

      {/* Perfil */}
      <Card className="flex items-center gap-5 p-6 border-primary-100 bg-primary-50/30">
        <div className="w-16 h-16 bg-primary-600 rounded-[1.5rem] flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-primary-500/30">
          {user?.displayName?.charAt(0) || 'U'}
        </div>
        <div>
          <h2 className="font-black dark:text-white text-xl uppercase tracking-tight">{user?.displayName || 'Usuario'}</h2>
          <p className="text-xs font-bold text-secondary-500 uppercase tracking-widest">{user?.email}</p>
        </div>
      </Card>

      {/* Datos y Respaldo */}
      <section className="space-y-3">
        <h3 className="text-[10px] font-black text-secondary-400 uppercase tracking-widest px-1">Gestión de Datos</h3>
        <div className="grid grid-cols-1 gap-3">
          <button onClick={() => exportToCSV(expenses)} className="text-left">
            <Card hover className="flex items-center gap-4">
              <span className="text-2xl">📊</span>
              <div>
                <p className="font-black text-sm dark:text-white uppercase tracking-tight">Exportar Excel</p>
                <p className="text-[10px] text-secondary-500 font-bold uppercase">Descarga tus gastos en CSV</p>
              </div>
            </Card>
          </button>
          
          <button onClick={handleFullBackup} className="text-left">
            <Card hover className="flex items-center gap-4">
              <span className="text-2xl">💾</span>
              <div>
                <p className="font-black text-sm dark:text-white uppercase tracking-tight">Respaldo Total</p>
                <p className="text-[10px] text-secondary-500 font-bold uppercase">JSON con gastos, metas y presupuestos</p>
              </div>
            </Card>
          </button>
        </div>
      </section>

      {/* Zona de Peligro */}
      <section className="space-y-3">
        <h3 className="text-[10px] font-black text-danger-500 uppercase tracking-widest px-1">Privacidad y Cuenta</h3>
        <div className="bg-danger-50 dark:bg-danger-900/10 rounded-[2rem] p-2 border border-danger-100 dark:border-danger-900/30">
          <button onClick={signOut} className="w-full p-4 text-left font-bold text-danger-600 hover:bg-danger-100/50 rounded-xl transition-colors flex justify-between">
            Cerrar Sesión <span>→</span>
          </button>
          <button 
            onClick={() => { if(window.confirm("¿BORRAR TODO? Esta acción es irreversible.")) deleteAccount(); }} 
            className="w-full p-4 text-left font-bold text-danger-600 hover:bg-danger-100/50 rounded-xl transition-colors flex justify-between"
          >
            Eliminar Cuenta y Datos <span>🗑️</span>
          </button>
        </div>
      </section>
      
      <p className="text-center text-[10px] font-bold text-secondary-400 uppercase tracking-widest">
        FinFlow v1.0.0 • {new Date().getFullYear()}
      </p>
    </div>
  );
};

export default Settings;