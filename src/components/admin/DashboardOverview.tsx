import React from 'react';
import {
  FolderGit2,
  BookOpen,
  Award,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ExternalLink,
  Sparkles,
  Database
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { isFirebaseConfigured } from '../../services/firebase';

interface DashboardOverviewProps {
  onSelectTab: (tab: string) => void;
  onNavigate: (path: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onSelectTab,
  onNavigate
}) => {
  const {
    profile,
    projects,
    blogPosts,
    skills,
    messages,
    settings,
  } = useData();

  const isConnected = isFirebaseConfigured();
  const unreadMessagesCount = messages.filter((m) => !m.isRead).length;

  const summaryCards = [
    {
      title: 'Total Proyek',
      value: projects.length,
      icon: FolderGit2,
      tab: 'projects',
      color: 'text-violet-400',
      bg: 'bg-violet-950/30',
      border: 'border-violet-500/20',
    },
    {
      title: 'Total Artikel Blog',
      value: blogPosts.length,
      icon: BookOpen,
      tab: 'blog',
      color: 'text-blue-400',
      bg: 'bg-blue-950/30',
      border: 'border-blue-500/20',
    },
    {
      title: 'Total Keahlian / Skills',
      value: skills.length,
      icon: Award,
      tab: 'skills',
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/30',
      border: 'border-emerald-500/20',
    },
    {
      title: 'Pesan Masuk',
      value: messages.length,
      badge: unreadMessagesCount > 0 ? `${unreadMessagesCount} Baru` : undefined,
      icon: Mail,
      tab: 'messages',
      color: 'text-amber-400',
      bg: 'bg-amber-950/30',
      border: 'border-amber-500/20',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn text-left">
      
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-violet-900/40 via-indigo-900/20 to-transparent border border-violet-500/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Administrator Control Center</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Selamat Datang, {profile.nickname || profile.name || 'Alex'}!
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-xl">
            Kelola profil, portfolio proyek, artikel, pesan pengunjung, serta konfigurasi cloud Firebase secara langsung.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs font-semibold border border-white/10 transition shrink-0"
        >
          <span>Lihat Web Publik</span>
          <ExternalLink className="w-3.5 h-3.5 text-violet-400" />
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => onSelectTab(card.tab)}
              className="p-5 rounded-2xl bg-[#0D1322] border border-white/10 hover:border-violet-500/40 hover:bg-[#11192e] transition cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-400">
                  {card.title}
                </span>
                <div
                  className={`w-9 h-9 rounded-xl ${card.bg} ${card.border} border flex items-center justify-center`}
                >
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-white">
                  {card.value}
                </span>
                {card.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {card.badge}
                  </span>
                )}
                <span className="text-[11px] text-gray-500 group-hover:text-violet-400 flex items-center gap-0.5 transition">
                  <span>Kelola</span>
                  <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Columns: Firebase Status & Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Firebase Status Card */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0D1322] border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-violet-400" />
                <span>Status Koneksi Firebase</span>
              </h3>
              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                  isConnected
                    ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-950/40 text-amber-300 border border-amber-500/30'
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    isConnected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
                  }`}
                />
                <span>{isConnected ? 'Terhubung' : 'Demo / Resilient Mode'}</span>
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              {isConnected
                ? 'Aplikasi telah berhasil terhubung ke Cloud Firestore, Firebase Authentication, dan Firebase Storage. Semua perubahan langsung tersimpan ke cloud.'
                : 'Aplikasi saat ini beroperasi dengan initial seed data dan penyimpanan lokal yang aman. Masukkan kredensial Firebase di .env untuk mengaktifkan cloud realtime.'}
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-gray-400">Firebase Auth</span>
                <span className="text-gray-200 font-mono">
                  {isConnected ? 'Aktif (Email + Google)' : 'Simulated Ready'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-gray-400">Cloud Firestore</span>
                <span className="text-gray-200 font-mono">
                  {isConnected ? 'Aktif (Real-time)' : 'Local Storage Cache'}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-gray-400">Firebase Storage</span>
                <span className="text-gray-200 font-mono">
                  {isConnected ? 'Aktif (Cloud Bucket)' : 'Base64 Local Preview'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-6 border-t border-white/10">
            <button
              onClick={() => onSelectTab('firebase')}
              className="w-full py-2.5 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 text-xs font-semibold transition"
            >
              Konfigurasi & Inisialisasi Firebase
            </button>
          </div>
        </div>

        {/* Recent Messages Card */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0D1322] border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400" />
              <span>Pesan Masuk Terbaru</span>
            </h3>
            <button
              onClick={() => onSelectTab('messages')}
              className="text-xs text-violet-400 hover:text-violet-300"
            >
              Lihat Semua ({messages.length})
            </button>
          </div>

          <div className="space-y-3">
            {messages.slice(0, 3).map((msg) => (
              <div
                key={msg.id}
                onClick={() => onSelectTab('messages')}
                className={`p-3.5 rounded-xl border transition cursor-pointer ${
                  msg.isRead
                    ? 'bg-white/[0.02] border-white/5 opacity-80'
                    : 'bg-violet-950/20 border-violet-500/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">
                    {msg.name}
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs font-medium text-violet-300 mb-0.5">
                  {msg.subject}
                </p>
                <p className="text-xs text-gray-400 line-clamp-1">
                  {msg.message}
                </p>
              </div>
            ))}

            {messages.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-xs">
                Belum ada pesan masuk dari formulir kontak.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
