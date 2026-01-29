import React from 'react';
import { useSettingsStore } from '../stores/settingsStore';
import { useAuthStore } from '../stores/authStore';
import Card from '../components/common/Card';

const Settings = () => {
  const { currency, setCurrency, darkMode, setDarkMode } = useSettingsStore();
  const { deleteAccount, user } = useAuthStore();

  return (
    <div className="space-y-6 pb-24">
      <h1 className="text-2xl font-bold dark:text-white">Configuración</h1>

      <Card title="Apariencia">
        <div className="flex justify-between items-center">
          <span>Modo Oscuro</span>
          <select 
            value={darkMode} 
            onChange={(e) => setDarkMode(e.target.value)}
            className="bg-secondary-50 p-2 rounded-lg border-none"
          >
            <option value="light">Claro</option>
            <option value="dark">Oscuro</option>
            <option value="auto">Automático</option>
          </select>
        </div>
      </Card>

      <Card title="Preferencias de Moneda">
        <div className="flex justify-between items-center">
          <span>Moneda Principal</span>
          <select 
            value={currency} 
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-secondary-50 p-2 rounded-lg border-none"
          >
            <option value="MXN">MXN - Peso Mexicano</option>
            <option value="USD">USD - Dólar</option>
            <option value="EUR">EUR - Euro</option>
          </select>
        </div>
      </Card>

      <Card title="Privacidad y Cuenta">
        <div className="space-y-4">
          <button className="w-full text-left text-primary-600 font-medium">Exportar mis datos (JSON)</button>
          <hr className="border-secondary-100" />
          <button 
            onClick={() => { if(confirm('¿Seguro? Esta acción es irreversible')) deleteAccount() }}
            className="w-full text-left text-danger-600 font-medium"
          >
            Eliminar mi cuenta permanentemente
          </button>
        </div>
      </Card>
      
      <div className="text-center text-secondary-400 text-xs">
        <p>FinFlow v1.0.0</p>
        <p>ID Usuario: {user?.uid}</p>
      </div>
    </div>
  );
};

export default Settings;