import React from 'react';
import { ArrowUpRight, Download, Sparkles, Terminal } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

export const HeroSection: React.FC = () => {
  const { profile } = useData();

  const handleDownloadCV = () => {
    if (profile.cvUrl && profile.cvUrl !== '#') {
      window.open(profile.cvUrl, '_blank');
    } else {
      alert('File CV belum diunggah. Silakan unggah file CV melalui Dashboard Admin.');
    }
  };

  const techIcons = [
    { name: 'HTML5', bg: '#E34F26', text: '5', label: 'HTML5' },
    { name: 'CSS3', bg: '#1572B6', text: '3', label: 'CSS3' },
    { name: 'JavaScript', bg: '#F7DF1E', text: 'JS', textDark: true, label: 'JavaScript' },
    { name: 'TypeScript', bg: '#3178C6', text: 'TS', label: 'TypeScript' },
    { name: 'React', bg: '#61DAFB', isReact: true, label: 'React' },
    { name: 'Next.js', bg: '#000000', text: 'N', border: true, label: 'Next.js' },
    { name: 'Git', bg: '#F05032', isGit: true, label: 'Git' },
  ];

  return (
    <section id="home" className="relative min-h-[92vh] flex items-center pt-28 pb-16 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Introduction & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            {/* Profession Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-900/30 border border-violet-500/30 text-violet-300 text-xs font-semibold tracking-wider uppercase mb-6 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>{profile.profession || "I'M A WEB DEVELOPER"}</span>
            </div>

            {/* Main Hero Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
              Hi, I'm{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-blue-400 drop-shadow-sm">
                {profile.nickname || profile.name || 'Alex'}
              </span>
              <br />
              <span className="text-gray-100 font-bold">I build things for the web.</span>
            </h1>

            {/* Subtitle Description */}
            <p className="text-base sm:text-lg text-gray-400 max-w-xl leading-relaxed mb-8">
              {profile.shortDescription ||
                "I'm a passionate web developer specializing in building exceptional digital experiences with modern technologies."}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-12">
              <a
                href="#projects"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-0.5 transition-all"
              >
                <span>View My Work</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <button
                onClick={handleDownloadCV}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-gray-200 font-semibold text-sm border border-white/10 hover:border-violet-500/40 hover:-translate-y-0.5 transition-all"
              >
                <span>Download CV</span>
                <Download className="w-4 h-4 text-violet-400" />
              </button>
            </div>

            {/* Technologies Row */}
            <div className="w-full pt-4 border-t border-white/[0.07]">
              <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase mb-4">
                Technologies I work with
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {techIcons.map((tech) => (
                  <div
                    key={tech.name}
                    title={tech.label}
                    className="w-10 h-10 rounded-xl bg-[#0F1626]/90 border border-white/10 hover:border-violet-500/50 flex items-center justify-center p-2 hover:scale-110 hover:-translate-y-1 transition-all shadow-md group cursor-pointer"
                  >
                    {tech.isReact ? (
                      <div className="w-6 h-6 rounded-full border-2 border-cyan-400 relative flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                        <div className="absolute inset-0 rounded-full border border-cyan-400/60 rotate-45 scale-110"></div>
                        <div className="absolute inset-0 rounded-full border border-cyan-400/60 -rotate-45 scale-110"></div>
                      </div>
                    ) : tech.isGit ? (
                      <div className="w-6 h-6 bg-[#F05032] rounded flex items-center justify-center text-white text-[10px] font-black">
                        git
                      </div>
                    ) : (
                      <div
                        className="w-6 h-6 rounded flex items-center justify-center font-black text-[11px]"
                        style={{
                          backgroundColor: tech.bg,
                          color: tech.textDark ? '#000000' : '#FFFFFF',
                          border: tech.border ? '1px solid rgba(255,255,255,0.3)' : 'none',
                        }}
                      >
                        {tech.text}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Profile Portrait in Glowing Circle & Code Card */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            {/* Dotted Grid Decoration (Top Right) */}
            <div className="absolute -top-6 -right-4 w-32 h-32 dot-grid opacity-75 pointer-events-none -z-0" />

            {/* Glowing Violet/Purple Halo Sphere */}
            <div className="absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-500 hero-halo opacity-85 -z-10 shadow-2xl shadow-violet-600/50 transform -translate-y-4" />

            {/* Portrait Image Container */}
            <div className="relative z-10 w-[300px] sm:w-[380px] h-[360px] sm:h-[450px] flex items-end justify-center">
              <img
                src={profile.profilePhoto || '/profile-alex.png'}
                alt={profile.name || 'Alex'}
                className="w-full h-full object-cover object-top rounded-b-3xl filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)]"
                onError={(e) => {
                  // Fallback if image fails
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';
                }}
              />
            </div>

            {/* Floating Decorative Hand-drawn Line Indicator */}
            <svg
              className="absolute -left-6 bottom-20 w-16 h-16 text-violet-400/60 hidden sm:block pointer-events-none"
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="4 4"
            >
              <path d="M10 80 Q 40 10, 80 50 T 95 30" />
            </svg>

            {/* Floating Glassmorphism Code Badge Card */}
            <div className="absolute -bottom-8 -right-4 sm:-right-8 z-20 w-[240px] sm:w-[270px] rounded-xl bg-[#0B0F19]/90 backdrop-blur-md border border-white/10 p-3.5 shadow-2xl shadow-black/80 font-mono text-[11px] leading-relaxed text-gray-300">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-gray-400">
                <div className="flex items-center gap-1.5 text-[10px]">
                  <Terminal className="w-3 h-3 text-violet-400" />
                  <span>Code</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <pre className="whitespace-pre overflow-x-hidden font-mono text-left">
                <span className="text-violet-400 font-semibold">const</span>{' '}
                <span className="text-blue-300">developer</span> = {'{\n'}
                {'  '}name: <span className="text-amber-300">"{profile.nickname || 'Alex'}"</span>,{'\n'}
                {'  '}skills: [<span className="text-amber-300">"HTML"</span>, <span className="text-amber-300">"CSS"</span>,{'\n'}
                {'  '}<span className="text-amber-300">"JavaScript"</span>, <span className="text-amber-300">"React"</span>],{'\n'}
                {'  '}passion: <span className="text-amber-300">"Building things</span>{'\n'}
                {'  '}<span className="text-amber-300">for the web"</span>{'\n'}
                {'};'}
              </pre>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
