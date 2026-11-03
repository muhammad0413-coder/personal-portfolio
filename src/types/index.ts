// TypeScript definitions for Sistem Informasi & Manajemen Data Pribadi

export type DocumentCategory =
  | 'Kependudukan'
  | 'Pendidikan'
  | 'Finansial & Pajak'
  | 'Lisensi & Kendaraan'
  | 'Kesehatan & Kerja'
  | 'Lainnya';

export type DocumentStatus = 'Terverifikasi' | 'Menunggu' | 'Perlu Pembaruan';

export interface PersonalDocument {
  id: string;
  userId?: string;           // ID pemilik dokumen (terisolasi per akun Google)
  title: string;             // Contoh: "KTP Elektronik", "Kartu Keluarga (KK)"
  docNumber: string;         // Contoh: NIK "3201...", No. KK "3201..."
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
