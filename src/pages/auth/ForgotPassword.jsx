import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import Input from '../../components/common/Input';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const { resetPassword, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSend = async () => {
    clearError();

    console.log("👉 Enviando reset a:", email);

    const result = await resetPassword(email);

    console.log("👉 Resultado:", result);

    if (result.success) {
      setIsSent(true);

      setTimeout(() => {
        navigate('/login');
      }, 3500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 dark:bg-secondary-950 p-6">
      <div className="max-w-md w-full bg-white dark:bg-secondary-900 p-8 rounded-3xl shadow-xl">

        <h2 className="text-2xl font-black text-center dark:text-white uppercase mb-6 tracking-tighter">
          Recuperar Cuenta
        </h2>

        {isSent ? (
          <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-2xl font-bold">
            <p className="mb-2">✅ Correo enviado correctamente</p>
            <p className="text-sm">
              Revisa tu bandeja de entrada o la carpeta de <b>spam</b>.
            </p>
            <p className="text-xs mt-2 opacity-80">
              Redirigiendo al login…
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs rounded-xl font-bold text-center">
                {error}
              </div>
            )}

            <Input
              label="Email de recuperación"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />

            {/* BOTÓN HTML PURO (NO FALLA) */}
            <button
              type="button"
              onClick={handleSend}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold transition disabled:opacity-60"
            >
              {loading ? 'Enviando…' : 'Enviar instrucciones'}
            </button>

            <Link
              to="/login"
              onClick={clearError}
              className="block text-center text-secondary-500 text-sm font-bold mt-4 hover:text-primary-600 underline underline-offset-4"
            >
              Volver al inicio
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default ForgotPassword;
