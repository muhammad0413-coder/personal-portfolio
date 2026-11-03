import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Briefcase, CheckCircle2 } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { Experience } from '../../types';

export const ExperienceManager: React.FC = () => {
  const { experiences, saveExperienceData, deleteExperienceData } = useData();

  const [editingItem, setEditingItem] = useState<Experience | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    position: '',
    organization: '',
    startDate: '',
    endDate: '',
    description: '',
    order: 1,
  });

  const handleStartAdd = () => {
    setForm({
      position: '',
      organization: '',
      startDate: '2022',
      endDate: 'Present',
      description: '',
      order: experiences.length + 1,
    });
    setEditingItem(null);
    setIsAdding(true);
  };

  const handleStartEdit = (item: Experience) => {
    setForm({
      position: item.position,
      organization: item.organization,
      startDate: item.startDate,
      endDate: item.endDate,
      description: item.description,
      order: item.order,
    });
    setEditingItem(item);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Yakin ingin menghapus pengalaman kerja ini?')) {
      await deleteExperienceData(id);
      setSuccess('Pengalaman berhasil dihapus.');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveExperienceData({
      id: editingItem ? editingItem.id : undefined,
      ...form,
    });
    setIsAdding(false);
    setEditingItem(null);
    setSuccess('Pengalaman kerja berhasil disimpan!');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="space-y-6 text-left max-w-4xl">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-400" />
            <span>Kelola Riwayat Pengalaman Kerja</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Daftar posisi jabatan, perusahaan, dan tanggung jawab karier profesional.
          </p>
        </div>

        {!isAdding && (
          <button
            onClick={handleStartAdd}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Pengalaman</span>
          </button>
        )}
      </div>

      {success && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {isAdding ? (
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-[#0D1322] border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white mb-2">
            {editingItem ? 'Edit Pengalaman Kerja' : 'Tambah Pengalaman Kerja Baru'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Posisi / Jabatan *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Senior Web Developer"
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Perusahaan / Organisasi *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Apex Digital Studio"
                value={form.organization}
                onChange={(e) => setForm({ ...form, organization: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Waktu Mulai
              </label>
              <input
                type="text"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                placeholder="Contoh: Jan 2022"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Waktu Selesai
              </label>
              <input
                type="text"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                placeholder="Contoh: Present / Des 2023"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Deskripsi Tugas & Dampak Proyek
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
            >
              Simpan Pengalaman
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/10 text-gray-300 text-xs"
            >
              Batal
            </button>
          </div>
        </form>
      ) : null}

      <div className="space-y-3">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="p-4 rounded-xl bg-[#0D1322] border border-white/10 flex items-start justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">{exp.position}</h4>
                <span className="text-[11px] font-mono text-indigo-400 bg-indigo-950/40 border border-indigo-500/20 px-2 py-0.5 rounded">
                  {exp.startDate} - {exp.endDate}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{exp.organization}</p>
              {exp.description && (
                <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                  {exp.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleStartEdit(exp)}
                className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/10 text-gray-300 hover:text-white"
                title="Edit"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(exp.id)}
                className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-950/60 text-red-400"
                title="Hapus"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
