
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDE5-keIgJJJiiZ6kNQYql2NSm4OZRy1Ps",
  authDomain: "finflow-5704e.firebaseapp.com",
  projectId: "finflow-5704e",
  storageBucket: "finflow-5704e.firebasestorage.app",
  messagingSenderId: "606510547450",
  appId: "1:606510547450:web:60a97dffcc7b5c449b2443"
};
// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Servicios de Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app;