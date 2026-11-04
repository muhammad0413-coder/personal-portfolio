import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PersonalProfile, PersonalDocument, DocumentFolder } from '../types';
import {
  getPersonalProfile,
  getPersonalDocuments,
  getPersonalFolders,
  savePersonalFolder,
  deletePersonalFolder,
  updatePersonalProfile as updateProfileApi,
  savePersonalDocument as saveDocApi,
  deletePersonalDocument as deleteDocApi,
  seedPersonalDataToFirestore
} from '../services/firestore';
import { defaultProfile, defaultDocuments, defaultFolders } from '../services/seedData';
import { useAuth } from './AuthContext';

interface DataContextType {
  profile: PersonalProfile;
  documents: PersonalDocument[];
  folders: DocumentFolder[];
  loading: boolean;
  refreshData: () => Promise<void>;
  updateProfile: (data: Partial<PersonalProfile>) => Promise<void>;
  saveDocument: (docData: Omit<PersonalDocument, 'id'> & { id?: string }) => Promise<string>;
  deleteDocument: (id: string) => Promise<void>;
  createFolder: (name: string, description?: string, color?: string) => Promise<string>;
  deleteFolder: (folderId: string) => Promise<void>;
  seedDatabase: () => Promise<{ success: boolean; message: string }>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const userId = currentUser?.uid || 'guest_user';
  const displayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Pengguna';
  const email = currentUser?.email || 'user@example.com';

  const [profile, setProfile] = useState<PersonalProfile>(() => ({
    ...defaultProfile,
    userId,
    fullName: displayName,
    email
  }));
  const [documents, setDocuments] = useState<PersonalDocument[]>([]);
  const [folders, setFolders] = useState<DocumentFolder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshData = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [prof, docs, fldrs] = await Promise.all([
        getPersonalProfile(userId, displayName, email),
        getPersonalDocuments(userId),
        getPersonalFolders(userId)
      ]);
      setProfile(prof);
      setDocuments(docs);
      setFolders(fldrs);
    } catch (err) {
      console.warn('Error loading personal data & folders:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, displayName, email]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const updateProfile = async (data: Partial<PersonalProfile>) => {
    await updateProfileApi(userId, data);
    setProfile((prev) => ({ ...prev, ...data }));
  };

  const saveDocument = async (docData: Omit<PersonalDocument, 'id'> & { id?: string }) => {
    const id = await saveDocApi(userId, docData);
    await refreshData();
    return id;
  };

  const deleteDocument = async (id: string) => {
    await deleteDocApi(userId, id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const createFolder = async (name: string, description?: string, color?: string) => {
    const id = await savePersonalFolder(userId, { name, description, color });
    await refreshData();
    return id;
  };

  const deleteFolder = async (folderId: string) => {
    await deletePersonalFolder(userId, folderId);
    setFolders((prev) => prev.filter((f) => f.id !== folderId));
  };

  const seedDatabase = async () => {
    const res = await seedPersonalDataToFirestore(userId, displayName, email);
    if (res.success) {
      await refreshData();
    }
    return res;
  };

  return (
    <DataContext.Provider
      value={{
        profile,
        documents,
        folders,
        loading,
        refreshData,
        updateProfile,
        saveDocument,
        deleteDocument,
        createFolder,
        deleteFolder,
        seedDatabase,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
