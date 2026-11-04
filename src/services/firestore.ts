import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { PersonalProfile, PersonalDocument, DocumentFolder } from '../types';
import { defaultProfile, defaultDocuments, defaultFolders } from './seedData';

const getCacheKey = (type: 'profile' | 'documents' | 'folders', userId: string) => {
  return `cache_data_pribadi_${type}_${userId || 'default'}`;
};

const getCached = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const setCached = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage notice:', e);
  }
};

// ================= PERSONAL PROFILE (ISOLATED PER USER) =================
export const getPersonalProfile = async (
  userId: string,
  userDisplayName?: string | null,
  userEmail?: string | null
): Promise<PersonalProfile> => {
  const fallback: PersonalProfile = {
    ...defaultProfile,
    userId,
    fullName: userDisplayName || defaultProfile.fullName,
    email: userEmail || defaultProfile.email,
  };

  if (isFirebaseConfigured() && db && userId) {
    try {
      const snap = await getDoc(doc(db, 'users', userId, 'profile', 'main'));
      if (snap.exists()) {
        const data = snap.data() as PersonalProfile;
        setCached(getCacheKey('profile', userId), data);
        return data;
      } else {
        await setDoc(doc(db, 'users', userId, 'profile', 'main'), fallback);
        setCached(getCacheKey('profile', userId), fallback);
        return fallback;
      }
    } catch (err) {
      console.warn('Firestore profile fetch error, fallback to cache:', err);
    }
  }

  return getCached(getCacheKey('profile', userId), fallback);
};

export const updatePersonalProfile = async (
  userId: string,
  data: Partial<PersonalProfile>
): Promise<void> => {
  const current = await getPersonalProfile(userId);
  const updated: PersonalProfile = {
    ...current,
    ...data,
    userId,
    updatedAt: new Date().toISOString()
  };

  setCached(getCacheKey('profile', userId), updated);

  if (isFirebaseConfigured() && db && userId) {
    try {
      await setDoc(doc(db, 'users', userId, 'profile', 'main'), updated, { merge: true });
    } catch (e) {
      console.warn('Update profile Firestore notice:', e);
    }
  }
};

// ================= FOLDERS SYSTEM (PENGGUNA BISA MEMBUAT FOLDER SENDIRI) =================
export const getPersonalFolders = async (userId: string): Promise<DocumentFolder[]> => {
  const initialFolders: DocumentFolder[] = defaultFolders.map((f) => ({
    ...f,
    id: `${f.id}-${userId}`,
    userId
  }));

  if (isFirebaseConfigured() && db && userId) {
    try {
      const foldersRef = collection(db, 'users', userId, 'folders');
      const q = query(foldersRef, orderBy('createdAt', 'asc'));
      const snap = await getDocs(q);

      if (!snap.empty) {
        const list: DocumentFolder[] = [];
        snap.forEach((d) => list.push({ ...d.data(), id: d.id, userId } as DocumentFolder));
        setCached(getCacheKey('folders', userId), list);
        return list;
      } else {
        for (const f of initialFolders) {
          await setDoc(doc(db, 'users', userId, 'folders', f.id), f);
        }
        setCached(getCacheKey('folders', userId), initialFolders);
        return initialFolders;
      }
    } catch (err) {
      console.warn('Firestore folders fetch notice, using cache:', err);
    }
  }

  return getCached(getCacheKey('folders', userId), initialFolders);
};

export const savePersonalFolder = async (
  userId: string,
  folderData: { id?: string; name: string; description?: string; color?: string }
): Promise<string> => {
  let list = await getPersonalFolders(userId);
  let id = folderData.id;

  if (id) {
    list = list.map((f) => (f.id === id ? { ...f, ...folderData } : f));
  } else {
    id = `folder-${Date.now()}`;
    const newFolder: DocumentFolder = {
      id,
      userId,
      name: folderData.name,
      description: folderData.description || '',
      color: folderData.color || 'blue',
      createdAt: new Date().toISOString()
    };
    list.push(newFolder);
  }

  setCached(getCacheKey('folders', userId), list);

  if (isFirebaseConfigured() && db && userId) {
    try {
      const docRef = doc(db, 'users', userId, 'folders', id);
      await setDoc(docRef, { ...folderData, id, userId }, { merge: true });
    } catch (e) {
      console.warn('Firestore folder save notice:', e);
    }
  }

  return id;
};

export const deletePersonalFolder = async (userId: string, folderId: string): Promise<void> => {
  const list = (await getPersonalFolders(userId)).filter((f) => f.id !== folderId);
  setCached(getCacheKey('folders', userId), list);

  if (isFirebaseConfigured() && db && userId) {
    try {
      await deleteDoc(doc(db, 'users', userId, 'folders', folderId));
    } catch (e) {
      console.warn('Firestore folder delete notice:', e);
    }
  }
};

// ================= PERSONAL DOCUMENTS (ISOLATED PER USER) =================
export const getPersonalDocuments = async (userId: string): Promise<PersonalDocument[]> => {
  const initialDocs: PersonalDocument[] = defaultDocuments.map((d) => ({
    ...d,
    id: `${d.id}-${userId}`,
    folderId: d.folderId ? `${d.folderId}-${userId}` : undefined,
    userId
  }));

  if (isFirebaseConfigured() && db && userId) {
    try {
      const docsRef = collection(db, 'users', userId, 'documents');
      const q = query(docsRef, orderBy('uploadedAt', 'desc'));
      const snap = await getDocs(q);

      if (!snap.empty) {
        const list: PersonalDocument[] = [];
        snap.forEach((d) => list.push({ ...d.data(), id: d.id, userId } as PersonalDocument));
        setCached(getCacheKey('documents', userId), list);
        return list;
      } else {
        for (const d of initialDocs) {
          await setDoc(doc(db, 'users', userId, 'documents', d.id), d);
        }
        setCached(getCacheKey('documents', userId), initialDocs);
        return initialDocs;
      }
    } catch (err) {
      console.warn('Firestore documents fetch notice, using cache:', err);
    }
  }

  return getCached(getCacheKey('documents', userId), initialDocs);
};

export const savePersonalDocument = async (
  userId: string,
  docData: Omit<PersonalDocument, 'id'> & { id?: string }
): Promise<string> => {
  let list = await getPersonalDocuments(userId);
  let id = docData.id;

  if (id) {
    list = list.map((d) => (d.id === id ? ({ ...d, ...docData, userId } as PersonalDocument) : d));
  } else {
    id = `doc-${Date.now()}`;
    list.unshift({ ...docData, id, userId } as PersonalDocument);
  }

  setCached(getCacheKey('documents', userId), list);

  if (isFirebaseConfigured() && db && userId) {
    try {
      const docRef = doc(db, 'users', userId, 'documents', id);
      await setDoc(docRef, { ...docData, id, userId }, { merge: true });
    } catch (e) {
      console.warn('Firestore save notice:', e);
    }
  }

  return id;
};

export const deletePersonalDocument = async (userId: string, id: string): Promise<void> => {
  const list = (await getPersonalDocuments(userId)).filter((d) => d.id !== id);
  setCached(getCacheKey('documents', userId), list);

  if (isFirebaseConfigured() && db && userId) {
    try {
      await deleteDoc(doc(db, 'users', userId, 'documents', id));
    } catch (e) {
      console.warn('Firestore delete notice:', e);
    }
  }
};

// ================= 1-CLICK SEED PERSONAL DATA TO FIRESTORE =================
export const seedPersonalDataToFirestore = async (
  userId: string,
  displayName?: string | null,
  email?: string | null
): Promise<{ success: boolean; message: string }> => {
  if (!isFirebaseConfigured() || !db) {
    return {
      success: false,
      message: 'Kredensial Firebase belum terkonfigurasi. Periksa file .env.'
    };
  }

  try {
    const targetProfile: PersonalProfile = {
      ...defaultProfile,
      userId,
      fullName: displayName || defaultProfile.fullName,
      email: email || defaultProfile.email,
    };

    // 1. Simpan Profil Pribadi di users/{userId}/profile/main
    await setDoc(doc(db, 'users', userId, 'profile', 'main'), targetProfile, { merge: true });

    // 2. Simpan Folder Awal di users/{userId}/folders/{folderId}
    for (const f of defaultFolders) {
      const folderWithUser: DocumentFolder = {
        ...f,
        id: `${f.id}-${userId}`,
        userId
      };
      await setDoc(doc(db, 'users', userId, 'folders', folderWithUser.id), folderWithUser, { merge: true });
    }

    // 3. Simpan Dokumen Awal di users/{userId}/documents/{docId}
    for (const d of defaultDocuments) {
      const docWithUser: PersonalDocument = {
        ...d,
        id: `${d.id}-${userId}`,
        folderId: d.folderId ? `${d.folderId}-${userId}` : undefined,
        userId
      };
      await setDoc(doc(db, 'users', userId, 'documents', docWithUser.id), docWithUser, { merge: true });
    }

    return {
      success: true,
      message: `Data pribadi & folder akun (${email || displayName || userId}) berhasil disinkronkan ke Cloud Firestore!`
    };
  } catch (error: any) {
    console.error('Error seeding data:', error);
    return {
      success: false,
      message: error?.message || 'Gagal menyimpan ke Firestore.'
    };
  }
};
