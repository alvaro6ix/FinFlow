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

// Páginas (Asegúrate de que los archivos existan en src/pages/)
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Budgets from './pages/Budgets';
import Goals from './pages/Goals';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthStore();
  
  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-secondary-50 dark:bg-secondary-950">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;

  return (
    <Layout>
      {children}
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

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Suscripciones reactivas
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
        {/* Ruta Pública */}
        <Route path="/login" element={<Login />} />
        
        {/* Rutas Protegidas y Navegables */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
        <Route path="/budgets" element={<ProtectedRoute><Budgets /></ProtectedRoute>} />
        <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        
        {/* Redirecciones */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;