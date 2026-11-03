import React, { useState } from 'react';
import { ArrowUpRight, ExternalLink, X, Tag } from 'lucide-react';
import { GithubIcon } from '../common/BrandIcons';
import { useData } from '../../contexts/DataContext';
import { Project } from '../../types';

export const ProjectsSection: React.FC = () => {
  const { projects } = useData();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="projects" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-900/30 border border-violet-500/30 text-violet-300 text-xs font-semibold tracking-wider uppercase mb-4">
            <span>FEATURED PROJECTS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Some of My Recent Work
          </h2>
        </div>

        {/* 3-Card Grid matching Reference Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {projects.map((proj, idx) => {
            const indexNumber = String(idx + 1).padStart(2, '0');
            return (
              <div
                key={proj.id}
                className="group relative rounded-2xl bg-[#0D1322]/90 border border-white/[0.08] hover:border-violet-500/40 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-violet-950/30 text-left"
              >
                {/* Thumbnail Image Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-900">
                  {/* Number Badge (01, 02, 03) */}
                  <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white font-mono text-xs font-semibold">
                    {indexNumber}
                  </div>

                  <img
                    src={proj.thumbnail}
                    alt={proj.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D1322] via-transparent to-transparent opacity-80" />
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-violet-400 transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed mb-4">
                      {proj.description}
                    </p>
                  </div>

                  {/* Card Bottom: View Project Button */}
                  <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {proj.technologies?.slice(0, 2).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded text-[11px] font-mono text-violet-300 bg-violet-950/40 border border-violet-500/20"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => setSelectedProject(proj)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors"
                    >
                      <span>View Project</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel indicator dots */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-6 h-2 rounded-full bg-violet-600 transition-all" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
        </div>

      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0B101E] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative text-left">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-5 right-5 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-[16/9] w-full rounded-xl overflow-hidden mb-6 border border-white/10">
              <img
                src={selectedProject.thumbnail}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-md bg-violet-950/60 text-violet-300 border border-violet-500/30 text-xs font-mono font-medium">
                {selectedProject.category}
              </span>
              <span className="text-xs text-gray-500">
                {selectedProject.createdAt}
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-3">
              {selectedProject.title}
            </h3>

            <p className="text-sm text-gray-300 leading-relaxed mb-6">
              {selectedProject.description}
            </p>

            {/* Technologies */}
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-violet-400" />
                <span>Teknologi yang Digunakan</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedProject.technologies?.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-lg text-xs font-mono text-gray-200 bg-white/[0.05] border border-white/10"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Links */}
            <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
              {selectedProject.demoUrl && (
                <a
                  href={selectedProject.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm transition"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Live Demo</span>
                </a>
              )}
              {selectedProject.githubUrl && (
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white font-medium text-sm border border-white/10 transition"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>Repository GitHub</span>
                </a>
              )}
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
