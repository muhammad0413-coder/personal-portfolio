import React, { useState } from 'react';
import { Plus, Edit2, Trash2, GraduationCap, CheckCircle2 } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { Education } from '../../types';

export const EducationManager: React.FC = () => {
  const { education, saveEducationData, deleteEducationData } = useData();

  const [editingItem, setEditingItem] = useState<Education | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    institution: '',
    degree: '',
    major: '',
    startYear: '',
    endYear: '',
    description: '',
    order: 1,
  });

  const handleStartAdd = () => {
    setForm({
      institution: '',
      degree: 'Bachelor of Science',
      major: '',
      startYear: '2020',
      endYear: '2024',
      description: '',
      order: education.length + 1,
    });
    setEditingItem(null);
    setIsAdding(true);
  };

  const handleStartEdit = (item: Education) => {
    setForm({
      institution: item.institution,
      degree: item.degree,
      major: item.major,
      startYear: item.startYear,
      endYear: item.endYear,
      description: item.description,
      order: item.order,
    });
    setEditingItem(item);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Yakin ingin menghapus riwayat pendidikan ini?')) {
      await deleteEducationData(id);
      setSuccess('Pendidikan berhasil dihapus.');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveEducationData({
      id: editingItem ? editingItem.id : undefined,
      ...form,
    });
    setIsAdding(false);
    setEditingItem(null);
    setSuccess('Pendidikan berhasil disimpan!');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="space-y-6 text-left max-w-4xl">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-violet-400" />
            <span>Kelola Riwayat Pendidikan</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Daftar institusi, gelar, dan pendidikan yang telah diselesaikan.
          </p>
        </div>

        {!isAdding && (
          <button
            onClick={handleStartAdd}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md shadow-violet-600/30 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Pendidikan</span>
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
            {editingItem ? 'Edit Riwayat Pendidikan' : 'Tambah Riwayat Pendidikan Baru'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Institusi / Universitas *
              </label>
              <input
                type="text"
                required
                value={form.institution}
                onChange={(e) => setForm({ ...form, institution: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Gelar / Jenjang *
              </label>
              <input
                type="text"
                required
                value={form.degree}
                onChange={(e) => setForm({ ...form, degree: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Jurusan / Program Studi
              </label>
              <input
                type="text"
                value={form.major}
                onChange={(e) => setForm({ ...form, major: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Tahun Mulai
              </label>
              <input
                type="text"
                value={form.startYear}
                onChange={(e) => setForm({ ...form, startYear: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Tahun Selesai
              </label>
              <input
                type="text"
                value={form.endYear}
                onChange={(e) => setForm({ ...form, endYear: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Deskripsi / Prestasi
            </label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500 resize-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold"
            >
              Simpan Pendidikan
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
        {education.map((edu) => (
          <div
            key={edu.id}
            className="p-4 rounded-xl bg-[#0D1322] border border-white/10 flex items-start justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">{edu.institution}</h4>
                <span className="text-[11px] font-mono text-violet-400 bg-violet-950/40 border border-violet-500/20 px-2 py-0.5 rounded">
                  {edu.startYear} - {edu.endYear}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                {edu.degree} {edu.major ? `dalam ${edu.major}` : ''}
              </p>
              {edu.description && (
                <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                  {edu.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleStartEdit(edu)}
                className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/10 text-gray-300 hover:text-white"
                title="Edit"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(edu.id)}
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
