import React, { useState } from 'react';
import { X, FolderPlus, Folder } from 'lucide-react';

interface FolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, description?: string, color?: string) => Promise<void>;
}

export const FolderModal: React.FC<FolderModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('blue');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const colorOptions = [
    { id: 'blue', label: 'Biru', bg: 'bg-blue-500' },
    { id: 'emerald', label: 'Hijau', bg: 'bg-emerald-500' },
    { id: 'amber', label: 'Kuning/Oranye', bg: 'bg-amber-500' },
    { id: 'purple', label: 'Ungu', bg: 'bg-purple-500' },
    { id: 'rose', label: 'Merah', bg: 'bg-rose-500' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Harap masukkan nama folder!');
      return;
    }

    setLoading(true);
    try {
      await onSave(name.trim(), description.trim(), color);
      setName('');
      setDescription('');
      onClose();
    } catch (err: any) {
      alert(err?.message || 'Gagal membuat folder.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn text-left">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative border border-gray-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-gray-900 leading-tight">
                Buat Folder Baru
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Kelompokkan berkas seperti Ijazah (SD-S3), Pajak, Sertifikat, dll.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Nama Folder *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Ijazah, Sertifikat Kursus, Surat Kerja..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-blue-500 font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Keterangan Folder (Opsional)
            </label>
            <input
              type="text"
              placeholder="Contoh: Kumpulan Ijazah SD, SMP, SMA, S1 sampai S3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-blue-500 font-medium"
            />
          </div>

          {/* Pilihan Warna Folder */}
          <div>
            <label className="block font-bold text-gray-700 mb-2">
              Warna Folder
            </label>
            <div className="flex items-center gap-2">
              {colorOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setColor(opt.id)}
                  className={`w-7 h-7 rounded-full ${opt.bg} transition transform ${
                    color === opt.id ? 'ring-2 ring-offset-2 ring-slate-800 scale-110' : 'opacity-70 hover:opacity-100'
                  }`}
                  title={opt.label}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-semibold transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/20 transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Membuat...' : 'Buat Folder'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
