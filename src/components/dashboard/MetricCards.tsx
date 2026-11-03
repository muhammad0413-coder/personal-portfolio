import React from 'react';
import {
  Files,
  ShieldCheck,
  Award,
  FileCheck2,
  AlertCircle
} from 'lucide-react';
import { PersonalDocument } from '../../types';

interface MetricCardsProps {
  documents: PersonalDocument[];
  onFilterStatus?: (status: string) => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ documents }) => {
  const total = documents.length;
  const verified = documents.filter((d) => d.status === 'Terverifikasi').length;
  const kependudukan = documents.filter((d) => d.category === 'Kependudukan').length;
  const pendidikanPajak = documents.filter(
    (d) => d.category === 'Pendidikan' || d.category === 'Finansial & Pajak'
  ).length;
  const needUpdate = documents.filter((d) => d.status === 'Perlu Pembaruan').length;

  const verifiedPercent = total > 0 ? ((verified / total) * 100).toFixed(1) : '0';
  const needUpdatePercent = total > 0 ? ((needUpdate / total) * 100).toFixed(1) : '0';

  const cards = [
    {
      title: 'TOTAL DOKUMEN',
      value: total,
      subtext: '↑ 100% Berkas Aktif',
      icon: Files,
      bgColor: 'bg-[#1E5BF6]',
    },
    {
      title: 'DOKUMEN TERVERIFIKASI',
      value: verified,
      subtext: `${verifiedPercent}% Terverifikasi`,
      icon: ShieldCheck,
      bgColor: 'bg-[#00BA88]',
    },
    {
      title: 'KEPENDUDUKAN (KTP/KK)',
      value: kependudukan,
      subtext: 'KTP, KK, Akta, Paspor',
      icon: Award,
      bgColor: 'bg-[#6C5CE7]',
    },
    {
      title: 'PENDIDIKAN & PAJAK',
      value: pendidikanPajak,
      subtext: 'Ijazah & NPWP',
      icon: FileCheck2,
      bgColor: 'bg-[#FF7643]',
    },
    {
      title: 'PERLU PEMBARUAN',
      value: needUpdate,
      subtext: `${needUpdatePercent}% Masa Berlaku`,
      icon: AlertCircle,
      bgColor: 'bg-[#00A8FF]',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-left">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`${card.bgColor} rounded-2xl p-4 text-white shadow-md flex items-center gap-3.5 transition-transform hover:-translate-y-1 hover:shadow-lg`}
          >
            {/* White Circular Icon Badge */}
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
              <Icon className="w-6 h-6 text-white" />
            </div>

            {/* Metric Content */}
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-bold tracking-wider text-white/80 uppercase truncate">
                {card.title}
              </span>
              <span className="text-2xl font-black tracking-tight leading-tight">
                {card.value}
              </span>
              <span className="text-[10px] font-medium text-white/90 truncate">
                {card.subtext}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
