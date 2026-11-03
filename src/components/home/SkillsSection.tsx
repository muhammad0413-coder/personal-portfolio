import React, { useState } from 'react';
import {
  Code,
  Palette,
  FileCode,
  FileCode2,
  Layers,
  Globe,
  Server,
  Sparkles,
  GitBranch,
  Database,
  Layout,
  Cpu
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { SkillCategory } from '../../types';

export const SkillsSection: React.FC = () => {
  const { skills } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories: (string | SkillCategory)[] = [
    'All',
    'Programming Languages',
    'Frameworks',
    'Tools',
    'Technical Skills',
    'Soft Skills'
  ];

  const filteredSkills =
    selectedCategory === 'All'
      ? skills
      : skills.filter((s) => s.category === selectedCategory);

  const getIcon = (iconName: string, name: string) => {
    switch (iconName.toLowerCase()) {
      case 'code':
        return <Code className="w-4 h-4 text-orange-500" />;
      case 'palette':
        return <Palette className="w-4 h-4 text-blue-500" />;
      case 'filecode':
        return <FileCode className="w-4 h-4 text-yellow-400" />;
      case 'filecode2':
        return <FileCode2 className="w-4 h-4 text-sky-400" />;
      case 'layers':
        return <Layers className="w-4 h-4 text-cyan-400" />;
      case 'globe':
        return <Globe className="w-4 h-4 text-gray-200" />;
      case 'server':
        return <Server className="w-4 h-4 text-emerald-400" />;
      case 'sparkles':
        return <Sparkles className="w-4 h-4 text-teal-400" />;
      case 'gitbranch':
        return <GitBranch className="w-4 h-4 text-rose-500" />;
      case 'database':
        return <Database className="w-4 h-4 text-amber-500" />;
      case 'layout':
        return <Layout className="w-4 h-4 text-purple-400" />;
      case 'cpu':
        return <Cpu className="w-4 h-4 text-indigo-400" />;
      default:
        if (name.toLowerCase().includes('html')) return <Code className="w-4 h-4 text-orange-500" />;
        if (name.toLowerCase().includes('css')) return <Palette className="w-4 h-4 text-blue-500" />;
        if (name.toLowerCase().includes('java') || name.toLowerCase().includes('js')) return <FileCode className="w-4 h-4 text-yellow-400" />;
        if (name.toLowerCase().includes('react')) return <Layers className="w-4 h-4 text-cyan-400" />;
        if (name.toLowerCase().includes('node')) return <Server className="w-4 h-4 text-emerald-400" />;
        if (name.toLowerCase().includes('git')) return <GitBranch className="w-4 h-4 text-rose-500" />;
        return <Sparkles className="w-4 h-4 text-violet-400" />;
    }
  };

  return (
    <section id="skills" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-900/30 border border-violet-500/30 text-violet-300 text-xs font-semibold tracking-wider uppercase mb-4">
            <span>MY SKILLS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Technologies I Master
          </h2>
        </div>

        {/* Category Pills Filter */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-14">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                  : 'bg-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 3-Column Skills Grid matching Reference Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-7">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="flex flex-col p-4 rounded-xl bg-[#0D1322]/40 border border-white/[0.05] hover:border-violet-500/20 hover:bg-[#0D1322]/80 transition-all duration-300"
            >
              {/* Skill Top: Icon + Name + Percentage */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center">
                    {getIcon(skill.icon, skill.name)}
                  </div>
                  <span className="text-sm font-semibold text-gray-200">
                    {skill.name}
                  </span>
                </div>
                <span className="text-xs font-bold text-gray-400 font-mono">
                  {skill.percentage}%
                </span>
              </div>

              {/* Glowing Purple Progress Bar */}
              <div className="w-full h-2 rounded-full bg-[#131B2E] overflow-hidden p-0.5 border border-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-500 transition-all duration-1000 ease-out shadow-sm shadow-violet-500/50"
                  style={{ width: `${Math.min(Math.max(skill.percentage, 0), 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
