import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';
import { useAuthStore } from './stores/authStore';

// Layout y Componentes de carga
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';

// 1. IMPORTAR COMPONENTES GLOBALES
import PWAInstallPrompt from './components/common/PWAInstallPrompt';
import RecurringProcessor from './components/common/RecurringProcessor'; // ✅ NUEVO

// Páginas de Autenticación
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Páginas de la Aplicación
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import RecurringExpenses from './pages/RecurringExpenses'; // ✅ ASEGÚRATE DE TENER ESTE ARCHIVO
import Budgets from './pages/Budgets';
import Goals from './pages/Goals';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

// Componente para proteger rutas privadas
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50 dark:bg-secondary-950">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {/* ✅ INYECTAMOS EL MOTOR AQUÍ DE FORMA SEGURA */}
      <RecurringProcessor />
      {children}
    </>
  );
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuthStore();

  if (loading) return null;

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  // Inicialización de Auth (Manteniendo tu lógica original si la tenías)
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [setUser, setLoading]);

  return (
    <BrowserRouter>
      {/* Prompt de instalación PWA */}
      <PWAInstallPrompt />

      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
        <Route path="/forgot-password" element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        } />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Rutas Privadas */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="recurring" element={<RecurringExpenses />} /> {/* ✅ RUTA NUEVA */}
          <Route path="budgets" element={<Budgets />} />
          <Route path="goals" element={<Goals />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;