import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  loginWithEmail,
  loginWithGoogle,
  logoutAdmin,
  resetPassword,
  subscribeToAuth,
  checkIsUserAdmin
} from '../services/auth';
import { AdminUser } from '../types';

interface AuthContextType {
  currentUser: User | AdminUser | null;
  isAdmin: boolean;
  loading: boolean;
  loginEmail: (email: string, pass: string) => Promise<void>;
  loginGoogle: () => Promise<void>;
  resetUserPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | AdminUser | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuth(async (user) => {
      setCurrentUser(user);
      if (user) {
        if ('role' in user && user.role === 'admin') {
          setIsAdmin(true);
        } else {
          const hasAdminRole = await checkIsUserAdmin(user as User);
          setIsAdmin(hasAdminRole);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const user = await loginWithEmail(email, pass);
      setCurrentUser(user);
      setIsAdmin(true);
    } finally {
      setLoading(false);
    }
  };

  const loginGoogle = async () => {
    setLoading(true);
    try {
      const user = await loginWithGoogle();
      setCurrentUser(user);
      setIsAdmin(true);
    } finally {
      setLoading(false);
    }
  };

  const resetUserPassword = async (email: string) => {
    await resetPassword(email);
  };

  const logout = async () => {
    await logoutAdmin();
    setCurrentUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        loading,
        loginEmail,
        loginGoogle,
        resetUserPassword,
        logout,
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
