import React, { useState } from 'react';
import {
  Mail,
  Trash2,
  CheckCircle,
  Clock,
  Send,
  User,
  Inbox,
  CheckCheck
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';

export const MessagesManager: React.FC = () => {
  const { messages, markMessageAsRead, deleteMessageData } = useData();
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const filteredMessages = messages.filter((m) => {
    if (filter === 'unread') return !m.isRead;
    if (filter === 'read') return m.isRead;
    return true;
  });

  const handleDelete = async (id: string) => {
    if (confirm('Hapus pesan ini secara permanen?')) {
      await deleteMessageData(id);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-4xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Inbox className="w-5 h-5 text-amber-400" />
            <span>Kotak Pesan Masuk (Contact Form)</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Semua pesan yang dikirim oleh pengunjung melalui formulir kontak publik.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 bg-[#0D1322] p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
              filter === 'all'
                ? 'bg-violet-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Semua ({messages.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
              filter === 'unread'
                ? 'bg-amber-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Belum Dibaca ({messages.filter((m) => !m.isRead).length})
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredMessages.map((msg) => (
          <div
            key={msg.id}
            className={`p-5 rounded-2xl border transition text-left ${
              msg.isRead
                ? 'bg-[#0D1322]/60 border-white/5 opacity-85'
                : 'bg-[#0F172A] border-violet-500/30 shadow-lg shadow-violet-950/20'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-violet-950/60 border border-violet-500/20 flex items-center justify-center text-violet-400">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{msg.name}</span>
                    {!msg.isRead && (
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                    )}
                  </h4>
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-xs text-violet-400 hover:underline"
                  >
                    {msg.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                <Clock className="w-3.5 h-3.5" />
                <span>{new Date(msg.createdAt).toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-black/30 rounded-xl p-3.5 mb-4 border border-white/5">
              <p className="text-xs font-semibold text-gray-200 mb-1">
                Subjek: {msg.subject}
              </p>
              <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">
                {msg.message}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => markMessageAsRead(msg.id, !msg.isRead)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/10 text-xs text-gray-300 transition"
                >
                  <CheckCheck className="w-3.5 h-3.5 text-violet-400" />
                  <span>
                    {msg.isRead ? 'Tandai Belum Dibaca' : 'Tandai Selesai Dibaca'}
                  </span>
                </button>

                <a
                  href={`mailto:${msg.email}?subject=Balasan: ${encodeURIComponent(
                    msg.subject
                  )}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-xs text-white font-medium transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Balas via Email</span>
                </a>
              </div>

              <button
                onClick={() => handleDelete(msg.id)}
                className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 transition"
                title="Hapus Pesan"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {filteredMessages.length === 0 && (
          <div className="text-center py-12 text-gray-500 text-xs">
            Tidak ada pesan pada filter ini.
          </div>
        )}
      </div>
    </div>
  );
};
