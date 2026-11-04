import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Upload,
  Download,
  Eye,
  Edit2,
  Trash2,
  Search,
  LogOut,
  FileText,
  FileCheck2,
  FolderOpen,
  LayoutGrid,
  List,
  Plus,
  Sparkles,
  ExternalLink,
  User as UserIcon,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { PersonalDocument, DocumentCategory } from '../types';
import { UploadModal } from '../components/dashboard/UploadModal';
import { PreviewModal } from '../components/dashboard/PreviewModal';
import { ProfileModal } from '../components/dashboard/ProfileModal';

export const DashboardPage: React.FC = () => {
  const { profile, documents, saveDocument, deleteDocument, updateProfile } = useData();
  const { currentUser, logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<PersonalDocument | null>(null);
  const [previewDoc, setPreviewDoc] = useState<PersonalDocument | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Kategori yang tersedia
  const categories: string[] = [
    'Semua',
    'Kependudukan',
    'Pendidikan',
    'Lisensi & Kendaraan',
    'Finansial & Pajak',
    'Kesehatan & Kerja'
  ];

  // Filter dokumen berdasarkan kategori & pencarian
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchCategory =
        selectedCategory === 'Semua' || doc.category === selectedCategory;
      const matchSearch =
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.docNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.fileName && doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [documents, selectedCategory, searchQuery]);

  // Statistik Sederhana
  const totalCount = documents.length;
  const kependudukanCount = documents.filter((d) => d.category === 'Kependudukan').length;
  const pendidikanCount = documents.filter((d) => d.category === 'Pendidikan').length;
  const lisensiCount = documents.filter((d) => d.category === 'Lisensi & Kendaraan').length;

  // Handler Download File
  const handleDownload = (doc: PersonalDocument) => {
    try {
      const link = document.createElement('a');
      link.href = doc.fileUrl;
      link.download = doc.fileName || `${doc.title.replace(/\s+/g, '_')}.jpg`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      window.open(doc.fileUrl, '_blank');
    }
  };

  const handleEdit = (doc: PersonalDocument) => {
    setEditingDoc(doc);
    setIsUploadOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus "${title}"?`)) {
      await deleteDocument(id);
    }
  };

  const displayName = currentUser?.displayName || profile?.fullName || 'Pengguna';
  const displayEmail = currentUser?.email || profile?.email || '';

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      
      {/* 1. TOP NAVBAR BERSIH & SIMPEL */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Judul */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-slate-900 text-base leading-tight tracking-tight">
                Arsip Data Pribadi
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                Penyimpanan Dokumen Resmi Aman
              </p>
            </div>
          </div>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition text-left cursor-pointer"
              title="Lihat Biodata Pribadi"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs border border-blue-200">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-slate-800 leading-tight">
                  {displayName}
                </p>
                <p className="text-[10px] text-slate-400 font-mono truncate max-w-[150px]">
                  {displayEmail}
                </p>
              </div>
            </button>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 text-xs font-semibold transition cursor-pointer"
              title="Keluar dari akun"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>

        </div>
      </nav>

      {/* 2. MAIN CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">

        {/* HERO SECTION DENGAN TOMBOL UNGGAH */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                <Sparkles className="w-3 h-3" /> Berkas Terenkripsi
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Selamat datang, {displayName} 👋
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
              Semua berkas KTP, KK, Ijazah, SIM, dan NPWP Anda tersimpan aman dan siap diunduh kembali ke perangkat Anda kapan saja.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingDoc(null);
              setIsUploadOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Unggah Dokumen Baru</span>
          </button>
        </div>

        {/* RINGKASAN STATISTIK SIMPEL (3 KARTU SAJA) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <FolderOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Total Berkas Tersimpan</p>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">{totalCount} Dokumen</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Kependudukan (KTP & KK)</p>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">{kependudukanCount} Berkas</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Ijazah & Lisensi</p>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">{pendidikanCount + lisensiCount} Berkas</h3>
            </div>
          </div>

        </div>

        {/* BAR PENCARIAN & FILTER KATEGORI */}
        <div className="space-y-3">
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Input Pencarian */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama berkas atau nomor NIK..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 shadow-2xs"
              />
            </div>

            {/* Toggle Tampilan Grid / List */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs self-end sm:self-auto">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-blue-50 text-blue-600 font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Tampilan Grid Kartu"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-blue-50 text-blue-600 font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Tampilan Tabel Rapi"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Kategori Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

        </div>

        {/* DAFTAR DOKUMEN: MODE KARTU (GRID) */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all hover:border-slate-300 flex flex-col justify-between gap-4 group"
              >
                {/* Bagian Atas Kartu: Thumbnail & Kategori */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                      {doc.category}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        doc.status === 'Terverifikasi'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {doc.status}
                    </span>
                  </div>

                  {/* Thumbnail Berkas */}
                  <div
                    onClick={() => setPreviewDoc(doc)}
                    className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200 mb-3 flex items-center justify-center relative cursor-pointer group-hover:opacity-95 transition"
                  >
                    {doc.fileType === 'pdf' ? (
                      <div className="flex flex-col items-center justify-center p-4 text-center">
                        <FileText className="w-10 h-10 text-red-500 mb-1" />
                        <span className="text-[11px] font-bold text-slate-700 truncate max-w-[200px]">
                          {doc.fileName || 'Dokumen PDF'}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono mt-0.5">
                          {doc.fileSize}
                        </span>
                      </div>
                    ) : (
                      <img
                        src={doc.fileUrl}
                        alt={doc.title}
                        className="w-full h-full object-cover"
                      />
                    )}

                    <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-1.5 backdrop-blur-[2px]">
                      <Eye className="w-4 h-4" />
                      <span>Klik untuk Lihat</span>
                    </div>
                  </div>

                  {/* Info Dokumen */}
                  <h4 className="font-extrabold text-sm text-slate-900 leading-snug line-clamp-1">
                    {doc.title}
                  </h4>
                  <p className="text-xs font-mono font-semibold text-slate-600 mt-1">
                    No: <span className="text-slate-900">{doc.docNumber || '-'}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 truncate">
                    Berkas: {doc.fileName} ({doc.fileSize})
                  </p>
                </div>

                {/* Tombol Aksi di Bawah Kartu */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  {/* Tombol Download Langsung */}
                  <button
                    onClick={() => handleDownload(doc)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs cursor-pointer"
                    title="Unduh file asli ke komputer / HP"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh</span>
                  </button>

                  {/* Tombol Lihat */}
                  <button
                    onClick={() => setPreviewDoc(doc)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                    title="Buka Pratinjau Dokumen"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* Tombol Edit */}
                  <button
                    onClick={() => handleEdit(doc)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                    title="Ubah nomor / data berkas"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {/* Tombol Hapus */}
                  <button
                    onClick={() => handleDelete(doc.id, doc.title)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 transition cursor-pointer"
                    title="Hapus berkas ini"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* DAFTAR DOKUMEN: MODE TABEL RAPI */}
        {viewMode === 'table' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Nama Dokumen</th>
                    <th className="py-3 px-4">Nomor Berkas</th>
                    <th className="py-3 px-4">Kategori</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>{doc.title}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                        {doc.docNumber || '-'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                          {doc.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {doc.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleDownload(doc)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-[11px] transition"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Unduh</span>
                          </button>
                          <button
                            onClick={() => setPreviewDoc(doc)}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition"
                            title="Lihat"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(doc)}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(doc.id, doc.title)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* JIKA PENCARIAN KOSONG */}
        {filteredDocuments.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="font-bold text-slate-800 text-sm">Tidak ada berkas yang cocok</h4>
            <p className="text-xs text-slate-400 mt-1">
              Coba ganti kata kunci pencarian atau pilih kategori lain.
            </p>
          </div>
        )}

      </main>

      {/* MODAL UPLOAD / TAMBAH BERKAS */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => {
          setIsUploadOpen(false);
          setEditingDoc(null);
        }}
        onSave={async (d) => {
          await saveDocument(d);
        }}
        editingDoc={editingDoc}
      />

      {/* MODAL PREVIEW BERKAS */}
      <PreviewModal
        document={previewDoc}
        onClose={() => setPreviewDoc(null)}
        onDownload={handleDownload}
      />

      {/* MODAL PROFIL & BIODATA */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onSave={updateProfile}
      />

    </div>
  );
};
