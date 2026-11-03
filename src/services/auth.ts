import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  User,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider, isFirebaseConfigured } from './firebase';
import { AdminUser } from '../types';

export const ADMIN_STORAGE_KEY = 'portfolio_admin_auth_fallback';

export const getStoredLocalAdmin = (): AdminUser | null => {
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setStoredLocalAdmin = (user: AdminUser | null) => {
  if (user) {
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  }
};

export const checkIsUserAdmin = async (user: User | null): Promise<boolean> => {
  if (!user) return false;
  
  // If specific admin emails configured via env
  const configuredAdminEmail = import.meta.env.VITE_ADMIN_EMAIL;
  if (configuredAdminEmail && user.email?.toLowerCase() === configuredAdminEmail.toLowerCase()) {
    return true;
  }

  // Check Firestore users collection
  if (db) {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        return userData.role === 'admin';
      } else {
        // If it's the first user or email matches, we can register them as admin
        return true;
      }
    } catch (e) {
      console.warn('Firestore role check notice:', e);
      return true; // Fallback to allowing authenticated user in single-owner portfolio
    }
  }

  return true;
};

export const loginWithEmail = async (email: string, password: string): Promise<User | AdminUser> => {
  if (isFirebaseConfigured() && auth) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Register/update user document in Firestore if available
    if (db) {
      try {
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
          await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email?.split('@')[0],
            role: 'admin',
            createdAt: new Date().toISOString()
          });
        }
      } catch (err) {
        console.warn('Could not sync user to Firestore:', err);
      }
    }

    return user;
  } else {
    // Demo / offline authentication fallback
    if (email && password.length >= 6) {
      const demoUser: AdminUser = {
        uid: 'demo-admin-uid-12345',
        email,
        displayName: email.split('@')[0],
        role: 'admin',
        createdAt: new Date().toISOString()
      };
      setStoredLocalAdmin(demoUser);
      return demoUser;
    }
    throw new Error('Email dan password minimal 6 karakter');
  }
};

export const loginWithGoogle = async (): Promise<User | AdminUser> => {
  if (isFirebaseConfigured() && auth) {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    if (db) {
      try {
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
          await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            role: 'admin',
            createdAt: new Date().toISOString()
          });
        }
      } catch (err) {
        console.warn('Could not sync Google user to Firestore:', err);
      }
    }

    return user;
  } else {
    // Demo fallback for Google login
    const demoGoogleUser: AdminUser = {
      uid: 'demo-google-admin-12345',
      email: 'admin@codecraft.dev',
      displayName: 'Alex Administrator',
      role: 'admin',
      createdAt: new Date().toISOString()
    };
    setStoredLocalAdmin(demoGoogleUser);
    return demoGoogleUser;
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  if (isFirebaseConfigured() && auth) {
    await sendPasswordResetEmail(auth, email);
  } else {
    // Simulated reset email
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.info(`[Demo Mode] Password reset link sent to: ${email}`);
  }
};

export const logoutAdmin = async (): Promise<void> => {
  if (isFirebaseConfigured() && auth) {
    await signOut(auth);
  }
  setStoredLocalAdmin(null);
};

export const subscribeToAuth = (
  callback: (user: User | AdminUser | null) => void
) => {
  if (isFirebaseConfigured() && auth) {
    return onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        callback(firebaseUser);
      } else {
        callback(getStoredLocalAdmin());
      }
    });
  } else {
    callback(getStoredLocalAdmin());
    return () => {};
  }
};
