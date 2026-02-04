import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Mail, Lock, User, Chrome, ArrowRight } from 'lucide-react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { signUp, signInWithGoogle, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signUp(email, password, name);
    if (result.success) navigate('/dashboard');
  };

  const handleGoogleLogin = async () => {
    const result = await signInWithGoogle();
    if (result.success) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-950 flex flex-col justify-center p-6">
      <div className="max-w-md w-full mx-auto space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-black text-secondary-900 dark:text-white uppercase">
            Crear <span className="text-amber-500">Cuenta</span>
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && <div className="p-3 text-sm bg-red-100 text-red-700 rounded-lg">{error}</div>}
          
          <div className="space-y-3">
            <div className="relative">
              <User className="absolute left-3 top-3 text-secondary-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Nombre completo"
                className="w-full pl-10 pr-4 py-3 rounded-xl border dark:bg-secondary-900 dark:border-secondary-800 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-secondary-400 h-5 w-5" />
              <input
                type="email"
                placeholder="Correo electrónico"
                className="w-full pl-10 pr-4 py-3 rounded-xl border dark:bg-secondary-900 dark:border-secondary-800 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-secondary-400 h-5 w-5" />
              <input
                type="password"
                placeholder="Contraseña"
                className="w-full pl-10 pr-4 py-3 rounded-xl border dark:bg-secondary-900 dark:border-secondary-800 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-amber-500 text-white font-bold rounded-2xl hover:bg-amber-600 transition-all shadow-lg"
          >
            {loading ? 'Cargando...' : 'Registrarme'}
          </button>
        </form>

        <button
          onClick={handleGoogleLogin}
          className="w-full py-4 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-800 text-secondary-700 dark:text-white font-bold rounded-2xl flex items-center justify-center gap-2"
        >
          <Chrome className="h-5 w-5 text-amber-500" />
          Registrarse con Google
        </button>

        <p className="text-center text-secondary-500 text-sm">
          ¿Ya tienes cuenta? <Link to="/login" className="text-amber-500 font-bold">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;