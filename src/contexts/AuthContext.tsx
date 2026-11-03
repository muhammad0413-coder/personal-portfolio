import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  loginWithEmail,
  loginWithGoogle,
  logoutUser,
  resetPassword,
  subscribeToAuth
} from '../services/auth';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  loginEmail: (email: string, pass: string) => Promise<void>;
  loginGoogle: () => Promise<void>;
  resetUserPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
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
    setLoading(true);
    try {
      const user = await loginWithEmail(email, pass);
      setCurrentUser(user);
    } finally {
      setLoading(false);
    }
  };

  const loginGoogleAction = async () => {
    setLoading(true);
    try {
      const user = await loginWithGoogle();
      setCurrentUser(user);
    } finally {
      setLoading(false);
    }
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
