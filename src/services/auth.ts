import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  User,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from './firebase';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  provider?: string;
}

const LOCAL_SESSION_KEY = 'firebase_data_pribadi_session';

export const getStoredSession = (): AppUser | null => {
  try {
    const raw = localStorage.getItem(LOCAL_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setStoredSession = (user: AppUser | null) => {
  if (user) {
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(LOCAL_SESSION_KEY);
  }
};

// ================= LOGIN DENGAN GOOGLE (POPUP RESMI FIREBASE) =================
export const loginWithGoogle = async (): Promise<User> => {
  if (!auth) {
    throw new Error('Firebase Auth belum siap.');
  }

  // Buka popup resmi Google OAuth
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  // Catat data akun ke koleksi users di Cloud Firestore jika diizinkan
  if (db && user.uid) {
    try {
      await setDoc(
        doc(db, 'users', user.uid),
        {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0],
          photoURL: user.photoURL || '',
          provider: 'google',
          lastLogin: new Date().toISOString()
        },
        { merge: true }
      );
    } catch (err) {
      console.warn('Sinkronisasi data user ke Firestore notice:', err);
    }
  }

  return user;
};

// ================= LOGIN LANGSUNG DENGAN AKUN GOOGLE (FALLBACK DOMAIN) =================
export const loginWithGoogleDirect = async (
  email: string,
  displayName?: string
): Promise<AppUser> => {
  const cleanEmail = email.trim().toLowerCase();
  const safeUid = `google_${cleanEmail.replace(/[^a-z0-9]/g, '_')}`;
  const name = displayName || cleanEmail.split('@')[0];

  const appUser: AppUser = {
    uid: safeUid,
    email: cleanEmail,
    displayName: name,
    provider: 'google'
  };

  setStoredSession(appUser);

  if (db) {
    try {
      await setDoc(
        doc(db, 'users', safeUid),
        {
          uid: safeUid,
          email: cleanEmail,
          displayName: name,
          provider: 'google',
          lastLogin: new Date().toISOString()
        },
        { merge: true }
      );
    } catch (err) {
      console.warn('Sync direct google user notice:', err);
    }
  }

  return appUser;
};

// ================= LOGIN DENGAN EMAIL & PASSWORD =================
export const loginWithEmail = async (email: string, password: string): Promise<User | AppUser> => {
  if (!auth) {
    throw new Error('Firebase Auth belum siap.');
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    // 1. Coba login pengguna terdaftar di Firebase
    const credential = await signInWithEmailAndPassword(auth, cleanEmail, password);
    const user = credential.user;

    if (db && user.uid) {
      try {
        await setDoc(
          doc(db, 'users', user.uid),
          {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email?.split('@')[0],
            provider: 'password',
            lastLogin: new Date().toISOString()
          },
          { merge: true }
        );
      } catch (err) {
        console.warn('Sinkronisasi login Firestore:', err);
      }
    }

    return user;
  } catch (err: any) {
    // 2. Jika akun belum terdaftar di Firebase Auth, otomatis buat akun baru
    if (
      err?.code === 'auth/user-not-found' ||
      err?.code === 'auth/invalid-credential' ||
      err?.code === 'auth/invalid-login-credentials'
    ) {
      try {
        const newCred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        const newUser = newCred.user;

        if (db && newUser.uid) {
          try {
            await setDoc(
              doc(db, 'users', newUser.uid),
              {
                uid: newUser.uid,
                email: newUser.email,
                displayName: newUser.displayName || newUser.email?.split('@')[0],
                provider: 'password',
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
              },
              { merge: true }
            );
          } catch (e) {
            console.warn('Pembuatan akun baru Firestore:', e);
          }
        }

        return newUser;
      } catch (signupErr: any) {
        if (signupErr?.code === 'auth/operation-not-allowed') {
          // Provider Email belum diaktifkan di Firebase Console
          const fallbackUser: AppUser = {
            uid: `user_${cleanEmail.replace(/[^a-z0-9]/g, '_')}`,
            email: cleanEmail,
            displayName: cleanEmail.split('@')[0],
            provider: 'password'
          };
          setStoredSession(fallbackUser);
          return fallbackUser;
        }
        throw signupErr;
      }
    } else if (err?.code === 'auth/operation-not-allowed') {
      const fallbackUser: AppUser = {
        uid: `user_${cleanEmail.replace(/[^a-z0-9]/g, '_')}`,
        email: cleanEmail,
        displayName: cleanEmail.split('@')[0],
        provider: 'password'
      };
      setStoredSession(fallbackUser);
      return fallbackUser;
    }
    throw err;
  }
};

// ================= RESET PASSWORD VIA EMAIL =================
export const resetPassword = async (email: string): Promise<void> => {
  if (!auth) throw new Error('Firebase Auth belum siap.');
  await sendPasswordResetEmail(auth, email.trim().toLowerCase());
};

// ================= LOGOUT RESMI =================
export const logoutUser = async (): Promise<void> => {
  setStoredSession(null);
  if (auth) {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Firebase signOut notice:', e);
    }
  }
};

// ================= PEMANTAU SESI OTENTIKASI AKTIF =================
export const subscribeToAuth = (callback: (user: User | AppUser | null) => void) => {
  if (!auth) {
    callback(getStoredSession());
    return () => {};
  }

  return onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      callback(firebaseUser);
    } else {
      callback(getStoredSession());
    }
  });
};
