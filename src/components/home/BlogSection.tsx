import React, { useState } from 'react';
import { Search, Calendar, Clock, ArrowRight, X, BookOpen } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { BlogPost } from '../../types';

export const BlogSection: React.FC = () => {
  const { blogPosts } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Filter only published posts for the public view
  const publishedPosts = blogPosts.filter((b) => b.status === 'published');

  const filteredPosts = publishedPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <section id="blog" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-900/30 border border-violet-500/30 text-violet-300 text-xs font-semibold tracking-wider uppercase mb-4">
            <span>MY WRITINGS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
            Latest Articles & Thoughts
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl">
            Sharing insights about web architecture, frontend performance, cloud databases, and software design.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari topik atau judul artikel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0D1322] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-violet-500 transition"
            />
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="group cursor-pointer rounded-2xl bg-[#0D1322]/80 border border-white/[0.08] hover:border-violet-500/40 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl text-left"
            >
              <div className="aspect-[16/9] w-full overflow-hidden bg-gray-900 relative">
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1516116211227-bbc003923bb2?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-violet-300 text-xs font-mono font-medium">
                  {post.category}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-2.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.publishedAt}
                    </span>
                    {post.readTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readTime}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-violet-400 transition-colors mb-2 line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-medium text-violet-400 group-hover:text-violet-300">
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12 text-gray-500 text-sm">
            Tidak ada artikel yang sesuai dengan pencarian Anda.
          </div>
        )}

      </div>

      {/* Article Read Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0B101E] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative text-left">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-5 right-5 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-[16/8] w-full rounded-xl overflow-hidden mb-6 border border-white/10">
              <img
                src={selectedPost.thumbnail}
                alt={selectedPost.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
              <span className="px-2.5 py-1 rounded bg-violet-950/60 text-violet-300 font-medium">
                {selectedPost.category}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {selectedPost.publishedAt}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                {selectedPost.readTime || '5 min read'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-6">
              {selectedPost.title}
            </h2>

            <div className="prose prose-invert max-w-none text-gray-300 text-sm sm:text-base leading-relaxed space-y-4">
              {selectedPost.content.split('\n\n').map((paragraph, i) => {
                if (paragraph.startsWith('## ')) {
                  return (
                    <h3 key={i} className="text-xl font-bold text-white pt-2">
                      {paragraph.replace('## ', '')}
                    </h3>
                  );
                }
                if (paragraph.startsWith('### ')) {
                  return (
                    <h4 key={i} className="text-lg font-semibold text-violet-300 pt-2">
                      {paragraph.replace('### ', '')}
                    </h4>
                  );
                }
                return <p key={i}>{paragraph}</p>;
              })}
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
