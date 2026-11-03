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
import { PersonalProfile, PersonalDocument } from '../types';
import { defaultProfile, defaultDocuments } from './seedData';

const CACHE_KEYS = {
  PROFILE: 'cache_data_pribadi_profile',
  DOCUMENTS: 'cache_data_pribadi_documents'
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

// ================= PERSONAL PROFILE =================
export const getPersonalProfile = async (): Promise<PersonalProfile> => {
  if (isFirebaseConfigured() && db) {
    try {
      const snap = await getDoc(doc(db, 'personal_profile', 'main'));
      if (snap.exists()) {
        const data = snap.data() as PersonalProfile;
        setCached(CACHE_KEYS.PROFILE, data);
        return data;
      }
    } catch (err) {
      console.warn('Firestore profile notice:', err);
    }
  }
  return getCached(CACHE_KEYS.PROFILE, defaultProfile);
};

export const updatePersonalProfile = async (data: Partial<PersonalProfile>): Promise<void> => {
  const current = await getPersonalProfile();
  const updated: PersonalProfile = {
    ...current,
    ...data,
    updatedAt: new Date().toISOString()
  };
  setCached(CACHE_KEYS.PROFILE, updated);

  if (isFirebaseConfigured() && db) {
    await setDoc(doc(db, 'personal_profile', 'main'), updated, { merge: true });
  }
};

// ================= PERSONAL DOCUMENTS (KTP, KK, AKTA, DLL) =================
export const getPersonalDocuments = async (): Promise<PersonalDocument[]> => {
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(collection(db, 'personal_documents'), orderBy('uploadedAt', 'desc'));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const list: PersonalDocument[] = [];
        snap.forEach((d) => list.push({ ...d.data(), id: d.id } as PersonalDocument));
        setCached(CACHE_KEYS.DOCUMENTS, list);
        return list;
      }
    } catch (err) {
      console.warn('Firestore documents notice:', err);
    }
  }
  return getCached(CACHE_KEYS.DOCUMENTS, defaultDocuments);
};

export const savePersonalDocument = async (
  docData: Omit<PersonalDocument, 'id'> & { id?: string }
): Promise<string> => {
  let list = await getPersonalDocuments();
  let id = docData.id;

  if (id) {
    list = list.map((d) => (d.id === id ? ({ ...d, ...docData } as PersonalDocument) : d));
  } else {
    id = `doc-${Date.now()}`;
    list.unshift({ ...docData, id } as PersonalDocument);
  }
  setCached(CACHE_KEYS.DOCUMENTS, list);

  if (isFirebaseConfigured() && db) {
    const docRef = doc(db, 'personal_documents', id);
    await setDoc(docRef, { ...docData, id }, { merge: true });
  }
  return id;
};

export const deletePersonalDocument = async (id: string): Promise<void> => {
  const list = (await getPersonalDocuments()).filter((d) => d.id !== id);
  setCached(CACHE_KEYS.DOCUMENTS, list);

  if (isFirebaseConfigured() && db) {
    await deleteDoc(doc(db, 'personal_documents', id));
  }
};

// ================= 1-CLICK SEED PERSONAL DATA TO FIRESTORE =================
export const seedPersonalDataToFirestore = async (): Promise<{ success: boolean; message: string }> => {
  if (!isFirebaseConfigured() || !db) {
    return {
      success: false,
      message: 'Kredensial Firebase belum terkonfigurasi. Masukkan kredensial di .env.'
    };
  }

  try {
    // 1. Simpan Profil Pribadi
    await setDoc(doc(db, 'personal_profile', 'main'), defaultProfile, { merge: true });

    // 2. Simpan Seluruh Dokumen Awal (KTP, KK, Ijazah, SIM, NPWP, BPJS, dll.)
    for (const d of defaultDocuments) {
      await setDoc(doc(db, 'personal_documents', d.id), d, { merge: true });
    }

    return {
      success: true,
      message: 'Seluruh arsip data pribadi & dokumen (KTP, KK, Ijazah, SIM, NPWP) berhasil disinkronkan ke Cloud Firestore!'
    };
  } catch (error: any) {
    console.error('Error seeding data:', error);
    return {
      success: false,
      message: `Gagal menyinkronkan: ${error?.message || 'Error tidak diketahui'}`
    };
  }
};
