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

// ================= LOGIN DENGAN GOOGLE (POPUP RESMI FIREBASE) =================
export const loginWithGoogle = async (): Promise<User> => {
  if (!auth) {
    throw new Error('Firebase Auth belum siap.');
  }

  // Buka popup resmi Google OAuth
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  // Catat data akun ke koleksi users di Cloud Firestore
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
      console.warn('Sinkronisasi data user ke Firestore:', err);
    }
  }

  return user;
};

// ================= LOGIN DENGAN EMAIL & PASSWORD =================
export const loginWithEmail = async (email: string, password: string): Promise<User> => {
  if (!auth) {
    throw new Error('Firebase Auth belum siap.');
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    // 1. Coba login pengguna terdaftar
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
    // 2. Jika akun belum pernah dibuat di Firebase Auth, otomatis buatkan akun baru
    if (
      err?.code === 'auth/user-not-found' ||
      err?.code === 'auth/invalid-credential' ||
      err?.code === 'auth/invalid-login-credentials'
    ) {
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
  if (auth) {
    await signOut(auth);
  }
};

// ================= PEMANTAU SESI OTENTIKASI AKTIF =================
export const subscribeToAuth = (callback: (user: User | null) => void) => {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};
