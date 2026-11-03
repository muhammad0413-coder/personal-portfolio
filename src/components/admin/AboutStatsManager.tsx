import React, { useState } from 'react';
import { Save, CheckCircle2, BarChart2 } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

export const AboutStatsManager: React.FC = () => {
  const { profile, updateProfileData } = useData();

  const [form, setForm] = useState({
    yearsExperience: profile.yearsExperience || '4+',
    projectsCount: profile.projectsCount || '50+',
    clientsCount: profile.clientsCount || '30+',
    satisfactionRate: profile.satisfactionRate || '100%',
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
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan statistik.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-2xl">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-violet-400" />
            <span>Pengaturan 4 Kartu Statistik (About Me)</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Nilai statistik yang ditampilkan di sisi kanan bagian Tentang Saya.
          </p>
        </div>

        {success && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-lg animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            <span>Tersimpan!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Tahun Pengalaman (Years Experience)
            </label>
            <input
              type="text"
              required
              value={form.yearsExperience}
              onChange={(e) => setForm({ ...form, yearsExperience: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0D1322] border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
              placeholder="Contoh: 4+"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Jumlah Proyek (Projects Completed)
            </label>
            <input
              type="text"
              required
              value={form.projectsCount}
              onChange={(e) => setForm({ ...form, projectsCount: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0D1322] border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
              placeholder="Contoh: 50+"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Klien Senang (Happy Clients)
            </label>
            <input
              type="text"
              required
              value={form.clientsCount}
              onChange={(e) => setForm({ ...form, clientsCount: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0D1322] border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
              placeholder="Contoh: 30+"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Tingkat Kepuasan (Client Satisfaction)
            </label>
            <input
              type="text"
              required
              value={form.satisfactionRate}
              onChange={(e) => setForm({ ...form, satisfactionRate: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0D1322] border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
              placeholder="Contoh: 100%"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md shadow-violet-600/30 transition disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Menyimpan...' : 'SIMPAN STATISTIK'}</span>
        </button>
      </form>
    </div>
  );
};
