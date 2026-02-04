import { create } from 'zustand';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';

export const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  // ====== helpers ======
  setUser: (user) => set({ user, loading: false, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // ====== LOGIN ======
  signIn: async (email, password) => {
    set({ loading: true, error: null });

    try {
      await signInWithEmailAndPassword(auth, email, password);
      set({ loading: false, error: null });
      return { success: true };

    } catch (error) {
      console.log("Firebase error:", error.code);

      let message = "Correo o contraseña incorrectos";

      if (error.code === "auth/invalid-email") {
        message = "El formato del correo es inválido";
      } 
      else if (error.code === "auth/too-many-requests") {
        message = "Demasiados intentos. Intenta más tarde";
      } 
      else if (error.code === "auth/network-request-failed") {
        message = "Error de conexión. Revisa tu internet";
      }

      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  // ====== REGISTRO ======
  signUp: async (email, password, displayName) => {
    set({ loading: true, error: null });

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName });

      set({ loading: false, error: null });
      return { success: true };

    } catch (error) {
      console.log("Firebase error:", error.code);

      let message = "Error al crear la cuenta";

      if (error.code === "auth/email-already-in-use") {
        message = "Este correo ya está registrado";
      } 
      else if (error.code === "auth/weak-password") {
        message = "La contraseña debe tener al menos 6 caracteres";
      } 
      else if (error.code === "auth/invalid-email") {
        message = "El formato del correo es inválido";
      }

      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  // ====== GOOGLE ======
  signInWithGoogle: async () => {
    set({ loading: true, error: null });

    try {
      await signInWithPopup(auth, googleProvider);
      set({ loading: false, error: null });
      return { success: true };

    } catch (error) {
      console.log("Google error:", error.code);
      set({ error: "Error al iniciar sesión con Google", loading: false });
      return { success: false };
    }
  },

  // ====== RESET PASSWORD ======
  resetPassword: async (email) => {
    set({ loading: true, error: null });

    try {
      await sendPasswordResetEmail(auth, email);
      set({ loading: false, error: null });
      return { success: true };

    } catch (error) {
      console.log("Reset error:", error.code);

      let message = "No se pudo enviar el correo";

      if (error.code === "auth/user-not-found") {
        message = "No existe una cuenta con este correo";
      } 
      else if (error.code === "auth/invalid-email") {
        message = "El formato del correo es inválido";
      }

      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  // ====== LOGOUT ======
  signOut: async () => {
    set({ loading: true });

    try {
      await firebaseSignOut(auth);
      set({ user: null, loading: false, error: null });
      return { success: true };

    } catch (error) {
      console.log("Logout error:", error.code);
      set({ error: "Error al cerrar sesión", loading: false });
      return { success: false };
    }
  },
}));
