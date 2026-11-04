import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  FileText,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  Minimize2,
  Printer,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FileSearch,
  Eye
} from 'lucide-react';
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
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Reset zoom & rotasi setiap kali berganti dokumen
  useEffect(() => {
    setZoom(1);
    setRotation(0);
  }, [document]);

  // Tutup dengan tombol ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!document) return null;

  const isPdf =
    document.fileType === 'pdf' ||
    (document.fileName && document.fileName.toLowerCase().endsWith('.pdf')) ||
    (document.fileUrl && document.fileUrl.startsWith('data:application/pdf'));

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handlePrint = () => {
    if (isPdf) {
      // Buka di tab baru dan panggil print
      const printWindow = window.open(document.fileUrl, '_blank');
      if (printWindow) {
        printWindow.focus();
      }
    } else {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head><title>Cetak ${document.title}</title></head>
            <body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;">
              <img src="${document.fileUrl}" style="max-width:100%;max-height:100vh;object-fit:contain;" onload="window.print();window.close();" />
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  const handleOpenInNewTab = () => {
    window.open(document.fileUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn text-left">
      <div
        className={`bg-white rounded-2xl shadow-2xl relative border border-slate-200 flex flex-col transition-all duration-300 overflow-hidden ${
          isFullScreen
            ? 'w-full h-full rounded-none'
            : 'w-full max-w-5xl h-[92vh]'
        }`}
      >
        
        {/* ================= HEADER CONTROLS TOOLBAR ================= */}
        <div className="px-4 py-3 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 shrink-0">
          
          {/* Judul & Info Berkas */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
              <Eye className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold text-white truncate leading-tight">
                  {document.title}
                </h3>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/20">
                  {isPdf ? 'PDF Dokumen' : 'Gambar / Foto'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono truncate">
                No: {document.docNumber || '-'} • {document.fileName} ({document.fileSize})
              </p>
            </div>
          </div>

          {/* Alat Kontrol Viewer (Zoom, Rotate, Fullscreen, Print, Download) */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
            
            {/* Zoom Controls (Hanya untuk gambar) */}
            {!isPdf && (
              <div className="flex items-center bg-slate-800 rounded-xl p-0.5 border border-slate-700">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="p-1.5 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition"
                  title="Perkecil (-)"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono px-2 text-slate-300 font-bold min-w-[45px] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="p-1.5 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition"
                  title="Perbesar (+)"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Rotasi 90 Derajat */}
            {!isPdf && (
              <button
                type="button"
                onClick={handleRotate}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
                title="Putar 90°"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            )}

            {/* Buka di Tab Baru */}
            <button
              type="button"
              onClick={handleOpenInNewTab}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
              title="Buka di Tab Baru"
            >
              <ExternalLink className="w-4 h-4" />
            </button>

            {/* Cetak Langsung */}
            <button
              type="button"
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
              title="Cetak Berkas Ini"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition hidden sm:inline-flex"
              title={isFullScreen ? 'Kecilkan Layar' : 'Layar Penuh'}
            >
              {isFullScreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>

            {/* Tombol Unduh Opsi Tambahan */}
            <button
              type="button"
              onClick={() => onDownload(document)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition ml-1"
              title="Unduh Salinan Berkas"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Unduh</span>
            </button>

            {/* Tombol Tutup */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white transition ml-1 cursor-pointer"
              title="Tutup Pratinjau (ESC)"
            >
              <X className="w-4 h-4" />
            </button>

          </div>

        </div>

        {/* ================= MAIN VIEWER CANVAS ================= */}
        <div className="flex-1 bg-slate-950 overflow-auto relative flex items-center justify-center p-2 sm:p-4 select-none">
          
          {isPdf ? (
            /* PREVIEW DOKUMEN PDF LANGSUNG (TANPA DOWNLOAD) */
            <div className="w-full h-full rounded-xl overflow-hidden bg-white shadow-2xl flex flex-col">
              <iframe
                src={`${document.fileUrl}#view=FitH&toolbar=1`}
                title={document.title}
                className="w-full h-full border-0 rounded-xl"
              />
            </div>
          ) : (
            /* PREVIEW GAMBAR / FOTO LANGSUNG DENGAN ZOOM & ROTATE */
            <div
              className="w-full h-full flex items-center justify-center overflow-auto transition-transform duration-200"
              style={{
                cursor: zoom > 1 ? 'grab' : 'default'
              }}
            >
              <img
                src={document.fileUrl}
                alt={document.title}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-all duration-200"
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1000&q=80';
                }}
              />
            </div>
          )}

        </div>

        {/* ================= FOOTER DETAIL BAR ================= */}
        <div className="px-4 py-2.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-4">
            <span>
              Kategori: <strong className="text-slate-200">{document.category}</strong>
            </span>
            <span className="hidden sm:inline">
              Masa Berlaku: <strong className="text-slate-200">{document.expiryDate || 'Seumur Hidup'}</strong>
            </span>
            <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{document.status}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500">
              Tekan <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">ESC</kbd> untuk menutup
            </span>
            <button
              onClick={onClose}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
