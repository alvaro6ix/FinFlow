import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';

const Profile = () => {
  const { user, updateUserProfile, changePassword } = useAuthStore();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await updateUserProfile({ displayName });
    
    if (result.success) {
      setAlert({ type: 'success', message: 'Perfil actualizado correctamente' });
    } else {
      setAlert({ type: 'error', message: 'Error al actualizar perfil' });
    }
    setLoading(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setAlert({ type: 'error', message: 'Las contraseñas no coinciden' });
      return;
    }

    setLoading(true);
    const result = await changePassword(newPassword);
    
    if (result.success) {
      setAlert({ type: 'success', message: 'Contraseña actualizada' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setAlert({ type: 'error', message: 'Error al cambiar contraseña' });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">
          Mi Perfil
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400 mt-1">
          Gestiona tu información personal
        </p>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Información del usuario */}
      <Card title="Información Personal">
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-primary-500 flex items-center justify-center text-white text-3xl font-bold">
              {user?.displayName?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="font-bold text-lg text-secondary-900 dark:text-white">
                {user?.displayName || 'Usuario'}
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                {user?.email}
              </p>
            </div>
          </div>

          <Input
            label="Nombre completo"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Tu nombre"
          />

          <Input
            label="Email"
            value={user?.email}
            disabled
            helperText="El email no se puede cambiar"
          />

          <Button type="submit" loading={loading}>
            Guardar Cambios
          </Button>
        </form>
      </Card>

      {/* Cambiar contraseña */}
      <Card title="Cambiar Contraseña">
        <form onSubmit={handleChangePassword} className="space-y-4">
          <Input
            label="Nueva contraseña"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
          />

          <Input
            label="Confirmar contraseña"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
          />

          <Button type="submit" loading={loading}>
            Cambiar Contraseña
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Profile;