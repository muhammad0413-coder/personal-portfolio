import React from 'react';
import { X, Download, FileText, CheckCircle2, AlertCircle, Calendar, Tag } from 'lucide-react';
import { PersonalDocument } from '../../types';

interface PreviewModalProps {
  document: PersonalDocument | null;
  onClose: () => void;
  onDownload: (doc: PersonalDocument) => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  document,
  onClose,
  onDownload
}) => {
  if (!document) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn text-left">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative border border-gray-100 flex flex-col justify-between">
        
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-gray-900 leading-tight">
                  {document.title}
                </h3>
                <span className="text-xs font-mono text-gray-500 font-semibold">
                  No: {document.docNumber || 'Tidak ada nomor'}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Document Preview Frame */}
          <div className="aspect-[16/10] w-full rounded-xl overflow-hidden bg-gray-900 border border-gray-200 mb-4 flex items-center justify-center relative shadow-inner">
            {document.fileType === 'pdf' ? (
              <div className="flex flex-col items-center justify-center p-6 text-white text-center">
                <FileText className="w-16 h-16 text-red-400 mb-2" />
                <h4 className="font-bold text-sm mb-1">{document.fileName}</h4>
                <p className="text-xs text-gray-400 mb-4">
                  Dokumen PDF ({document.fileSize}) siap diunduh.
                </p>
                <button
                  onClick={() => onDownload(document)}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh & Buka Berkas PDF</span>
                </button>
              </div>
            ) : (
              <img
                src={document.fileUrl}
                alt={document.title}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1000&q=80';
                }}
              />
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-xl bg-gray-50 border border-gray-100 text-xs mb-4">
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-bold block">
                Kategori
              </span>
              <span className="font-bold text-gray-800">{document.category}</span>
            </div>

            <div>
              <span className="text-[10px] text-gray-400 uppercase font-bold block">
                Tgl Terbit
              </span>
              <span className="font-medium text-gray-700">{document.issueDate || '-'}</span>
            </div>

            <div>
              <span className="text-[10px] text-gray-400 uppercase font-bold block">
                Masa Berlaku
              </span>
              <span className="font-medium text-gray-700">{document.expiryDate || 'Seumur Hidup'}</span>
            </div>

            <div>
              <span className="text-[10px] text-gray-400 uppercase font-bold block">
                Status Dokumen
              </span>
              <span
                className={`inline-flex items-center gap-1 font-bold ${
                  document.status === 'Terverifikasi' ? 'text-emerald-600' : 'text-amber-600'
                }`}
              >
                {document.status === 'Terverifikasi' ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : (
                  <AlertCircle className="w-3 h-3" />
                )}
                <span>{document.status}</span>
              </span>
            </div>
          </div>

          {document.notes && (
            <p className="text-xs text-gray-500 italic mb-4">
              Catatan: {document.notes}
            </p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
          <span className="text-[11px] text-gray-400">
            Nama berkas: <strong className="text-gray-700">{document.fileName}</strong>
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => onDownload(document)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all hover:scale-[1.02]"
            >
              <Download className="w-4 h-4" />
              <span>Download Dokumen Ini</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs transition"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
