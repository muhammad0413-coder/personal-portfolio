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
  Folder,
  FolderPlus,
  FolderOpen,
  ArrowLeft,
  LayoutGrid,
  List,
  Plus,
  Sparkles,
  CheckCircle2,
  Clock,
  ChevronRight
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { PersonalDocument, DocumentFolder } from '../types';
import { UploadModal } from '../components/dashboard/UploadModal';
import { PreviewModal } from '../components/dashboard/PreviewModal';
import { ProfileModal } from '../components/dashboard/ProfileModal';
import { FolderModal } from '../components/dashboard/FolderModal';

export const DashboardPage: React.FC = () => {
  const {
    profile,
    documents,
    folders,
    saveDocument,
    deleteDocument,
    createFolder,
    deleteFolder,
    updateProfile
  } = useData();
  const { currentUser, logout } = useAuth();

  // Navigasi Folder Aktif: null = Di Beranda (Semua Folder), atau id folder
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<PersonalDocument | null>(null);
  const [previewDoc, setPreviewDoc] = useState<PersonalDocument | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Folder yang sedang dibuka saat ini
  const activeFolder = useMemo(() => {
    if (!activeFolderId) return null;
    return folders.find((f) => f.id === activeFolderId) || null;
  }, [folders, activeFolderId]);

  // Filter dokumen sesuai folder aktif & pencarian
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // Jika di dalam folder tertentu, hanya tampilkan dokumen milik folder tersebut
      const matchFolder = activeFolderId ? doc.folderId === activeFolderId : true;
      const matchCategory =
        selectedCategory === 'Semua' || doc.category === selectedCategory;
      const matchSearch =
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.docNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.fileName && doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchFolder && matchCategory && matchSearch;
    });
  }, [documents, activeFolderId, selectedCategory, searchQuery]);

  // Hitung jumlah berkas per folder
  const getFolderDocCount = (fId: string) => {
    return documents.filter((d) => d.folderId === fId).length;
  };

  // Handler Download File Asli
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
    if (confirm(`Apakah Anda yakin ingin menghapus berkas "${title}"?`)) {
      await deleteDocument(id);
    }
  };

  const handleDeleteFolder = async (folder: DocumentFolder, e: React.MouseEvent) => {
    e.stopPropagation();
    const count = getFolderDocCount(folder.id);
    if (
      confirm(
        `Apakah Anda yakin ingin menghapus folder "${folder.name}"? ${
          count > 0 ? `(Terdapat ${count} berkas di dalamnya)` : ''
        }`
      )
    ) {
      if (activeFolderId === folder.id) {
        setActiveFolderId(null);
      }
      await deleteFolder(folder.id);
    }
  };

  const displayName = currentUser?.displayName || profile?.fullName || 'Pengguna';
  const displayEmail = currentUser?.email || profile?.email || '';

  // Helper warna folder
  const getFolderColorClass = (color?: string) => {
    switch (color) {
      case 'emerald':
        return { bg: 'bg-emerald-50 text-emerald-600 border-emerald-200', icon: 'text-emerald-500' };
      case 'amber':
        return { bg: 'bg-amber-50 text-amber-600 border-amber-200', icon: 'text-amber-500' };
      case 'purple':
        return { bg: 'bg-purple-50 text-purple-600 border-purple-200', icon: 'text-purple-500' };
      case 'rose':
        return { bg: 'bg-rose-50 text-rose-600 border-rose-200', icon: 'text-rose-500' };
      default:
        return { bg: 'bg-blue-50 text-blue-600 border-blue-200', icon: 'text-blue-500' };
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      
      {/* 1. TOP NAVBAR */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Judul */}
          <div
            onClick={() => setActiveFolderId(null)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-slate-900 text-base leading-tight tracking-tight">
                Arsip Data Pribadi
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                Sistem Folder & Manajemen Dokumen
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

        {/* HERO / ACTION BAR */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div>
            {/* Breadcrumb Navigation */}
            {activeFolder ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <button
                    onClick={() => setActiveFolderId(null)}
                    className="hover:text-blue-600 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Beranda</span>
                  </button>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-blue-600 font-bold flex items-center gap-1">
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>{activeFolder.name}</span>
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>📁 {activeFolder.name}</span>
                </h2>
                <p className="text-xs text-slate-500">
                  {activeFolder.description || 'Kumpulan berkas di dalam folder ini.'}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    <Sparkles className="w-3 h-3" /> Sistem Folder Mandiri
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Arsip Dokumen {displayName}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
                  Buka folder (seperti <b>Ijazah SD - S3</b>) atau buat folder baru sendiri untuk mengelompokkan berkas resmi Anda.
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons: Buat Folder Baru & Unggah Berkas */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {activeFolder && (
              <button
                onClick={() => setActiveFolderId(null)}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Semua Folder</span>
              </button>
            )}

            <button
              onClick={() => setIsFolderModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-2xs transition cursor-pointer"
            >
              <FolderPlus className="w-4 h-4 text-blue-600" />
              <span>+ Buat Folder Baru</span>
            </button>

            <button
              onClick={() => {
                setEditingDoc(null);
                setIsUploadOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Unggah Berkas Baru</span>
            </button>
          </div>
        </div>

        {/* 3. TAMPILAN GRID FOLDER (JIKA DI BERANDA) */}
        {!activeFolderId && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900 tracking-tight flex items-center gap-2">
                <Folder className="w-4 h-4 text-blue-600" />
                <span>Folder Dokumen ({folders.length} Folder)</span>
              </h3>
              <span className="text-[11px] text-slate-400">
                Klik folder untuk melihat isinya (misal: Ijazah SD - S3)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {folders.map((folder) => {
                const count = getFolderDocCount(folder.id);
                const colorStyle = getFolderColorClass(folder.color);

                return (
                  <div
                    key={folder.id}
                    onClick={() => setActiveFolderId(folder.id)}
                    className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-2xs hover:shadow-md hover:border-blue-400 transition-all cursor-pointer flex flex-col justify-between group relative text-left"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center border shadow-xs ${colorStyle.bg}`}
                        >
                          <Folder className="w-6 h-6" />
                        </div>

                        {/* Tombol Hapus Folder */}
                        <button
                          onClick={(e) => handleDeleteFolder(folder, e)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                          title="Hapus Folder Ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-600 transition leading-snug line-clamp-1">
                        {folder.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                        {folder.description || 'Folder dokumen pribadi'}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-700">
                        {count} Berkas Tersimpan
                      </span>
                      <span className="text-blue-600 font-bold group-hover:translate-x-0.5 transition flex items-center">
                        Buka →
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Kartu Tombol Buat Folder Cepat */}
              <button
                type="button"
                onClick={() => setIsFolderModalOpen(true)}
                className="rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-400 p-4.5 text-center flex flex-col items-center justify-center gap-2 hover:bg-blue-50/40 transition cursor-pointer group min-h-[140px]"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-blue-100 text-slate-400 group-hover:text-blue-600 flex items-center justify-center transition">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700 group-hover:text-blue-600">
                    + Buat Folder Baru
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Bisa tambah folder ijazah, kursus, dll.
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* 4. BAR PENCARIAN & DAFTAR BERKAS */}
        <div className="space-y-4 pt-2">
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">
                {activeFolder ? `Berkas di ${activeFolder.name}` : 'Semua Berkas Dokumen'}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
                {filteredDocuments.length}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Input Pencarian */}
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari nama berkas atau nomor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs"
                />
              </div>

              {/* Toggle Grid / List */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-blue-50 text-blue-600 font-bold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Tampilan Grid"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    viewMode === 'table'
                      ? 'bg-blue-50 text-blue-600 font-bold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Tampilan Tabel"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* DAFTAR DOKUMEN: MODE KARTU (GRID) */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map((doc) => {
                const docFolder = folders.find((f) => f.id === doc.folderId);

                return (
                  <div
                    key={doc.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all hover:border-slate-300 flex flex-col justify-between gap-4 group"
                  >
                    <div>
                      {/* Badge Folder & Status */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 max-w-[170px] truncate">
                          <Folder className="w-3 h-3 shrink-0" />
                          <span className="truncate">{docFolder ? docFolder.name : doc.category}</span>
                        </span>

                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{doc.status}</span>
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

                      {/* Info Berkas */}
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
                      {/* Tombol Utama: LIHAT FILE LANGSUNG TANPA DOWNLOAD */}
                      <button
                        onClick={() => setPreviewDoc(doc)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs cursor-pointer"
                        title="Buka dan baca isi dokumen langsung di layar (tanpa download)"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Lihat Berkas</span>
                      </button>

                      {/* Tombol Unduh Opsi Tambahan */}
                      <button
                        onClick={() => handleDownload(doc)}
                        className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                        title="Unduh file asli ke perangkat"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      {/* Tombol Edit */}
                      <button
                        onClick={() => handleEdit(doc)}
                        className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                        title="Ubah data berkas"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {/* Tombol Hapus */}
                      <button
                        onClick={() => handleDelete(doc.id, doc.title)}
                        className="p-2.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 transition cursor-pointer"
                        title="Hapus berkas ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

          {/* DAFTAR DOKUMEN: MODE TABEL */}
          {viewMode === 'table' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Nama Dokumen</th>
                      <th className="py-3 px-4">Nomor Berkas</th>
                      <th className="py-3 px-4">Folder</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredDocuments.map((doc) => {
                      const docFolder = folders.find((f) => f.id === doc.folderId);

                      return (
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
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700">
                              {docFolder ? docFolder.name : doc.category}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {doc.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Tombol Lihat Langsung */}
                              <button
                                onClick={() => setPreviewDoc(doc)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition cursor-pointer shadow-2xs"
                                title="Buka dan lihat berkas di layar"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Lihat Berkas</span>
                              </button>
                              {/* Tombol Unduh Tambahan */}
                              <button
                                onClick={() => handleDownload(doc)}
                                className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                                title="Unduh"
                              >
                                <Download className="w-4 h-4" />
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
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* JIKA TIDAK ADA BERKAS DALAM FOLDER */}
          {filteredDocuments.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="font-bold text-slate-800 text-sm">
                {activeFolder ? `Belum ada berkas di dalam folder "${activeFolder.name}"` : 'Tidak ada berkas yang cocok'}
              </h4>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                {activeFolder
                  ? 'Klik tombol di bawah untuk mengunggah dokumen baru ke folder ini.'
                  : 'Coba ubah kata kunci pencarian.'}
              </p>
              {activeFolder && (
                <button
                  onClick={() => {
                    setEditingDoc(null);
                    setIsUploadOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Unggah Berkas ke Folder Ini</span>
                </button>
              )}
            </div>
          )}

        </div>

      </main>

      {/* MODAL BUAT FOLDER BARU */}
      <FolderModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        onSave={async (name, desc, color) => {
          await createFolder(name, desc, color);
        }}
      />

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
        folders={folders}
        defaultFolderId={activeFolderId || undefined}
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
