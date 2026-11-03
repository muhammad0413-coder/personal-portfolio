import React, { useState } from 'react';
import { X, User, Save, CheckCircle2 } from 'lucide-react';
import { PersonalProfile } from '../../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PersonalProfile;
  onSave: (data: Partial<PersonalProfile>) => Promise<void>;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave
}) => {
  const [form, setForm] = useState<PersonalProfile>({ ...profile });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      await onSave(form);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err: any) {
      alert(err?.message || 'Gagal menyimpan profil');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn text-left">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative border border-gray-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-gray-900">
                Data Identitas & Biodata Kependudukan
              </h3>
              <p className="text-xs text-gray-400">
                Informasi ini tersinkronisasi dengan KTP dan Kartu Keluarga Anda.
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

        {success && (
          <div className="my-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Data pribadi berhasil disimpan dan diperbarui!</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Nama Lengkap Sesuai KTP *
              </label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 font-bold focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Nomor Induk Kependudukan (NIK) *
              </label>
              <input
                type="text"
                required
                maxLength={16}
                value={form.nik}
                onChange={(e) => setForm({ ...form, nik: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 font-mono font-bold focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Nomor Kartu Keluarga (KK)
              </label>
              <input
                type="text"
                maxLength={16}
                value={form.noKk}
                onChange={(e) => setForm({ ...form, noKk: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Tempat Lahir
              </label>
              <input
                type="text"
                value={form.birthPlace}
                onChange={(e) => setForm({ ...form, birthPlace: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Tanggal Lahir
              </label>
              <input
                type="date"
                value={form.birthDate}
                onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Alamat Domisili Lengkap
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">RT / RW</label>
              <input
                type="text"
                value={form.rtRw}
                onChange={(e) => setForm({ ...form, rtRw: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-blue-500"
                placeholder="004/002"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Kelurahan</label>
              <input
                type="text"
                value={form.kelurahan}
                onChange={(e) => setForm({ ...form, kelurahan: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Kecamatan</label>
              <input
                type="text"
                value={form.kecamatan}
                onChange={(e) => setForm({ ...form, kecamatan: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Kota / Kab</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Pekerjaan</label>
              <input
                type="text"
                value={form.occupation}
                onChange={(e) => setForm({ ...form, occupation: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Nomor Telepon / WA</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-3 border-t border-gray-100">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-[#0B132B] hover:bg-blue-900 text-white font-bold text-xs shadow-md transition disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan Biodata'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs"
            >
              Tutup
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
