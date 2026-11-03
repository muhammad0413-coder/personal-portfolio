import React from 'react';
import { Menu, Printer, User, ChevronDown } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

interface HeaderProps {
  onToggleMobile: () => void;
  onOpenProfile: () => void;
  selectedYear: string;
  onChangeYear: (yr: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleMobile,
  onOpenProfile,
  selectedYear,
  onChangeYear,
}) => {
  const { profile } = useData();

  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-200/80">
      
      {/* Left: Overview Headline */}
      <div className="flex items-center gap-3 text-left">
        <button
          onClick={onToggleMobile}
          className="lg:hidden p-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-xs"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-baseline gap-2.5">
            <h1 className="text-2xl font-black text-[#0B132B] tracking-tight">
              OVERVIEW
            </h1>
            <span className="text-xs sm:text-sm font-medium text-gray-400">
              Ringkasan Data & Dokumen Pribadi
            </span>
          </div>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Pemilik Arsip: <span className="font-bold text-gray-800">{profile.fullName || 'Muhammad'}</span> (NIK: {profile.nik})
          </p>
        </div>
      </div>

      {/* Right Controls matching Screenshot */}
      <div className="flex flex-wrap items-center gap-2.5">
        
        {/* Dropdown Periode */}
        <div className="relative">
          <select
            value={selectedYear}
            onChange={(e) => onChangeYear(e.target.value)}
            className="appearance-none bg-white border border-gray-200 text-xs font-semibold text-gray-700 pl-3.5 pr-8 py-2 rounded-xl shadow-xs focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="2024/2025">Tahun 2024/2025</option>
            <option value="2023/2024">Tahun 2023/2024</option>
            <option value="Semua">Semua Dokumen</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Print / Export Button matching Screenshot printer icon */}
        <button
          onClick={handlePrint}
          className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Cetak Ringkasan Arsip"
        >
          <Printer className="w-4 h-4" />
        </button>

        {/* Profile Button */}
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 shadow-xs transition"
          title="Buka Biodata Pribadi"
        >
          <div className="w-7 h-7 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs">
            <User className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-gray-800 hidden md:inline">
            {profile.fullName || 'Muhammad'}
          </span>
        </button>
      </div>

    </header>
  );
};
