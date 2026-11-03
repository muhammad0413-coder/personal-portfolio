import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PersonalProfile, PersonalDocument } from '../types';
import {
  getPersonalProfile,
  getPersonalDocuments,
  updatePersonalProfile as updateProfileApi,
  savePersonalDocument as saveDocApi,
  deletePersonalDocument as deleteDocApi,
  seedPersonalDataToFirestore
} from '../services/firestore';
import { defaultProfile, defaultDocuments } from '../services/seedData';

interface DataContextType {
  profile: PersonalProfile;
  documents: PersonalDocument[];
  loading: boolean;
  refreshData: () => Promise<void>;
  updateProfile: (data: Partial<PersonalProfile>) => Promise<void>;
  saveDocument: (docData: Omit<PersonalDocument, 'id'> & { id?: string }) => Promise<string>;
  deleteDocument: (id: string) => Promise<void>;
  seedDatabase: () => Promise<{ success: boolean; message: string }>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<PersonalProfile>(defaultProfile);
  const [documents, setDocuments] = useState<PersonalDocument[]>(defaultDocuments);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshData = useCallback(async () => {
    try {
      const [prof, docs] = await Promise.all([
        getPersonalProfile(),
        getPersonalDocuments()
      ]);
      setProfile(prof);
      setDocuments(docs);
    } catch (err) {
      console.warn('Error loading personal data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const updateProfile = async (data: Partial<PersonalProfile>) => {
    await updateProfileApi(data);
    setProfile((prev) => ({ ...prev, ...data }));
  };

  const saveDocument = async (docData: Omit<PersonalDocument, 'id'> & { id?: string }) => {
    const id = await saveDocApi(docData);
    await refreshData();
    return id;
  };

  const deleteDocument = async (id: string) => {
    await deleteDocApi(id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const seedDatabase = async () => {
    const res = await seedPersonalDataToFirestore();
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
        loading,
        refreshData,
        updateProfile,
        saveDocument,
        deleteDocument,
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
