import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  loginWithEmail,
  loginWithGoogle,
  loginWithGoogleDirect,
  logoutUser,
  resetPassword,
  subscribeToAuth,
  AppUser
} from '../services/auth';

interface AuthContextType {
  currentUser: User | AppUser | null;
  loading: boolean;
  loginEmail: (email: string, pass: string) => Promise<void>;
  loginGoogle: () => Promise<void>;
  loginGoogleDirect: (email: string, displayName?: string) => Promise<void>;
  resetUserPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | AppUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Sinkronkan status autentikasi langsung dengan Firebase Auth
    const unsubscribe = subscribeToAuth((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginEmailAction = async (email: string, pass: string) => {
    // Jangan toggle global loading agar halaman Login tidak unmount dan mereset state error
    const user = await loginWithEmail(email, pass);
    setCurrentUser(user);
  };

  const loginGoogleAction = async () => {
    // Jangan toggle global loading agar halaman Login tidak unmount
    const user = await loginWithGoogle();
    setCurrentUser(user);
  };

  const loginGoogleDirectAction = async (email: string, displayName?: string) => {
    const user = await loginWithGoogleDirect(email, displayName);
    setCurrentUser(user);
  };

  const resetUserPasswordAction = async (email: string) => {
    await resetPassword(email);
  };

  const logoutAction = async () => {
    await logoutUser();
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        loginEmail: loginEmailAction,
        loginGoogle: loginGoogleAction,
        loginGoogleDirect: loginGoogleDirectAction,
        resetUserPassword: resetUserPasswordAction,
        logout: logoutAction,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
