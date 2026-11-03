import React, { useState } from 'react';
import { Globe, Save, CheckCircle2, Search } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

export const SeoSettingsManager: React.FC = () => {
  const { settings, updateSettingsData } = useData();

  const [form, setForm] = useState({
    seoTitle: settings.seoTitle || 'Alex — Senior Web Developer & Full-Stack Specialist',
    seoDescription: settings.seoDescription || 'Personal portfolio and profile of Alex, a passionate web developer specializing in building modern web apps, sleek UI/UX, and scalable cloud systems.',
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
      alert('Gagal menyimpan SEO.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-3xl">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-violet-400" />
            <span>Pengaturan SEO & Meta Tags</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Optimalkan tampilan website pada hasil pencarian Google dan pratinjau media sosial.
          </p>
        </div>

        {success && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-lg animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            <span>SEO tersimpan!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-6 rounded-2xl bg-[#0D1322] border border-white/10 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Judul Halaman (Meta SEO Title)
            </label>
            <input
              type="text"
              required
              value={form.seoTitle}
              onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Disarankan 50 - 60 karakter untuk keterbacaan optimal di Google.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Deskripsi Halaman (Meta Description)
            </label>
            <textarea
              rows={3}
              required
              value={form.seoDescription}
              onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500 resize-none"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Disarankan 120 - 160 karakter ringkas yang merangkum keahlian Anda.
            </p>
          </div>
        </div>

        {/* Live Google Search Preview */}
        <div className="p-5 rounded-2xl bg-[#0B0F19] border border-white/10 text-left">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            <Search className="w-3.5 h-3.5 text-blue-400" />
            <span>Pratinjau Hasil Pencarian Google (SERP Preview)</span>
          </div>

          <div className="bg-[#1F1F1F] p-4 rounded-xl border border-white/5 space-y-1">
            <div className="text-[11px] text-gray-400 flex items-center gap-1 font-sans">
              <span className="text-white font-medium">https://codecraft.dev</span>
            </div>
            <h4 className="text-sm font-medium text-[#8AB4F8] hover:underline cursor-pointer">
              {form.seoTitle || 'Alex — Senior Web Developer & Full-Stack Specialist'}
            </h4>
            <p className="text-xs text-[#BDC1C6] leading-relaxed">
              {form.seoDescription ||
                'Personal portfolio and profile of Alex, a passionate web developer specializing in building modern web apps, sleek UI/UX, and scalable cloud systems.'}
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md shadow-violet-600/30 transition disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Menyimpan...' : 'SIMPAN PENGATURAN SEO'}</span>
        </button>
      </form>
    </div>
  );
};
