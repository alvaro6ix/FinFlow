import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const { signIn, signInWithGoogle, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    clearError(); // limpiar SOLO al intentar login

    const result = await signIn(email, password);

    if (result.success) {
      navigate('/dashboard');
    }
  };

  const handleGoogleSignIn = async () => {
    const result = await signInWithGoogle();
    if (result.success) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-secondary-950 dark:via-secondary-900 dark:to-secondary-950 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-500 rounded-2xl shadow-lg mb-4 text-4xl">💰</div>
          <h1 className="text-4xl font-bold text-secondary-900 dark:text-white mb-2 uppercase tracking-tighter">
            FinFlow
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400 font-medium">
            Tu asistente financiero personal
          </p>
        </div>

        <div className="bg-white dark:bg-secondary-900 rounded-2xl shadow-soft-lg p-8">
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-6 uppercase tracking-tight">
            Iniciar Sesión
          </h2>

          {/* ERROR */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-sm text-red-600 dark:text-red-400 font-bold text-center">
                {error}
              </p>
            </div>
          )}

          {/* FORM SIN SUBMIT */}
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />

            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-secondary-300 rounded"
                />
                <span className="text-sm text-secondary-700 dark:text-secondary-300">
                  Recordarme
                </span>
              </label>

              <Link
                to="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-700 font-bold underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* BOTÓN SIN SUBMIT */}
            <Button
              type="button"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              onClick={handleSubmit}
            >
              Iniciar Sesión
            </Button>
          </form>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-secondary-200 dark:border-secondary-700" />
            </div>
            <span className="relative px-2 bg-white dark:bg-secondary-900 text-secondary-500 text-xs font-black uppercase">
              O
            </span>
          </div>

          <Button
            variant="outline"
            size="lg"
            fullWidth
            onClick={handleGoogleSignIn}
            icon={<span className="text-lg">G</span>}
          >
            Google
          </Button>

          <p className="mt-6 text-center text-sm text-secondary-600 dark:text-secondary-400">
            ¿No tienes cuenta?{' '}
            <Link
              to="/register"
              className="text-primary-600 hover:text-primary-700 font-black underline"
            >
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
