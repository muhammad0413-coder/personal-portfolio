import React, { useState } from 'react';
import { Plus, Edit2, Trash2, BookOpen, Upload, Calendar, CheckCircle2 } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { BlogPost } from '../../types';
import { uploadFile } from '../../services/storage';

export const BlogManager: React.FC = () => {
  const { blogPosts, saveBlogData, deleteBlogData } = useData();

  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [success, setSuccess] = useState('');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    thumbnail: '',
    category: 'Development',
    status: 'published' as 'published' | 'draft',
    readTime: '5 min read',
  });

  const handleStartAdd = () => {
    setForm({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80',
      category: 'Development',
      status: 'published',
      readTime: '5 min read',
    });
    setEditingPost(null);
    setIsAdding(true);
  };

  const handleStartEdit = (post: BlogPost) => {
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      thumbnail: post.thumbnail,
      category: post.category,
      status: post.status,
      readTime: post.readTime || '5 min read',
    });
    setEditingPost(post);
    setIsAdding(true);
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress(0);
    try {
      const url = await uploadFile(file, {
        folder: 'blog',
        maxSizeMB: 5,
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
        onProgress: (p) => setUploadProgress(p),
      });
      setForm((prev) => ({ ...prev, thumbnail: url }));
    } catch (err: any) {
      alert(err?.message || 'Gagal mengunggah gambar artikel');
    } finally {
      setUploadProgress(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Yakin ingin menghapus artikel blog ini?')) {
      await deleteBlogData(id);
      setSuccess('Artikel berhasil dihapus.');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug =
      form.slug ||
      form.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    await saveBlogData({
      id: editingPost ? editingPost.id : undefined,
      title: form.title,
      slug,
      excerpt: form.excerpt,
      content: form.content,
      thumbnail: form.thumbnail,
      category: form.category,
      status: form.status,
      publishedAt: editingPost ? editingPost.publishedAt : new Date().toISOString().split('T')[0],
      readTime: form.readTime,
    });

    setIsAdding(false);
    setEditingPost(null);
    setSuccess('Artikel blog berhasil disimpan!');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="space-y-6 text-left max-w-4xl">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <span>Kelola Artikel & Publikasi Blog</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Tulis artikel, panduan teknis, dan catatan pengembangan software.
          </p>
        </div>

        {!isAdding && (
          <button
            onClick={handleStartAdd}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md shadow-violet-600/30 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Tulis Artikel Baru</span>
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
            {editingPost ? `Edit Artikel: ${editingPost.title}` : 'Tulis Artikel Baru'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Judul Artikel *
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
                Status Publikasi
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as 'published' | 'draft' })}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
              >
                <option value="published">Published (Tayang)</option>
                <option value="draft">Draft (Draf Rahasia)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Kategori Artikel
              </label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                placeholder="Development / Security / Architecture"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Estimasi Waktu Baca
              </label>
              <input
                type="text"
                value={form.readTime}
                onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                placeholder="5 min read"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Thumbnail Artikel (URL atau Upload)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
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
                Mengunggah gambar: {uploadProgress}%
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Ringkasan Singkat (Excerpt) *
            </label>
            <textarea
              rows={2}
              required
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Konten Lengkap Artikel (Mendukung Markdown `## Subheading`) *
            </label>
            <textarea
              rows={8}
              required
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-violet-500 leading-relaxed"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md transition"
            >
              Simpan Artikel
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

      {/* Blog Posts List */}
      <div className="space-y-3">
        {blogPosts.map((post) => (
          <div
            key={post.id}
            className="p-4 rounded-xl bg-[#0D1322] border border-white/10 flex items-start justify-between gap-4"
          >
            <div className="flex gap-4">
              <div className="w-20 h-16 rounded-lg overflow-hidden bg-gray-900 shrink-0">
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      post.status === 'published'
                        ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-950/40 text-amber-300 border border-amber-500/20'
                    }`}
                  >
                    {post.status.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {post.publishedAt}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white mb-1">
                  {post.title}
                </h4>

                <p className="text-xs text-gray-400 line-clamp-1 max-w-xl">
                  {post.excerpt}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => handleStartEdit(post)}
                className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/10 text-gray-300 hover:text-white"
                title="Edit"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(post.id)}
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
