import React, { useState } from 'react';
import { X, Database, CheckCircle2, AlertCircle, CloudUpload, Flame } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { isFirebaseConfigured, firebaseConfig } from '../../services/firebase';

interface CloudModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CloudModal: React.FC<CloudModalProps> = ({ isOpen, onClose }) => {
  const { seedDatabase } = useData();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const isConnected = isFirebaseConfigured();

  const handleSeed = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await seedDatabase();
      setResult(res);
    } catch (err: any) {
      setResult({
        success: false,
        message: err?.message || 'Gagal sinkronisasi data.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn text-left">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl relative border border-gray-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-gray-900">
                Status Cloud Firebase & Backup Data
              </h3>
              <p className="text-xs text-gray-400">
                Sinkronisasi data dokumen dan profil pribadi ke Cloud Firestore.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Badge */}
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 mb-4 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-600">Status Koneksi Cloud:</span>
            <span
              className={`px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 ${
                isConnected
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              <span>{isConnected ? 'Terhubung (Cloud Firestore)' : 'Mode Lokal (Cache)'}</span>
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600">Project ID:</span>
            <span className="font-mono font-bold text-gray-800">
              {firebaseConfig.projectId || 'personal-portfolio-b3d76'}
            </span>
          </div>
        </div>

        {result && (
          <div
            className={`p-3.5 rounded-xl border flex items-center gap-2.5 text-xs mb-4 ${
              result.success
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {result.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{result.message}</span>
          </div>
        )}

        {/* 1-Click Sync Button */}
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 mb-4 text-xs">
          <h4 className="font-bold text-blue-900 mb-1 flex items-center gap-1.5">
            <CloudUpload className="w-4 h-4 text-blue-600" />
            <span>Sinkronisasi Data Awal ke Cloud</span>
          </h4>
          <p className="text-blue-800/80 leading-relaxed mb-3">
            Simpan seluruh dokumen awal (KTP, KK, Akta, Ijazah, SIM, NPWP) ke database Cloud Firestore Anda secara permanen.
          </p>

          <button
            onClick={handleSeed}
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition disabled:opacity-50"
          >
            {loading ? 'Menyinkronkan...' : 'Suntikkan / Sinkronkan Data ke Firestore Sekarang'}
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs transition"
        >
          Tutup
        </button>

      </div>
    </div>
  );
};
