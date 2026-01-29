import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn, signInWithGoogle, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await signIn(email, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError('Email o contraseña incorrectos');
    }
  };

  const handleGoogleSignIn = async () => {
    const result = await signInWithGoogle();
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError('Error al iniciar sesión con Google');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-secondary-950 dark:via-secondary-900 dark:to-secondary-950 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-500 rounded-2xl shadow-lg mb-4">
            <span className="text-4xl">💰</span>
          </div>
          <h1 className="text-4xl font-bold text-secondary-900 dark:text-white mb-2">
            FinFlow
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            Tu asistente financiero personal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-secondary-900 rounded-2xl shadow-soft-lg p-8">
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-6">
            Iniciar Sesión
          </h2>

          {error && (
            <div className="mb-4 p-4 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg">
              <p className="text-sm text-danger-600 dark:text-danger-400">{error}</p>
            </div>
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

            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-secondary-700 dark:text-secondary-300">
                  Recordarme
                </span>
              </label>

              <Link
                to="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
            >
              Iniciar Sesión
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-secondary-200 dark:border-secondary-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-secondary-900 text-secondary-500">
                O continúa con
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            size="lg"
            fullWidth
            onClick={handleGoogleSignIn}
            icon={
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            }
          >
            Google
          </Button>

          <p className="mt-6 text-center text-sm text-secondary-600 dark:text-secondary-400">
            ¿No tienes cuenta?{' '}
            <Link
              to="/register"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Regístrate gratis
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-secondary-500">
          Al continuar, aceptas nuestros{' '}
          <a href="#" className="text-primary-600 hover:underline">
            Términos de Servicio
          </a>{' '}
          y{' '}
          <a href="#" className="text-primary-600 hover:underline">
            Política de Privacidad
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;