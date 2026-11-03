import React, { useState } from 'react';
import { Save, CheckCircle2, User, Terminal } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

export const ProfileManager: React.FC = () => {
  const { profile, updateProfileData } = useData();

  const [form, setForm] = useState({
    name: profile.name || '',
    nickname: profile.nickname || '',
    profession: profile.profession || '',
    shortDescription: profile.shortDescription || '',
    aboutDescription: profile.aboutDescription || '',
    email: profile.email || '',
    phone: profile.phone || '',
    address: profile.address || '',
    codeSnippet: profile.codeSnippet || '',
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      await updateProfileData(form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan profil. Coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-4xl">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-violet-400" />
            <span>Kelola Profil & Biodata Utama</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Informasi ini otomatis tampil di bagian Hero, About, dan Contact website publik.
          </p>
        </div>

        {success && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-lg animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            <span>Perubahan tersimpan!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Nama Lengkap
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0D1322] border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Nama Panggilan / Display Name
            </label>
            <input
              type="text"
              required
              value={form.nickname}
              onChange={(e) => setForm({ ...form, nickname: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0D1322] border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">
            Jabatan / Profesi (Hero Badge)
          </label>
          <input
            type="text"
            required
            value={form.profession}
            onChange={(e) => setForm({ ...form, profession: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[#0D1322] border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500 transition"
            placeholder="Contoh: I'M A WEB DEVELOPER"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">
            Deskripsi Singkat (Hero Section)
          </label>
          <textarea
            rows={2}
            value={form.shortDescription}
            onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[#0D1322] border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500 transition resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">
            Deskripsi Lengkap (About Me Section)
          </label>
          <textarea
            rows={4}
            value={form.aboutDescription}
            onChange={(e) => setForm({ ...form, aboutDescription: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[#0D1322] border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500 transition resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Email Publik
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0D1322] border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Nomor Telepon / WhatsApp
            </label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0D1322] border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Alamat / Lokasi Kerja
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0D1322] border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500 transition"
            />
          </div>
        </div>

        {/* Code Snippet Card editor */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-violet-400" />
            <span>Cuplikan Kode Kartu Hero (Code Snippet Card)</span>
          </label>
          <textarea
            rows={5}
            value={form.codeSnippet}
            onChange={(e) => setForm({ ...form, codeSnippet: e.target.value })}
            className="w-full p-4 rounded-xl bg-black/60 font-mono text-xs text-amber-300 border border-white/10 focus:outline-none focus:border-violet-500 transition leading-relaxed resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md shadow-violet-600/30 transition disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Menyimpan...' : 'SIMPAN PERUBAHAN'}</span>
        </button>
      </form>
    </div>
  );
};
