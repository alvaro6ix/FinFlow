import { create } from 'zustand';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  deleteUser,
} from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, googleProvider, storage } from '../firebase/config';

export const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: null,
  currency: localStorage.getItem('ff_currency') || 'MXN',
  language: localStorage.getItem('ff_language') || 'es',

  setUser: (user) => set({ user, loading: false, error: null }),
  setLoading: (loading) => set({ loading }),
  clearError: () => set({ error: null }),

  setCurrency: (currency) => {
    localStorage.setItem('ff_currency', currency);
    set({ currency });
  },
  setLanguage: (language) => {
    localStorage.setItem('ff_language', language);
    set({ language });
  },

  // ✅ GOOGLE RESTAURADO
  signInWithGoogle: async () => {
    set({ loading: true, error: null });
    try {
      await signInWithPopup(auth, googleProvider);
      return { success: true };
    } catch (error) {
      set({ error: "Error al conectar con Google", loading: false });
      return { success: false };
    }
  },

  updateUserProfile: async (data) => {
    set({ loading: true, error: null });
    try {
      let photoURL = data.photoURL;
      if (data.photoFile) {
        const storageRef = ref(storage, `avatars/${auth.currentUser.uid}`);
        await uploadBytes(storageRef, data.photoFile);
        photoURL = await getDownloadURL(storageRef);
      }
      await updateProfile(auth.currentUser, {
        displayName: data.displayName || auth.currentUser.displayName,
        photoURL: photoURL || auth.currentUser.photoURL
      });
      set({ user: { ...auth.currentUser }, loading: false });
      return { success: true };
    } catch (error) {
      set({ error: "Error al actualizar", loading: false });
      return { success: false };
    }
  },

  signIn: async (email, password) => {
    set({ loading: true, error: null });
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      set({ error: "Credenciales inválidas", loading: false });
      return { success: false };
    }
  },

  signUp: async (email, password, name) => {
    set({ loading: true, error: null });
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(res.user, { displayName: name });
      return { success: true };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false };
    }
  },

  resetPassword: async (email) => {
    set({ loading: true });
    try {
      await sendPasswordResetEmail(auth, email);
      set({ loading: false });
      return { success: true };
    } catch (error) {
      set({ error: "Error al enviar correo", loading: false });
      return { success: false };
    }
  },

  signOut: async () => {
    await firebaseSignOut(auth);
    set({ user: null });
  },

  deleteAccount: async () => {
    try {
      await deleteUser(auth.currentUser);
      set({ user: null });
      return { success: true };
    } catch (error) {
      set({ error: "Re-autenticación requerida" });
      return { success: false };
    }
  }
}));