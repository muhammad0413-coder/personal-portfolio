import React from 'react';
import {
  LayoutDashboard,
  FileText,
  GraduationCap,
  CreditCard,
  Car,
  User,
  Upload,
  Database,
  Trophy,
  ShieldCheck,
  X
} from 'lucide-react';
import { DocumentCategory } from '../../types';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenUpload: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  mobileOpen,
  onCloseMobile,
  onOpenUpload
}) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'Kependudukan', label: 'Kependudukan (KTP/KK)', icon: FileText, isCategory: true },
    { id: 'Pendidikan', label: 'Ijazah & Pendidikan', icon: GraduationCap, isCategory: true },
    { id: 'Finansial & Pajak', label: 'Pajak & NPWP', icon: CreditCard, isCategory: true },
    { id: 'Lisensi & Kendaraan', label: 'SIM & Kendaraan', icon: Car, isCategory: true },
    { id: 'biodata', label: 'Biodata & Identitas', icon: User },
    { id: 'cloud', label: 'Status Cloud Firebase', icon: Database },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#0B132B] text-white flex flex-col justify-between z-50 transition-transform duration-300 shadow-2xl lg:shadow-none ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Logo Brand Header */}
          <div className="p-6 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h1 className="font-extrabold text-sm tracking-wider uppercase leading-tight text-white">
                  DATA PRIBADI
                </h1>
                <p className="text-[10px] font-bold text-blue-400 tracking-widest uppercase">
                  ARSIP & DOKUMEN
                </p>
              </div>
            </div>

            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Upload Button */}
          <div className="px-4 pt-5 pb-2">
            <button
              onClick={() => {
                onOpenUpload();
                onCloseMobile();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Unggah Dokumen Baru</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 text-left">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25 font-bold'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Trophy Quote Card matching Screenshot */}
        <div className="p-4">
          <div className="p-4 rounded-2xl bg-[#080D1D] border border-white/5 text-center relative overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto mb-2.5 shadow-inner">
              <Trophy className="w-5 h-5" />
            </div>
            <p className="text-[11px] text-gray-300 italic leading-relaxed">
              "Data pribadi, KTP & KK tersimpan aman dan siap diunduh kapan saja."
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
