import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Share2, CheckCircle2 } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { SocialLink } from '../../types';

export const SocialLinksManager: React.FC = () => {
  const { socialLinks, saveSocialData, deleteSocialData } = useData();

  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    platform: 'GitHub',
    url: 'https://github.com',
    icon: 'Github',
    order: 1,
  });

  const handleStartAdd = () => {
    setForm({
      platform: 'GitHub',
      url: 'https://github.com',
      icon: 'Github',
      order: socialLinks.length + 1,
    });
    setEditingLink(null);
    setIsAdding(true);
  };

  const handleStartEdit = (link: SocialLink) => {
    setForm({
      platform: link.platform,
      url: link.url,
      icon: link.icon,
      order: link.order,
    });
    setEditingLink(link);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Hapus tautan media sosial ini?')) {
      await deleteSocialData(id);
      setSuccess('Tautan media sosial berhasil dihapus.');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveSocialData({
      id: editingLink ? editingLink.id : undefined,
      ...form,
      order: Number(form.order),
    });
    setIsAdding(false);
    setEditingLink(null);
    setSuccess('Media sosial berhasil disimpan!');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="space-y-6 text-left max-w-3xl">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-violet-400" />
            <span>Kelola Tautan Media Sosial</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Tautan profil publik di GitHub, LinkedIn, Twitter/X, Instagram, dll.
          </p>
        </div>

        {!isAdding && (
          <button
            onClick={handleStartAdd}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md shadow-violet-600/30 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Sosial Baru</span>
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
            {editingLink ? `Edit Tautan ${editingLink.platform}` : 'Tambah Tautan Baru'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Nama Platform
              </label>
              <input
                type="text"
                required
                value={form.platform}
                onChange={(e) => setForm({ ...form, platform: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                placeholder="GitHub / LinkedIn / Twitter / Instagram"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Tautan Profil (URL)
              </label>
              <input
                type="url"
                required
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md transition"
            >
              Simpan Tautan
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
        {socialLinks.map((link) => (
          <div
            key={link.id}
            className="p-4 rounded-xl bg-[#0D1322] border border-white/10 flex items-center justify-between gap-4"
          >
            <div>
              <h4 className="text-sm font-bold text-white">{link.platform}</h4>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-violet-400 hover:underline"
              >
                {link.url}
              </a>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => handleStartEdit(link)}
                className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/10 text-gray-300 hover:text-white"
                title="Edit"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(link.id)}
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
