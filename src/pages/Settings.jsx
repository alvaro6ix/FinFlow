import React from 'react';
import { useSettingsStore } from '../stores/settingsStore';
import { useAuthStore } from '../stores/authStore';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const Settings = () => {
  const { currency, theme, setCurrency, setTheme } = useSettingsStore();
  const { user, signOut } = useAuthStore();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">
          Configuración
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400 mt-1">
          Personaliza tu experiencia
        </p>
      </div>

      {/* Profile */}
      <Card title="Perfil">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center text-white text-2xl font-bold">
              {user?.displayName?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="font-bold text-secondary-900 dark:text-white">
                {user?.displayName || 'Usuario'}
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Currency */}
      <Card title="Moneda">
        <div className="space-y-2">
          {['MXN', 'USD', 'EUR'].map((curr) => (
            <label key={curr} className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-800 cursor-pointer">
              <input
                type="radio"
                name="currency"
                value={curr}
                checked={currency === curr}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-4 h-4 text-primary-600"
              />
              <span className="text-secondary-900 dark:text-white">
                {curr === 'MXN' && '🇲🇽 Peso Mexicano (MXN)'}
                {curr === 'USD' && '🇺🇸 Dólar Estadounidense (USD)'}
                {curr === 'EUR' && '🇪🇺 Euro (EUR)'}
              </span>
            </label>
          ))}
        </div>
      </Card>

      {/* Theme */}
      <Card title="Apariencia">
        <div className="space-y-2">
          {[
            { value: 'light', label: '☀️ Modo Claro', icon: '☀️' },
            { value: 'dark', label: '🌙 Modo Oscuro', icon: '🌙' },
            { value: 'auto', label: '🔄 Automático', icon: '🔄' },
          ].map((option) => (
            <label key={option.value} className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-800 cursor-pointer">
              <input
                type="radio"
                name="theme"
                value={option.value}
                checked={theme === option.value}
                onChange={(e) => setTheme(e.target.value)}
                className="w-4 h-4 text-primary-600"
              />
              <span className="text-secondary-900 dark:text-white">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </Card>

      {/* Danger Zone */}
      <Card title="Zona de Peligro">
        <div className="space-y-3">
          <Button variant="danger" fullWidth onClick={handleSignOut}>
            Cerrar Sesión
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Settings;