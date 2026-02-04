import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '../../firebase/config';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(''); // 'loading', 'success', 'error'
  const navigate = useNavigate();
  
  const oobCode = searchParams.get('oobCode'); // El código que viene en el correo

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await confirmPasswordReset(auth, oobCode, password);
      setStatus('success');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setStatus('error');
    }
  };

  if (status === 'success') return (
    <div className="min-h-screen flex items-center justify-center dark:bg-secondary-950 dark:text-white">
      <p>✅ Contraseña cambiada. Redirigiendo al login...</p>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 dark:bg-secondary-950 p-6">
      <div className="max-w-md w-full bg-white dark:bg-secondary-900 p-8 rounded-3xl shadow-xl">
        <h2 className="text-2xl font-black mb-6 dark:text-white uppercase">Nueva Contraseña</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Escribe tu nueva contraseña"
            className="w-full p-4 rounded-2xl border dark:bg-secondary-950 dark:border-secondary-800 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="w-full py-4 bg-amber-500 text-white font-black rounded-2xl">
            {status === 'loading' ? 'Cambiando...' : 'Restablecer Contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;