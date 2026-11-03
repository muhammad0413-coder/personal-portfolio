import React from 'react';
import { Download, Eye, Award } from 'lucide-react';
import { PersonalDocument } from '../../types';

interface ChartsSummaryProps {
  documents: PersonalDocument[];
  onPreview: (doc: PersonalDocument) => void;
  onDownload: (doc: PersonalDocument) => void;
}

export const ChartsSummary: React.FC<ChartsSummaryProps> = ({
  documents,
  onPreview,
  onDownload
}) => {
  const total = documents.length;

  // Categories breakdown
  const kependudukanCount = documents.filter((d) => d.category === 'Kependudukan').length;
  const pendidikanCount = documents.filter((d) => d.category === 'Pendidikan').length;
  const finansialCount = documents.filter((d) => d.category === 'Finansial & Pajak').length;
  const lisensiCount = documents.filter((d) => d.category === 'Lisensi & Kendaraan').length;
  const lainnyaCount = total - (kependudukanCount + pendidikanCount + finansialCount + lisensiCount);

  const getPercent = (count: number) => (total > 0 ? ((count / total) * 100).toFixed(1) : '0');

  // Bar Chart items (subject scores)
  const barItems = [
    { label: 'e-KTP', value: 100, color: 'bg-blue-600' },
    { label: 'K.Keluarga', value: 100, color: 'bg-emerald-500' },
    { label: 'Akta', value: 100, color: 'bg-purple-600' },
    { label: 'Ijazah', value: 100, color: 'bg-amber-500' },
    { label: 'SIM & NPWP', value: 85, color: 'bg-cyan-500' },
  ];

  // Top 5 essential documents for quick download matching screenshot list
  const topDocs = documents.slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 text-left">
      
      {/* 1. Left: Result Summary / Donut Chart */}
      <div className="lg:col-span-4 bg-white rounded-2xl p-5 shadow-xs border border-gray-100 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-black text-gray-800 tracking-wider uppercase">
              DISTRIBUSI KATEGORI
            </h3>
            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
              ARSIP
            </span>
          </div>

          <div className="flex items-center gap-4 my-2">
            {/* SVG Donut */}
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#E2E8F0" strokeWidth="4" />
                {/* Purple: Kependudukan */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#6C5CE7"
                  strokeWidth="4"
                  strokeDasharray={`${(kependudukanCount / (total || 1)) * 88} 88`}
                  strokeDashoffset="0"
                />
                {/* Green: Pendidikan */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#00BA88"
                  strokeWidth="4"
                  strokeDasharray={`${(pendidikanCount / (total || 1)) * 88} 88`}
                  strokeDashoffset={`-${(kependudukanCount / (total || 1)) * 88}`}
                />
                {/* Orange: Finansial */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#FF7643"
                  strokeWidth="4"
                  strokeDasharray={`${(finansialCount / (total || 1)) * 88} 88`}
                  strokeDashoffset={`-${((kependudukanCount + pendidikanCount) / (total || 1)) * 88}`}
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xl font-black text-gray-800 leading-none">{total}</span>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                  TOTAL
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2 text-[11px] min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#6C5CE7] shrink-0" />
                  <span className="text-gray-600 truncate">Kependudukan</span>
                </div>
                <span className="font-bold text-gray-800">{getPercent(kependudukanCount)}%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00BA88] shrink-0" />
                  <span className="text-gray-600 truncate">Pendidikan</span>
                </div>
                <span className="font-bold text-gray-800">{getPercent(pendidikanCount)}%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF7643] shrink-0" />
                  <span className="text-gray-600 truncate">Finansial & Pajak</span>
                </div>
                <span className="font-bold text-gray-800">{getPercent(finansialCount)}%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1E5BF6] shrink-0" />
                  <span className="text-gray-600 truncate">Lisensi / SIM</span>
                </div>
                <span className="font-bold text-gray-800">{getPercent(lisensiCount)}%</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-gray-400 border-t border-gray-100 pt-2.5 mt-2">
          Komposisi berkas arsip kependudukan resmi Anda.
        </p>
      </div>

      {/* 2. Middle: Average Score by Subject / Bar Chart */}
      <div className="lg:col-span-4 bg-white rounded-2xl p-5 shadow-xs border border-gray-100 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-black text-gray-800 tracking-wider uppercase">
              STATUS KELENGKAPAN BERKAS
            </h3>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              95% Lengkap
            </span>
          </div>

          {/* Bar Chart Bars */}
          <div className="flex items-end justify-between gap-3 h-40 pt-6 pb-2 px-1">
            {barItems.map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                <span className="text-[10px] font-bold text-gray-700 mb-1 group-hover:text-blue-600">
                  {bar.value}%
                </span>
                <div className="w-full bg-gray-100 rounded-t-lg h-28 relative flex items-end overflow-hidden">
                  <div
                    className={`w-full ${bar.color} rounded-t-lg transition-all duration-700`}
                    style={{ height: `${bar.value}%` }}
                  />
                </div>
                <span className="text-[10px] font-semibold text-gray-500 mt-2 truncate max-w-[50px] text-center">
                  {bar.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[10px] text-gray-400 border-t border-gray-100 pt-2.5 mt-2">
          Verifikasi berkas kependudukan & keaslian nomor identitas.
        </p>
      </div>

      {/* 3. Right: Top Performing Documents / Ready to Download */}
      <div className="lg:col-span-4 bg-white rounded-2xl p-5 shadow-xs border border-gray-100 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-black text-gray-800 tracking-wider uppercase">
                DOKUMEN SIAP DOWNLOAD
              </h3>
            </div>
            <span className="text-[10px] font-bold text-blue-600">
              1-Klik Unduh
            </span>
          </div>

          <div className="space-y-2.5">
            {topDocs.map((doc, idx) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Badge Number (1, 2, 3...) matching screenshot */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      idx === 0
                        ? 'bg-amber-100 text-amber-700 font-black'
                        : idx === 1
                        ? 'bg-slate-200 text-slate-700'
                        : idx === 2
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-gray-800 truncate">
                      {doc.title}
                    </h4>
                    <p className="text-[10px] font-mono text-gray-400 truncate">
                      {doc.docNumber}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <button
                    onClick={() => onPreview(doc)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
                    title="Lihat Pratinjau"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDownload(doc)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white text-[11px] font-bold transition shadow-2xs"
                    title="Download Dokumen"
                  >
                    <Download className="w-3 h-3" />
                    <span>Unduh</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[10px] text-gray-400 border-t border-gray-100 pt-2.5 mt-2">
          File tersimpan aman dalam format PDF/JPG resolusi tinggi.
        </p>
      </div>

    </div>
  );
};
