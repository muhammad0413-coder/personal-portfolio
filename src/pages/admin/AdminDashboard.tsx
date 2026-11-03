import React, { useState } from 'react';
import {
  LayoutDashboard,
  User,
  Image as ImageIcon,
  BarChart2,
  GraduationCap,
  Briefcase,
  Award,
  FolderGit2,
  BookOpen,
  Mail,
  Share2,
  Settings,
  Globe,
  Flame,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Code2,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

import { DashboardOverview } from '../../components/admin/DashboardOverview';
import { ProfileManager } from '../../components/admin/ProfileManager';
import { PhotoCvManager } from '../../components/admin/PhotoCvManager';
import { AboutStatsManager } from '../../components/admin/AboutStatsManager';
import { EducationManager } from '../../components/admin/EducationManager';
import { ExperienceManager } from '../../components/admin/ExperienceManager';
import { SkillsManager } from '../../components/admin/SkillsManager';
import { ProjectsManager } from '../../components/admin/ProjectsManager';
import { BlogManager } from '../../components/admin/BlogManager';
import { MessagesManager } from '../../components/admin/MessagesManager';
import { SocialLinksManager } from '../../components/admin/SocialLinksManager';
import { WebsiteSettingsManager } from '../../components/admin/WebsiteSettingsManager';
import { SeoSettingsManager } from '../../components/admin/SeoSettingsManager';
import { FirebaseSettingsManager } from '../../components/admin/FirebaseSettingsManager';

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { currentUser, isAdmin, logout } = useAuth();
  const { messages, settings } = useData();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const unreadCount = messages.filter((m) => !m.isRead).length;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Profil Saya', icon: User },
    { id: 'photo-cv', label: 'Foto Profil & CV', icon: ImageIcon },
    { id: 'about-stats', label: 'Tentang Saya & Stats', icon: BarChart2 },
    { id: 'education', label: 'Pendidikan', icon: GraduationCap },
    { id: 'experiences', label: 'Pengalaman', icon: Briefcase },
    { id: 'skills', label: 'Skills & Kemampuan', icon: Award },
    { id: 'projects', label: 'Projects & Portfolio', icon: FolderGit2 },
    { id: 'blog', label: 'Blog & Artikel', icon: BookOpen },
    { id: 'messages', label: 'Pesan Masuk', icon: Mail, badge: unreadCount > 0 ? unreadCount : undefined },
    { id: 'social', label: 'Media Sosial', icon: Share2 },
    { id: 'settings', label: 'Pengaturan Website', icon: Settings },
    { id: 'seo', label: 'Pengaturan SEO', icon: Globe },
    { id: 'firebase', label: 'Pengaturan Firebase', icon: Flame },
  ];

  const handleLogout = async () => {
    if (confirm('Apakah Anda yakin ingin keluar dari panel administrator?')) {
      await logout();
      onNavigate('/login');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview onSelectTab={setActiveTab} onNavigate={onNavigate} />;
      case 'profile':
        return <ProfileManager />;
      case 'photo-cv':
        return <PhotoCvManager />;
      case 'about-stats':
        return <AboutStatsManager />;
      case 'education':
        return <EducationManager />;
      case 'experiences':
        return <ExperienceManager />;
      case 'skills':
        return <SkillsManager />;
      case 'projects':
        return <ProjectsManager />;
      case 'blog':
        return <BlogManager />;
      case 'messages':
        return <MessagesManager />;
      case 'social':
        return <SocialLinksManager />;
      case 'settings':
        return <WebsiteSettingsManager />;
      case 'seo':
        return <SeoSettingsManager />;
      case 'firebase':
        return <FirebaseSettingsManager />;
      default:
        return <DashboardOverview onSelectTab={setActiveTab} onNavigate={onNavigate} />;
    }
  };

  const activeItem = menuItems.find((m) => m.id === activeTab) || menuItems[0];

  return (
    <div className="min-h-screen bg-[#080C14] text-gray-100 flex flex-col md:flex-row">
      
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0B101E] border-b border-white/10 z-30 sticky top-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white">
            <Code2 className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-white">Admin Panel</span>
        </div>

        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 text-gray-300 hover:text-white"
        >
          {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar for Desktop & Mobile Overlay */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-[#0B101E] border-r border-white/10 flex flex-col justify-between z-40 transition-transform duration-300 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand & Identity */}
        <div>
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-violet-500/20">
                <Code2 className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h1 className="font-bold text-sm text-white tracking-tight leading-tight">
                  {settings.logoText || 'CodeCraft'}
                </h1>
                <span className="text-[10px] text-violet-400 font-mono">
                  Administrator
                </span>
              </div>
            </div>

            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden p-1 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Menu (14 submodules) */}
          <nav className="p-3 space-y-1 max-h-[calc(100vh-160px)] overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                    isActive
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-black">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Logout */}
        <div className="p-3 border-t border-white/10 space-y-2">
          <button
            onClick={() => onNavigate('/')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-gray-400 hover:text-white hover:bg-white/[0.04] transition"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-violet-400" />
              <span>Lihat Web Publik</span>
            </div>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-950/30 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Topbar */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-[#0B101E]/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-20">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>Admin</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-medium">{activeItem.label}</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400 font-mono">
              {currentUser?.email || 'admin@codecraft.dev'}
            </span>
            <button
              onClick={() => onNavigate('/')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/10 text-xs text-gray-300 hover:text-white transition"
            >
              <span>Web Publik</span>
              <ExternalLink className="w-3.5 h-3.5 text-violet-400" />
            </button>
          </div>
        </header>

        {/* Panel View */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {renderContent()}
        </main>

      </div>

    </div>
  );
};
