import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, MessageSquareQuote } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

export const WebsiteSettingsManager: React.FC = () => {
  const { settings, updateSettingsData } = useData();

  const [form, setForm] = useState({
    siteTitle: settings.siteTitle || '',
    logoText: settings.logoText || 'CodeCraft',
    themeAccent: settings.themeAccent || '#7C3AED',
    footerCopyright: settings.footerCopyright || '© 2024 Alex Developer. All rights reserved.',
    testimonialText: settings.testimonialText || '',
    testimonialAuthor: settings.testimonialAuthor || '',
    testimonialRole: settings.testimonialRole || '',
    testimonialAvatar: settings.testimonialAvatar || '',
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      await updateSettingsData(form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan pengaturan.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-3xl">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-violet-400" />
            <span>Pengaturan Identitas Website & Testimoni</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Ubah teks logo, hak cipta footer, dan kartu kutipan testimoni.
          </p>
        </div>

        {success && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-lg animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            <span>Pengaturan tersimpan!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Branding & Header */}
        <div className="p-6 rounded-2xl bg-[#0D1322] border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white">Identitas Brand & Tampilan</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Teks Logo Navbar
              </label>
              <input
                type="text"
                required
                value={form.logoText}
                onChange={(e) => setForm({ ...form, logoText: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                placeholder="CodeCraft"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Warna Aksen Utama
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.themeAccent}
                  onChange={(e) => setForm({ ...form, themeAccent: e.target.value })}
                  className="w-9 h-9 rounded-lg bg-transparent cursor-pointer border border-white/10"
                />
                <input
                  type="text"
                  value={form.themeAccent}
                  onChange={(e) => setForm({ ...form, themeAccent: e.target.value })}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Teks Hak Cipta Footer
            </label>
            <input
              type="text"
              required
              value={form.footerCopyright}
              onChange={(e) => setForm({ ...form, footerCopyright: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        {/* Testimonial Section */}
        <div className="p-6 rounded-2xl bg-[#0D1322] border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <MessageSquareQuote className="w-4 h-4 text-violet-400" />
            <span>Kartu Testimoni Klien (Bagian Kontak Bawah)</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Isi Kutipan Testimoni
            </label>
            <textarea
              rows={3}
              value={form.testimonialText}
              onChange={(e) => setForm({ ...form, testimonialText: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Nama Pemberi Testimoni
              </label>
              <input
                type="text"
                value={form.testimonialAuthor}
                onChange={(e) => setForm({ ...form, testimonialAuthor: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                placeholder="Sarah Johnson"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Jabatan & Perusahaan
              </label>
              <input
                type="text"
                value={form.testimonialRole}
                onChange={(e) => setForm({ ...form, testimonialRole: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                placeholder="CEO, TechStart"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              URL Foto Avatar Klien
            </label>
            <input
              type="text"
              value={form.testimonialAvatar}
              onChange={(e) => setForm({ ...form, testimonialAvatar: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
              placeholder="https://images.unsplash.com/..."
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md shadow-violet-600/30 transition disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Menyimpan...' : 'SIMPAN PENGATURAN'}</span>
        </button>
      </form>
    </div>
  );
};
