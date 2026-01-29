import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      error: null,

      // Iniciar sesión con email y contraseña
      signIn: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const result = await signInWithEmailAndPassword(auth, email, password);
          set({ user: result.user, loading: false });
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
          set({ user: result.user, loading: false });
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
          const result = await signInWithPopup(auth, googleProvider);
          set({ user: result.user, loading: false });
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
          await updateProfile(currentUser, updates);
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

      // Establecer usuario (para persistencia)
      setUser: (user) => set({ user }),

      // Limpiar errores
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);

export { useAuthStore };