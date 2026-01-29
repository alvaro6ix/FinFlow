import { create } from 'zustand';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  deleteUser,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';

const useAuthStore = create((set) => ({
  user: null,
  loading: true, // Empezamos en true para evitar parpadeos de rutas
  error: null,

  // Iniciar sesión con email y contraseña
  signIn: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      // No seteamos el usuario aquí, dejamos que onAuthStateChanged en App.jsx lo haga
      return { success: true };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  // Registrarse con email y contraseña
  signUp: async (email, password, displayName) => {
    set({ loading: true, error: null });
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName });
      return { success: true };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  // Iniciar sesión con Google
  signInWithGoogle: async () => {
    set({ loading: true, error: null });
    try {
      await signInWithPopup(auth, googleProvider);
      return { success: true };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  // Cerrar sesión
  signOut: async () => {
    set({ loading: true, error: null });
    try {
      await firebaseSignOut(auth);
      set({ user: null, loading: false });
      return { success: true };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  // Recuperar contraseña
  resetPassword: async (email) => {
    set({ loading: true, error: null });
    try {
      await sendPasswordResetEmail(auth, email);
      set({ loading: false });
      return { success: true };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  // Actualizar perfil
  updateUserProfile: async (updates) => {
    set({ loading: true, error: null });
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("No hay usuario autenticado");
      await updateProfile(currentUser, updates);
      // El observador onAuthStateChanged detectará cambios en algunos casos, 
      // pero forzamos actualización local para la UI
      set({ user: { ...currentUser, ...updates }, loading: false });
      return { success: true };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  // Cambiar contraseña
  changePassword: async (newPassword) => {
    set({ loading: true, error: null });
    try {
      const currentUser = auth.currentUser;
      await updatePassword(currentUser, newPassword);
      set({ loading: false });
      return { success: true };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  // Eliminar cuenta
  deleteAccount: async () => {
    set({ loading: true, error: null });
    try {
      const currentUser = auth.currentUser;
      await deleteUser(currentUser);
      set({ user: null, loading: false });
      return { success: true };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  // MÉTODO CRÍTICO: Sincroniza el estado global con Firebase
  setUser: (user) => set({ user, loading: false }),

  // Limpiar errores
  clearError: () => set({ error: null }),
}));

export { useAuthStore };