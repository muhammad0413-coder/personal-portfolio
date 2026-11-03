import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
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

  const configuredAdminEmail = import.meta.env.VITE_ADMIN_EMAIL;
  if (configuredAdminEmail && user.email?.toLowerCase() === configuredAdminEmail.toLowerCase()) {
    return true;
  }

  if (db) {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        return userData.role === 'admin';
      } else {
        return true;
      }
    } catch (e) {
      console.warn('Firestore role check notice:', e);
      return true;
    }
  }

  return true;
};

// ================= EMAIL & PASSWORD LOGIN (AUTO REGISTER NEW ACCOUNTS) =================
export const loginWithEmail = async (email: string, password: string): Promise<User | AdminUser> => {
  const cleanEmail = email.trim().toLowerCase();

  if (isFirebaseConfigured() && auth) {
    try {
      // 1. Coba login pengguna yang sudah ada
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const user = userCredential.user;

      if (db) {
        try {
          const userRef = doc(db, 'users', user.uid);
          await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email?.split('@')[0],
            role: 'admin',
            lastLogin: new Date().toISOString()
          }, { merge: true });
        } catch (err) {
          console.warn('Could not sync user to Firestore:', err);
        }
      }

      return user;
    } catch (err: any) {
      // 2. Jika akun belum ada di Firebase Auth, otomatis daftarkan akun baru
      if (
        err?.code === 'auth/user-not-found' ||
        err?.code === 'auth/invalid-credential' ||
        err?.code === 'auth/invalid-login-credentials'
      ) {
        try {
          const newCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
          const newUser = newCredential.user;

          if (db) {
            try {
              const userRef = doc(db, 'users', newUser.uid);
              await setDoc(userRef, {
                uid: newUser.uid,
                email: newUser.email,
                displayName: newUser.displayName || newUser.email?.split('@')[0],
                role: 'admin',
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
              }, { merge: true });
            } catch (e) {
              console.warn('Could not create Firestore user entry:', e);
            }
          }

          return newUser;
        } catch (signupErr) {
          throw signupErr;
        }
      }
      throw err;
    }
  } else {
    // Mode offline / lokal: setiap email memiliki UID terisolasi sendiri
    if (cleanEmail && password.length >= 6) {
      const safeUid = `user_${cleanEmail.replace(/[^a-z0-9]/g, '_')}`;
      const demoUser: AdminUser = {
        uid: safeUid,
        email: cleanEmail,
        displayName: cleanEmail.split('@')[0],
        role: 'admin',
        createdAt: new Date().toISOString()
      };
      setStoredLocalAdmin(demoUser);
      return demoUser;
    }
    throw new Error('Email dan kata sandi minimal 6 karakter.');
  }
};

// ================= GOOGLE 1-CLICK POPUP LOGIN =================
export const loginWithGoogle = async (): Promise<User | AdminUser> => {
  if (isFirebaseConfigured() && auth) {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    if (db) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0],
          photoURL: user.photoURL || '',
          role: 'admin',
          lastLogin: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.warn('Could not sync Google user to Firestore:', err);
      }
    }

    return user;
  } else {
    // Mode fallback dengan ID unik
    const demoGoogleUser: AdminUser = {
      uid: 'google_muhammad_default',
      email: 'muhammad@gmail.com',
      displayName: 'Muhammad User',
      role: 'admin',
      createdAt: new Date().toISOString()
    };
    setStoredLocalAdmin(demoGoogleUser);
    return demoGoogleUser;
  }
};

// ================= LOGIN DENGAN AKUN GOOGLE SPESIFIK (MULTI-USER TEST) =================
export const loginDirectGoogleAccount = async (
  email: string,
  displayName?: string
): Promise<AdminUser> => {
  const cleanEmail = email.trim().toLowerCase();
  const safeUid = `google_${cleanEmail.replace(/[^a-z0-9]/g, '_')}`;
  const name = displayName || cleanEmail.split('@')[0];

  const user: AdminUser = {
    uid: safeUid,
    email: cleanEmail,
    displayName: name,
    role: 'admin',
    createdAt: new Date().toISOString()
  };

  if (isFirebaseConfigured() && db) {
    try {
      await setDoc(
        doc(db, 'users', safeUid),
        {
          uid: safeUid,
          email: cleanEmail,
          displayName: name,
          role: 'admin',
          lastLogin: new Date().toISOString()
        },
        { merge: true }
      );
    } catch (e) {
      console.warn('Firestore direct user sync notice:', e);
    }
  }

  setStoredLocalAdmin(user);
  return user;
};

// ================= RESET PASSWORD =================
export const resetPassword = async (email: string): Promise<void> => {
  if (isFirebaseConfigured() && auth) {
    await sendPasswordResetEmail(auth, email.trim().toLowerCase());
  } else {
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.info(`[Demo Mode] Password reset link sent to: ${email}`);
  }
};

// ================= LOGOUT =================
export const logoutAdmin = async (): Promise<void> => {
  if (isFirebaseConfigured() && auth) {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Firebase signOut notice:', e);
    }
  }
  setStoredLocalAdmin(null);
};

// ================= AUTH STATE SUBSCRIBER =================
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
