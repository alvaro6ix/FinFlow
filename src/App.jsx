import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';
import { useAuthStore } from './stores/authStore';
import { useExpenseStore } from './stores/expenseStore';
import { useBudgetStore } from './stores/budgetStore';
import { useGoalStore } from './stores/goalStore';

// Layout y UI Global
import Layout from './components/layout/Layout';
import FloatingActionButton from './components/common/FloatingActionButton';
import QuickAddModal from './components/expenses/QuickAddModal';

// Páginas
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Budgets from './pages/Budgets';
import Goals from './pages/Goals';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

/**
 * Componente de Protección de Rutas
 * Envuelve las secciones privadas con el Layout y detecta el estado de carga.
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthStore();
  
  if (loading) return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-secondary-50 dark:bg-secondary-950 transition-colors duration-500">
      {/* Spinner con color Ámbar principal */}
      <div className="relative flex items-center justify-center">
        <div className="absolute animate-ping h-16 w-16 rounded-full bg-amber-500 opacity-20"></div>
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-amber-500 shadow-lg shadow-amber-500/20"></div>
      </div>
      <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-secondary-400 animate-pulse">
        Cargando Finanzas
      </p>
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;

  return (
    <Layout>
      {children}
      {/* Componentes de acción global */}
      <FloatingActionButton />
      <QuickAddModal />
    </Layout>
  );
};

function App() {
  const { setUser } = useAuthStore();
  const { subscribeExpenses, clearExpenses } = useExpenseStore();
  const { subscribeBudgets } = useBudgetStore();
  const { subscribeGoals } = useGoalStore();

  // EFECTO DE INICIALIZACIÓN: Modo Oscuro y Autenticación
  useEffect(() => {
    // 1. Inicializar Tema Oscuro al arrancar
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // 2. Suscripción a Firebase Auth
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Suscripciones reactivas en tiempo real
        subscribeExpenses(firebaseUser.uid);
        subscribeBudgets(firebaseUser.uid);
        subscribeGoals(firebaseUser.uid);
      } else {
        setUser(null);
        clearExpenses();
      }
    });

    return () => {
      if (typeof unsubscribeAuth === 'function') unsubscribeAuth();
    };
  }, [setUser, subscribeExpenses, subscribeBudgets, subscribeGoals, clearExpenses]);

  return (
    <BrowserRouter 
      future={{ 
        v7_startTransition: true, 
        v7_relativeSplatPath: true 
      }}
    >
      <Routes>
        {/* Ruta Pública: Login */}
        <Route path="/login" element={<Login />} />
        
        {/* Rutas Protegidas y Navegables */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
        <Route path="/budgets" element={<ProtectedRoute><Budgets /></ProtectedRoute>} />
        <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        
        {/* Redirecciones Automáticas */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;