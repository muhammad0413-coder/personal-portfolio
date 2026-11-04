// TypeScript definitions for Sistem Informasi & Manajemen Data Pribadi

export type DocumentCategory =
  | 'Kependudukan'
  | 'Pendidikan'
  | 'Finansial & Pajak'
  | 'Lisensi & Kendaraan'
  | 'Kesehatan & Kerja'
  | 'Lainnya';

export type DocumentStatus = 'Terverifikasi' | 'Menunggu' | 'Perlu Pembaruan';

// Model Folder Dokumen (Pengguna bisa membuat folder sendiri)
export interface DocumentFolder {
  id: string;
  userId?: string;
  name: string;             // Contoh: "Ijazah & Pendidikan", "Kependudukan", dll.
  description?: string;     // Contoh: "Arsip Ijazah dari SD, SMP, SMA, S1 sampai S3"
  color?: string;           // Warna folder: blue, amber, emerald, purple, rose
  icon?: string;
  createdAt: string;
}

export interface PersonalDocument {
  id: string;
  userId?: string;           // ID pemilik dokumen (terisolasi per akun Google)
  folderId?: string;         // ID folder tempat berkas berada (misal: 'folder-ijazah')
  title: string;             // Contoh: "Ijazah SD", "Ijazah S1", "KTP Elektronik"
  docNumber: string;         // Contoh: Nomor Ijazah, NIK, No. KK
  category: DocumentCategory;
  fileUrl: string;           // Base64 atau URL Firebase Storage
  fileName: string;
  fileType: 'image' | 'pdf' | 'document';
  fileSize: string;
  issueDate?: string;        // Tanggal terbit
  expiryDate?: string;       // Tanggal kedaluwarsa atau "Seumur Hidup"
  status: DocumentStatus;
  notes?: string;
  uploadedAt: string;
}

export interface PersonalProfile {
  id?: string;
  userId?: string;           // ID pemilik profil
  fullName: string;
  nik: string;
  noKk: string;
  birthPlace: string;
  birthDate: string;
  gender: 'Laki-Laki' | 'Perempuan';
  address: string;
  rtRw: string;
  kelurahan: string;
  kecamatan: string;
  city: string;
  province: string;
  postalCode: string;
  religion: string;
  maritalStatus: string;
  bloodType: string;
  occupation: string;
  phone: string;
  email: string;
  avatarUrl: string;
  updatedAt?: string;
}

export interface DocumentCategoryStat {
  category: DocumentCategory;
  count: number;
  percentage: number;
  color: string;
  completionRate: number;
}

export interface AdminUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'admin' | 'user';
  createdAt?: string;
}
