import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Kredensial Firebase Proyek Personal Portfolio (Data Pribadi)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBaTM_EGZBqO5SOUmxwhVHyqaT3QJwb9jQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "personal-portfolio-b3d76.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "personal-portfolio-b3d76",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "personal-portfolio-b3d76.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "485726761479",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:485726761479:web:7bc2d7f4b14dadf3b530a2",
};

// Inisialisasi Firebase App
const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Layanan Firebase Inti
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);

// Provider Autentikasi Google
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const isFirebaseConfigured = (): boolean => true;

export { app, auth, db, storage, googleProvider, firebaseConfig };
