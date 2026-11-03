import React, { useState } from 'react';
import {
  Upload,
  Image as ImageIcon,
  FileText,
  CheckCircle2,
  AlertCircle,
  Download,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { uploadFile } from '../../services/storage';

export const PhotoCvManager: React.FC = () => {
  const { profile, updateProfileData } = useData();

  const [photoProgress, setPhotoProgress] = useState<number | null>(null);
  const [cvProgress, setCvProgress] = useState<number | null>(null);
  const [photoError, setPhotoError] = useState('');
  const [cvError, setCvError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Handle Profile Photo Upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoError('');
    setPhotoProgress(0);

    try {
      const downloadUrl = await uploadFile(file, {
        folder: 'profile',
        maxSizeMB: 5,
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
        onProgress: (p) => setPhotoProgress(p),
      });

      await updateProfileData({ profilePhoto: downloadUrl });
      setSuccessMsg('Foto profil berhasil diunggah dan disimpan!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setPhotoError(err?.message || 'Gagal mengunggah foto profil.');
    } finally {
      setPhotoProgress(null);
    }
  };

  // Handle CV Upload
  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCvError('');
    setCvProgress(0);

    try {
      const downloadUrl = await uploadFile(file, {
        folder: 'documents',
        maxSizeMB: 10,
        allowedTypes: ['application/pdf'],
        onProgress: (p) => setCvProgress(p),
      });

      await updateProfileData({ cvUrl: downloadUrl });
      setSuccessMsg('File CV berhasil diunggah dan disimpan!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setCvError(err?.message || 'Gagal mengunggah file CV.');
    } finally {
      setCvProgress(null);
    }
  };

  const handleResetToDefaultPhoto = async () => {
    if (confirm('Kembalikan foto profil ke default (Alex - CodeCraft)?')) {
      await updateProfileData({ profilePhoto: '/profile-alex.png' });
      setSuccessMsg('Foto profil dikembalikan ke default.');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  return (
    <div className="space-y-8 text-left max-w-4xl">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-violet-400" />
            <span>Manajemen Foto Profil & Berkas CV</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Unggah foto profil berkualitas tinggi dan dokumen CV (PDF) untuk disimpan ke Firebase Storage.
          </p>
        </div>

        {successMsg && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-lg animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* 1. Profile Photo Card */}
        <div className="p-6 rounded-2xl bg-[#0D1322] border border-white/10 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-violet-400" />
              <span>Foto Profil Administrator</span>
            </h3>
            <p className="text-xs text-gray-400 mb-6">
              Maksimal 5MB. Format yang didukung: JPG, PNG, WEBP.
            </p>

            {/* Live Preview in Purple Sphere Frame */}
            <div className="relative w-48 h-56 mx-auto mb-6 flex items-center justify-center">
              <div className="absolute w-44 h-44 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 opacity-70 blur-sm -z-0" />
              <img
                src={profile.profilePhoto || '/profile-alex.png'}
                alt="Foto Profil"
                className="w-40 h-52 object-cover object-top rounded-b-2xl relative z-10 border border-white/10 shadow-xl"
              />
            </div>

            {photoError && (
              <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{photoError}</span>
              </div>
            )}

            {photoProgress !== null && (
              <div className="mb-4 space-y-1.5">
                <div className="flex justify-between text-xs text-violet-300">
                  <span>Mengunggah ke Firebase Storage...</span>
                  <span className="font-mono">{photoProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-violet-600 transition-all duration-200"
                    style={{ width: `${photoProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3 pt-4 border-t border-white/10">
            <label className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold cursor-pointer transition">
              <Upload className="w-4 h-4" />
              <span>Pilih & Unggah Foto Baru</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={handleResetToDefaultPhoto}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 text-xs border border-white/10 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Gunakan Foto Bawaan Alex</span>
            </button>
          </div>
        </div>

        {/* 2. CV Document Card */}
        <div className="p-6 rounded-2xl bg-[#0D1322] border border-white/10 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Berkas Curriculum Vitae (CV)</span>
            </h3>
            <p className="text-xs text-gray-400 mb-6">
              Maksimal 10MB. Format yang didukung: PDF.
            </p>

            <div className="p-5 rounded-xl bg-black/40 border border-white/10 mb-6 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3">
                <FileText className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-semibold text-white mb-1">
                Status Berkas CV Saat Ini
              </h4>
              <p className="text-xs text-gray-400 break-all max-w-xs">
                {profile.cvUrl && profile.cvUrl !== '#'
                  ? 'Berkas CV telah terpasang dan siap diunduh oleh pengunjung.'
                  : 'Belum ada berkas CV yang diunggah.'}
              </p>
            </div>

            {cvError && (
              <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{cvError}</span>
              </div>
            )}

            {cvProgress !== null && (
              <div className="mb-4 space-y-1.5">
                <div className="flex justify-between text-xs text-indigo-300">
                  <span>Mengunggah CV ke Firebase Storage...</span>
                  <span className="font-mono">{cvProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 transition-all duration-200"
                    style={{ width: `${cvProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3 pt-4 border-t border-white/10">
            <label className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer transition">
              <Upload className="w-4 h-4" />
              <span>Unggah Berkas CV (PDF)</span>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleCvUpload}
                className="hidden"
              />
            </label>

            {profile.cvUrl && profile.cvUrl !== '#' && (
              <div className="flex gap-2">
                <a
                  href={profile.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 text-xs border border-white/10 transition"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Uji Download CV</span>
                </a>
                <button
                  onClick={() => updateProfileData({ cvUrl: '#' })}
                  className="p-2 rounded-xl bg-red-950/30 hover:bg-red-950/60 text-red-400 border border-red-500/20 transition"
                  title="Hapus Berkas CV"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
