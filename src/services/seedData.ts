import { PersonalProfile, PersonalDocument, DocumentFolder } from '../types';

export const defaultProfile: PersonalProfile = {
  fullName: "Muhammad",
  nik: "3201011504980002",
  noKk: "3201012809150001",
  birthPlace: "Jakarta",
  birthDate: "1998-04-15",
  gender: "Laki-Laki",
  address: "Jl. Merdeka Raya No. 45",
  rtRw: "004/002",
  kelurahan: "Cilendek Barat",
  kecamatan: "Bogor Barat",
  city: "Kota Bogor",
  province: "Jawa Barat",
  postalCode: "16112",
  religion: "Islam",
  maritalStatus: "Belum Kawin",
  bloodType: "O",
  occupation: "Karyawan Swasta / Software Engineer",
  phone: "+62 812-3456-7890",
  email: "muhammad0413.coder@gmail.com",
  avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
  updatedAt: new Date().toISOString()
};

// ================= FOLDER BAWAAN (BISA DITAMBAH SENDIRI OLEH PENGGUNA) =================
export const defaultFolders: DocumentFolder[] = [
  {
    id: 'folder-ijazah',
    name: 'Ijazah & Pendidikan',
    description: 'Arsip Ijazah resmi dari SD, SMP, SMA, S1, S2 hingga S3',
    color: 'blue',
    createdAt: '2024-01-01'
  },
  {
    id: 'folder-kependudukan',
    name: 'Kependudukan & Keluarga',
    description: 'KTP Elektronik, Kartu Keluarga (KK), dan Akta Kelahiran',
    color: 'emerald',
    createdAt: '2024-01-02'
  },
  {
    id: 'folder-lisensi',
    name: 'Lisensi & Identitas',
    description: 'Surat Izin Mengemudi (SIM) dan Paspor Internasional',
    color: 'amber',
    createdAt: '2024-01-03'
  },
  {
    id: 'folder-pajak',
    name: 'Pajak & Finansial',
    description: 'Kartu NPWP Elektronik dan BPJS Kesehatan',
    color: 'purple',
    createdAt: '2024-01-04'
  }
];

// ================= DOKUMEN DALAM FOLDER =================
export const defaultDocuments: PersonalDocument[] = [
  // --- FOLDER: IJAZAH & PENDIDIKAN (SD SAMPAI S3) ---
  {
    id: 'doc-ijazah-sd',
    folderId: 'folder-ijazah',
    title: 'Ijazah SD (Sekolah Dasar)',
    docNumber: 'DN-01/D-SD/06/0012891',
    category: 'Pendidikan',
    fileUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=1000&q=80',
    fileName: 'Ijazah_SD_Negeri_01.pdf',
    fileType: 'pdf',
    fileSize: '1.8 MB',
    issueDate: '2010-06-20',
    expiryDate: 'Seumur Hidup',
    status: 'Terverifikasi',
    notes: 'Ijazah kelulusan SD Negeri 01.',
    uploadedAt: '2024-01-05'
  },
  {
    id: 'doc-ijazah-smp',
    folderId: 'folder-ijazah',
    title: 'Ijazah SMP (Sekolah Menengah Pertama)',
    docNumber: 'DN-01/D-SMP/09/0045123',
    category: 'Pendidikan',
    fileUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1000&q=80',
    fileName: 'Ijazah_SMP_Negeri_1.pdf',
    fileType: 'pdf',
    fileSize: '2.1 MB',
    issueDate: '2013-06-18',
    expiryDate: 'Seumur Hidup',
    status: 'Terverifikasi',
    notes: 'Ijazah kelulusan SMP Negeri 1.',
    uploadedAt: '2024-01-06'
  },
  {
    id: 'doc-ijazah-sma',
    folderId: 'folder-ijazah',
    title: 'Ijazah SMA (Sekolah Menengah Atas / SMK)',
    docNumber: 'DN-01/M-SMA/12/0089201',
    category: 'Pendidikan',
    fileUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1000&q=80',
    fileName: 'Ijazah_SMA_Negeri_1_IPA.pdf',
    fileType: 'pdf',
    fileSize: '2.4 MB',
    issueDate: '2016-05-15',
    expiryDate: 'Seumur Hidup',
    status: 'Terverifikasi',
    notes: 'Ijazah Jurusan IPA SMAN 1.',
    uploadedAt: '2024-01-07'
  },
  {
    id: 'doc-ijazah-s1',
    folderId: 'folder-ijazah',
    title: 'Ijazah & Transkrip Sarjana (S1)',
    docNumber: 'IJZ-S1-2020-098821',
    category: 'Pendidikan',
    fileUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80',
    fileName: 'Ijazah_S1_Teknik_Informatika.pdf',
    fileType: 'pdf',
    fileSize: '3.4 MB',
    issueDate: '2020-09-18',
    expiryDate: 'Seumur Hidup',
    status: 'Terverifikasi',
    notes: 'Sarjana Komputer (S.Kom), Teknik Informatika.',
    uploadedAt: '2024-01-08'
  },
  {
    id: 'doc-ijazah-s2',
    folderId: 'folder-ijazah',
    title: 'Ijazah & Transkrip Magister (S2)',
    docNumber: 'IJZ-S2-2022-019284',
    category: 'Pendidikan',
    fileUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=1000&q=80',
    fileName: 'Ijazah_S2_Sistem_Informasi.pdf',
    fileType: 'pdf',
    fileSize: '3.6 MB',
    issueDate: '2022-10-10',
    expiryDate: 'Seumur Hidup',
    status: 'Terverifikasi',
    notes: 'Magister Komputer (M.Kom), Sistem Informasi.',
    uploadedAt: '2024-01-09'
  },
  {
    id: 'doc-ijazah-s3',
    folderId: 'folder-ijazah',
    title: 'Ijazah Doktor (S3)',
    docNumber: 'IJZ-S3-2025-004129',
    category: 'Pendidikan',
    fileUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80',
    fileName: 'Ijazah_S3_Doktor_Ilmu_Komputer.pdf',
    fileType: 'pdf',
    fileSize: '4.2 MB',
    issueDate: '2025-08-20',
    expiryDate: 'Seumur Hidup',
    status: 'Terverifikasi',
    notes: 'Doktor Ilmu Komputer (Dr.).',
    uploadedAt: '2024-01-10'
  },

  // --- FOLDER: KEPENDUDUKAN & KELUARGA ---
  {
    id: 'doc-ktp',
    folderId: 'folder-kependudukan',
    title: 'KTP Elektronik (e-KTP)',
    docNumber: '3201011504980002',
    category: 'Kependudukan',
    fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1000&q=80',
    fileName: 'KTP_Elektronik_Muhammad.jpg',
    fileType: 'image',
    fileSize: '1.4 MB',
    issueDate: '2016-04-20',
    expiryDate: 'Seumur Hidup',
    status: 'Terverifikasi',
    notes: 'KTP Asli terdaftar di Dukcapil Kota Bogor.',
    uploadedAt: '2024-01-11'
  },
  {
    id: 'doc-kk',
    folderId: 'folder-kependudukan',
    title: 'Kartu Keluarga (KK)',
    docNumber: '3201012809150001',
    category: 'Kependudukan',
    fileUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=1000&q=80',
    fileName: 'Kartu_Keluarga_2024.pdf',
    fileType: 'pdf',
    fileSize: '2.8 MB',
    issueDate: '2022-08-15',
    expiryDate: 'Tidak Terbatas',
    status: 'Terverifikasi',
    notes: 'Barcode digital TTE Disdukcapil.',
    uploadedAt: '2024-01-12'
  },
  {
    id: 'doc-akta',
    folderId: 'folder-kependudukan',
    title: 'Akta Kelahiran',
    docNumber: '3201-LT-15041998-0012',
    category: 'Kependudukan',
    fileUrl: 'https://images.unsplash.com/photo-1554415707-9e49017aed81?auto=format&fit=crop&w=1000&q=80',
    fileName: 'Akta_Kelahiran_Kutipan.pdf',
    fileType: 'pdf',
    fileSize: '1.9 MB',
    issueDate: '1998-05-02',
    expiryDate: 'Seumur Hidup',
    status: 'Terverifikasi',
    notes: 'Kutipan Akta Kelahiran resmi Disdukcapil.',
    uploadedAt: '2024-01-13'
  },

  // --- FOLDER: LISENSI & IDENTITAS ---
  {
    id: 'doc-sim',
    folderId: 'folder-lisensi',
    title: 'SIM A (Surat Izin Mengemudi)',
    docNumber: '980415320101',
    category: 'Lisensi & Kendaraan',
    fileUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80',
    fileName: 'SIM_A_Polres_Bogor.jpg',
    fileType: 'image',
    fileSize: '1.2 MB',
    issueDate: '2021-04-15',
    expiryDate: '2026-04-15',
    status: 'Terverifikasi',
    notes: 'Berlaku hingga April 2026.',
    uploadedAt: '2024-01-14'
  },
  {
    id: 'doc-paspor',
    folderId: 'folder-lisensi',
    title: 'Paspor Republik Indonesia',
    docNumber: 'C8912401',
    category: 'Kependudukan',
    fileUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80',
    fileName: 'Paspor_RI_48H.pdf',
    fileType: 'pdf',
    fileSize: '4.1 MB',
    issueDate: '2019-08-10',
    expiryDate: '2024-08-10',
    status: 'Perlu Pembaruan',
    notes: 'Masa berlaku telah mendekati/habis.',
    uploadedAt: '2024-01-15'
  },

  // --- FOLDER: PAJAK & FINANSIAL ---
  {
    id: 'doc-npwp',
    folderId: 'folder-pajak',
    title: 'Kartu NPWP Elektronik',
    docNumber: '82.491.502.8-404.000',
    category: 'Finansial & Pajak',
    fileUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1000&q=80',
    fileName: 'Kartu_NPWP_Digital.pdf',
    fileType: 'pdf',
    fileSize: '850 KB',
    issueDate: '2020-11-05',
    expiryDate: 'Seumur Hidup',
    status: 'Terverifikasi',
    notes: 'KPP Pratama Bogor. Terintegrasi NIK 16 digit.',
    uploadedAt: '2024-01-16'
  },
  {
    id: 'doc-bpjs',
    folderId: 'folder-pajak',
    title: 'Kartu BPJS Kesehatan',
    docNumber: '0002194857201',
    category: 'Kesehatan & Kerja',
    fileUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80',
    fileName: 'BPJS_Kesehatan_Digital.pdf',
    fileType: 'pdf',
    fileSize: '720 KB',
    issueDate: '2019-01-10',
    expiryDate: 'Aktif',
    status: 'Terverifikasi',
    notes: 'Faskes Tingkat I Puskesmas Bogor Barat.',
    uploadedAt: '2024-01-17'
  }
];
