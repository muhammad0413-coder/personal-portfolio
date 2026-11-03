import React, { useState } from 'react';
import { Calendar, Code2, Smile, Trophy, User, X, GraduationCap, Briefcase, Target } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

export const AboutSection: React.FC = () => {
  const { profile, education, experiences } = useData();
  const [showModal, setShowModal] = useState(false);

  const stats = [
    {
      value: profile.yearsExperience || '4+',
      label: 'Years Experience',
      icon: Calendar,
      color: 'text-violet-400',
      bgColor: 'bg-violet-950/40',
      borderColor: 'border-violet-500/20',
    },
    {
      value: profile.projectsCount || '50+',
      label: 'Projects Completed',
      icon: Code2,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-950/40',
      borderColor: 'border-indigo-500/20',
    },
    {
      value: profile.clientsCount || '30+',
      label: 'Happy Clients',
      icon: Smile,
      color: 'text-blue-400',
      bgColor: 'bg-blue-950/40',
      borderColor: 'border-blue-500/20',
    },
    {
      value: profile.satisfactionRate || '100%',
      label: 'Client Satisfaction',
      icon: Trophy,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-950/40',
      borderColor: 'border-emerald-500/20',
    },
  ];

  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Narrative */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-900/30 border border-violet-500/30 text-violet-300 text-xs font-semibold tracking-wider uppercase mb-5">
              <span>ABOUT ME</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight mb-6">
              I'm passionate about <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-300">
                creating digital solutions
              </span>
            </h2>

            <p className="text-gray-300 text-base leading-relaxed mb-6">
              {profile.aboutDescription ||
                "With 4+ years of experience in web development, I help businesses and individuals bring their ideas to life through clean, efficient, and user-friendly code."}
            </p>

            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white font-medium text-sm border border-white/10 hover:border-violet-500/40 hover:-translate-y-0.5 transition-all"
            >
              <span>Learn More About Me</span>
              <User className="w-4 h-4 text-violet-400" />
            </button>
          </div>

          {/* Right Column: 2x2 Glowing Stats Cards */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stats.map((stat, idx) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-[#0D1322]/80 border border-white/[0.08] hover:border-violet-500/30 hover:bg-[#11192e] transition-all duration-300 flex items-center gap-5 group"
                  >
                    <div
                      className={`w-14 h-14 rounded-xl ${stat.bgColor} ${stat.borderColor} border flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
                    >
                      <IconComponent className={`w-7 h-7 ${stat.color}`} />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        {stat.value}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-400 font-medium">
                        {stat.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Learn More Modal (Education, Experience & Vision) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0B101E] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative text-left">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-bold text-white mb-2">
              About {profile.name || 'Alex'}
            </h3>
            <p className="text-sm text-violet-400 mb-6">{profile.profession}</p>

            {/* Vision & Mission */}
            <div className="mb-6 p-4 rounded-xl bg-violet-950/20 border border-violet-500/20">
              <div className="flex items-center gap-2 text-violet-300 font-semibold text-sm mb-2">
                <Target className="w-4 h-4" />
                <span>Visi & Misi Profesional</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Membangun arsitektur perangkat lunak yang andal, indah, dan memberikan dampak nyata bagi pengguna melalui kombinasi teknologi modern, standar kode tertinggi, serta pengalaman pengguna yang mulus.
              </p>
            </div>

            {/* Work Experience */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-white font-semibold text-base mb-3">
                <Briefcase className="w-5 h-5 text-indigo-400" />
                <span>Pengalaman Kerja</span>
              </div>
              <div className="space-y-3">
                {experiences.map((exp) => (
                  <div key={exp.id} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-semibold text-white">{exp.position}</h4>
                      <span className="text-xs text-indigo-400 font-mono">
                        {exp.startDate} - {exp.endDate}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 font-medium mb-1">{exp.organization}</p>
                    <p className="text-xs text-gray-300 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <div className="flex items-center gap-2 text-white font-semibold text-base mb-3">
                <GraduationCap className="w-5 h-5 text-violet-400" />
                <span>Riwayat Pendidikan</span>
              </div>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-semibold text-white">{edu.institution}</h4>
                      <span className="text-xs text-violet-400 font-mono">
                        {edu.startYear} - {edu.endYear}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 font-medium mb-1">
                      {edu.degree} in {edu.major}
                    </p>
                    <p className="text-xs text-gray-300 leading-relaxed">{edu.description}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
