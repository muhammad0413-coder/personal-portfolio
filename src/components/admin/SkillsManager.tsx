import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Award, CheckCircle2 } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { Skill, SkillCategory } from '../../types';

export const SkillsManager: React.FC = () => {
  const { skills, saveSkillData, deleteSkillData } = useData();

  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [success, setSuccess] = useState('');

  const categories: SkillCategory[] = [
    'Technical Skills',
    'Programming Languages',
    'Frameworks',
    'Tools',
    'Soft Skills',
    'Professional Skills',
  ];

  const [form, setForm] = useState({
    name: '',
    category: 'Frameworks' as SkillCategory,
    percentage: 85,
    icon: 'Layers',
    order: 1,
  });

  const handleStartAdd = () => {
    setForm({
      name: '',
      category: 'Frameworks',
      percentage: 80,
      icon: 'Layers',
      order: skills.length + 1,
    });
    setEditingSkill(null);
    setIsAdding(true);
  };

  const handleStartEdit = (skill: Skill) => {
    setForm({
      name: skill.name,
      category: skill.category,
      percentage: skill.percentage,
      icon: skill.icon,
      order: skill.order,
    });
    setEditingSkill(skill);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Yakin ingin menghapus skill ini?')) {
      await deleteSkillData(id);
      setSuccess('Skill berhasil dihapus.');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveSkillData({
      id: editingSkill ? editingSkill.id : undefined,
      ...form,
      percentage: Number(form.percentage),
      order: Number(form.order),
    });
    setIsAdding(false);
    setEditingSkill(null);
    setSuccess('Skill berhasil disimpan!');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="space-y-6 text-left max-w-4xl">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <span>Kelola Keahlian & Keterampilan (Skills)</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Tambah, edit, sesuaikan persentase, dan urutkan progress bar keahlian.
          </p>
        </div>

        {!isAdding && (
          <button
            onClick={handleStartAdd}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md shadow-violet-600/30 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Skill Baru</span>
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
            {editingSkill ? `Edit Skill: ${editingSkill.name}` : 'Tambah Skill Baru'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Nama Keahlian / Teknologi *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: React.js / Docker / Python"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Kategori Skill
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as SkillCategory })}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div className="sm:col-span-2">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-gray-300">
                  Persentase Kemampuan: <span className="text-violet-400 font-mono font-bold">{form.percentage}%</span>
                </label>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={form.percentage}
                onChange={(e) => setForm({ ...form, percentage: Number(e.target.value) })}
                className="w-full accent-violet-500 h-2 bg-gray-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Ikon (Lucide Name)
              </label>
              <input
                type="text"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                placeholder="Code / Layers / Server"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md transition"
            >
              Simpan Skill
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

      {/* Skills list table */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="p-4 rounded-xl bg-[#0D1322] border border-white/10 flex items-center justify-between gap-4"
          >
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-semibold text-white">
                  {skill.name}
                </span>
                <span className="text-xs font-mono font-bold text-violet-400">
                  {skill.percentage}%
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full"
                  style={{ width: `${skill.percentage}%` }}
                />
              </div>
              <span className="text-[10px] text-gray-500 mt-1 block">
                {skill.category}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => handleStartEdit(skill)}
                className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/10 text-gray-300 hover:text-white"
                title="Edit"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(skill.id)}
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
