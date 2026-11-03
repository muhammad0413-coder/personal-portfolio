import React, { useState } from 'react';
import { Plus, Edit2, Trash2, FolderGit2, Upload, ExternalLink, CheckCircle2 } from 'lucide-react';
import { GithubIcon } from '../common/BrandIcons';
import { useData } from '../../contexts/DataContext';
import { Project } from '../../types';
import { uploadFile } from '../../services/storage';

export const ProjectsManager: React.FC = () => {
  const { projects, saveProjectData, deleteProjectData } = useData();

  const [editingProj, setEditingProj] = useState<Project | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [success, setSuccess] = useState('');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    thumbnail: '',
    technologiesStr: 'React, TypeScript, Tailwind CSS',
    demoUrl: '',
    githubUrl: '',
    category: 'Web Application',
    featured: true,
    order: 1,
  });

  const handleStartAdd = () => {
    setForm({
      title: '',
      description: '',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80',
      technologiesStr: 'React, TypeScript, Tailwind CSS, Firebase',
      demoUrl: 'https://example.com',
      githubUrl: 'https://github.com/example/repo',
      category: 'Full Stack',
      featured: true,
      order: projects.length + 1,
    });
    setEditingProj(null);
    setIsAdding(true);
  };

  const handleStartEdit = (proj: Project) => {
    setForm({
      title: proj.title,
      description: proj.description,
      thumbnail: proj.thumbnail,
      technologiesStr: proj.technologies ? proj.technologies.join(', ') : '',
      demoUrl: proj.demoUrl || '',
      githubUrl: proj.githubUrl || '',
      category: proj.category,
      featured: proj.featured,
      order: proj.order,
    });
    setEditingProj(proj);
    setIsAdding(true);
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress(0);
    try {
      const url = await uploadFile(file, {
        folder: 'projects',
        maxSizeMB: 5,
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
        onProgress: (p) => setUploadProgress(p),
      });
      setForm((prev) => ({ ...prev, thumbnail: url }));
    } catch (err: any) {
      alert(err?.message || 'Gagal mengunggah thumbnail proyek');
    } finally {
      setUploadProgress(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Yakin ingin menghapus proyek ini?')) {
      await deleteProjectData(id);
      setSuccess('Proyek berhasil dihapus.');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const techArray = form.technologiesStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    await saveProjectData({
      id: editingProj ? editingProj.id : undefined,
      title: form.title,
      description: form.description,
      thumbnail: form.thumbnail,
      technologies: techArray,
      demoUrl: form.demoUrl,
      githubUrl: form.githubUrl,
      category: form.category,
      featured: form.featured,
      createdAt: editingProj ? editingProj.createdAt : new Date().toISOString().split('T')[0],
      order: Number(form.order),
    });

    setIsAdding(false);
    setEditingProj(null);
    setSuccess('Proyek berhasil disimpan!');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="space-y-6 text-left max-w-4xl">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-violet-400" />
            <span>Kelola Galeri Proyek & Portfolio</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Daftar karya proyek yang muncul di bagian Featured Projects.
          </p>
        </div>

        {!isAdding && (
          <button
            onClick={handleStartAdd}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md shadow-violet-600/30 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Proyek Baru</span>
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
            {editingProj ? `Edit Proyek: ${editingProj.title}` : 'Tambah Proyek Baru'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Judul Proyek *
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Kategori Proyek
              </label>
              <input
                type="text"
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                placeholder="Full Stack / Web App / Dashboard"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Deskripsi Proyek *
            </label>
            <textarea
              rows={3}
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Thumbnail Proyek (URL atau Unggah File)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={form.thumbnail}
                onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                className="flex-1 px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
              />
              <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-600/30 hover:bg-violet-600/40 text-violet-300 border border-violet-500/30 text-xs font-medium cursor-pointer transition">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="hidden"
                />
              </label>
            </div>
            {uploadProgress !== null && (
              <p className="text-[11px] text-violet-400 mt-1">
                Mengunggah thumbnail: {uploadProgress}%
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Daftar Teknologi (Pisahkan dengan koma)
            </label>
            <input
              type="text"
              value={form.technologiesStr}
              onChange={(e) => setForm({ ...form, technologiesStr: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
              placeholder="React, TypeScript, Tailwind CSS, Firebase"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Link Live Demo
              </label>
              <input
                type="text"
                value={form.demoUrl}
                onChange={(e) => setForm({ ...form, demoUrl: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Link GitHub Repository
              </label>
              <input
                type="text"
                value={form.githubUrl}
                onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                placeholder="https://github.com/..."
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md transition"
            >
              Simpan Proyek
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

      {/* Projects List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="p-4 rounded-xl bg-[#0D1322] border border-white/10 flex flex-col justify-between"
          >
            <div>
              <div className="aspect-[16/9] w-full rounded-lg overflow-hidden bg-gray-900 mb-3 border border-white/5">
                <img
                  src={proj.thumbnail}
                  alt={proj.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-bold text-white">{proj.title}</h4>
                <span className="text-[10px] font-mono text-violet-400 bg-violet-950/40 border border-violet-500/20 px-2 py-0.5 rounded">
                  {proj.category}
                </span>
              </div>

              <p className="text-xs text-gray-400 line-clamp-2 mb-3">
                {proj.description}
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <div className="flex gap-2">
                {proj.demoUrl && (
                  <a
                    href={proj.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white"
                    title="Live Demo"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {proj.githubUrl && (
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white"
                    title="GitHub"
                  >
                    <GithubIcon className="w-4 h-4" />
                  </a>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleStartEdit(proj)}
                  className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/10 text-gray-300 hover:text-white"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(proj.id)}
                  className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-950/60 text-red-400"
                  title="Hapus"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
