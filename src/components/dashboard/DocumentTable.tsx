import React, { useState } from 'react';
import {
  Download,
  Eye,
  Trash2,
  Edit2,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileText,
  Star,
  GraduationCap
} from 'lucide-react';
import { PersonalDocument, DocumentCategory } from '../../types';

interface DocumentTableProps {
  documents: PersonalDocument[];
  onPreview: (doc: PersonalDocument) => void;
  onDownload: (doc: PersonalDocument) => void;
  onEdit: (doc: PersonalDocument) => void;
  onDelete: (id: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const DocumentTable: React.FC<DocumentTableProps> = ({
  documents,
  onPreview,
  onDownload,
  onEdit,
  onDelete,
  selectedCategory,
  onSelectCategory,
}) => {
  const [search, setSearch] = useState('');

  const categories = [
    'Semua',
    'Kependudukan',
    'Pendidikan',
    'Finansial & Pajak',
    'Lisensi & Kendaraan',
    'Kesehatan & Kerja',
  ];

  const filteredDocs = documents.filter((d) => {
    const matchCat = selectedCategory === 'Semua' || d.category === selectedCategory;
    const matchSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.docNumber.toLowerCase().includes(search.toLowerCase()) ||
      d.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 text-left">
      
      {/* Left / Wide: Document Management Table matching Screenshot Table */}
      <div className="lg:col-span-8 bg-white rounded-2xl p-5 shadow-xs border border-gray-100 flex flex-col justify-between">
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-xs font-black text-gray-800 tracking-wider uppercase">
                DAFTAR DOKUMEN & BERKAS RESMI
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Kumpulan KTP, KK, Ijazah, SIM, NPWP yang dapat dilihat dan diunduh.
              </p>
            </div>

            {/* Search Box */}
            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari NIK, KK, atau nama..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-3 border-b border-gray-100">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#0B132B] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#0B132B] text-white font-bold uppercase text-[10px] tracking-wider rounded-xl">
                  <th className="py-2.5 px-3 rounded-l-lg">Nama Dokumen</th>
                  <th className="py-2.5 px-3">Nomor Identitas</th>
                  <th className="py-2.5 px-3">Kategori</th>
                  <th className="py-2.5 px-3">Tgl Terbit</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right rounded-r-lg">Aksi Dokumen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-blue-50/40 transition">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-gray-900 truncate max-w-[140px] sm:max-w-none">
                          {doc.title}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono text-gray-600 font-semibold">
                      {doc.docNumber || '-'}
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-gray-100 text-gray-700">
                        {doc.category}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-gray-500 font-mono text-[11px]">
                      {doc.issueDate || '-'}
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          doc.status === 'Terverifikasi'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : doc.status === 'Perlu Pembaruan'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {doc.status === 'Terverifikasi' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <AlertCircle className="w-3 h-3" />
                        )}
                        <span>{doc.status}</span>
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onPreview(doc)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition"
                          title="Lihat Pratinjau Dokumen"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onDownload(doc)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] shadow-xs transition"
                          title="Download Dokumen"
                        >
                          <Download className="w-3 h-3" />
                          <span>Download</span>
                        </button>

                        <button
                          onClick={() => onEdit(doc)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
                          title="Edit Info"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onDelete(doc.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                          title="Hapus Dokumen"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredDocs.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-xs">
                Tidak ada dokumen yang sesuai dengan pencarian atau filter Anda.
              </div>
            )}
          </div>
        </div>

        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
          <span>Menampilkan {filteredDocs.length} dari total {documents.length} dokumen pribadi</span>
          <span>Semua file tersimpan aman di Cloud & Cache Lokal</span>
        </div>
      </div>

      {/* Right: 2 Cards matching the screenshot */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        
        {/* Card 1: Pass Rate / Kelengkapan Dokumen (Donut Graphic) */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-black text-gray-800 tracking-wider uppercase">
              STATUS KELENGKAPAN ARSIP
            </h3>
            <span className="text-[10px] font-bold text-blue-600">Terpadu</span>
          </div>

          <div className="flex items-center justify-center my-3 relative">
            <svg className="w-28 h-28 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="14" fill="none" stroke="#E2E8F0" strokeWidth="4" />
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#1E5BF6"
                strokeWidth="4"
                strokeDasharray="76 88"
                strokeDashoffset="0"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-lg font-black text-gray-800">86.2%</span>
              <span className="text-[8px] font-bold text-gray-400 uppercase">LENGKAP</span>
            </div>
          </div>

          <div className="space-y-1.5 text-[11px] border-t border-gray-100 pt-3">
            <div className="flex justify-between text-gray-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                KTP & KK
              </span>
              <span className="font-bold text-gray-800">100%</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Pendidikan (Ijazah)
              </span>
              <span className="font-bold text-gray-800">100%</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                Pajak & NPWP
              </span>
              <span className="font-bold text-gray-800">100%</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Lisensi (SIM)
              </span>
              <span className="font-bold text-gray-800">85%</span>
            </div>
          </div>
        </div>

        {/* Card 2: Motivational Quote / Tips Keamanan matching Screenshot */}
        <div className="bg-gradient-to-br from-indigo-50/70 to-blue-50/40 rounded-2xl p-5 shadow-xs border border-indigo-100/60 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-black text-indigo-950 uppercase tracking-wider mb-1">
              Keamanan Data Terjamin!
            </h4>
            <p className="text-[11px] text-gray-600 leading-relaxed mb-3">
              Semua dokumen tersimpan dengan enkripsi, dapat diunggah ulang dan diunduh setiap saat ketika dibutuhkan.
            </p>

            <div className="flex items-center gap-1 text-amber-400 mb-2">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-indigo-100">
            <span className="text-[10px] font-bold text-indigo-900">
              Data terenkripsi Cloud
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
