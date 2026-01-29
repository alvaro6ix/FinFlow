import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Alert from '../../components/common/Alert';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const { resetPassword, loading } = useAuthStore();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await resetPassword(email);
    
    if (result.success) {
      setSent(true);
    } else {
      setError('Error al enviar el correo de recuperación');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-secondary-950 dark:via-secondary-900 dark:to-secondary-950 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-500 rounded-2xl shadow-lg mb-4">
            <span className="text-4xl">🔐</span>
          </div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-2">
            Recuperar Contraseña
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            Te enviaremos un enlace para restablecer tu contraseña
          </p>
        </div>

        <div className="bg-white dark:bg-secondary-900 rounded-2xl shadow-lg p-8">
          {sent ? (
            <div className="text-center space-y-4">
              <Alert
                type="success"
                title="¡Correo enviado!"
                message="Revisa tu bandeja de entrada"
              />
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Hemos enviado un enlace de recuperación a <strong>{email}</strong>
              </p>
              <Link to="/login">
                <Button variant="outline" fullWidth>
                  Volver al inicio de sesión
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <Alert type="error" message={error} className="mb-4" />
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  }
                />

                <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
                  Enviar Enlace de Recuperación
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link to="/login" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  ← Volver al inicio de sesión
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;