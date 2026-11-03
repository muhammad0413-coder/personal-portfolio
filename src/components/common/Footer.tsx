import React from 'react';
import { Heart, Code2 } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

export const Footer: React.FC = () => {
  const { profile, settings } = useData();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.08] py-8 bg-[#060911]/90 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        
        {/* Left: Copyright */}
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-violet-400" />
          <span>
            {settings.footerCopyright
              ? settings.footerCopyright.replace('2024', String(currentYear))
              : `© ${currentYear} ${profile.name || 'Alex Developer'}. All rights reserved.`}
          </span>
        </div>

        {/* Right: Made with love */}
        <div className="flex items-center gap-1.5">
          <span>Made with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>by</span>
          <span className="text-gray-300 font-medium">
            {profile.nickname || profile.name || 'Alex'}
          </span>
        </div>

      </div>
    </footer>
  );
};
