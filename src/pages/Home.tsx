import React from 'react';
import { Navbar } from '../components/common/Navbar';
import { HeroSection } from '../components/home/HeroSection';
import { AboutSection } from '../components/home/AboutSection';
import { SkillsSection } from '../components/home/SkillsSection';
import { ProjectsSection } from '../components/home/ProjectsSection';
import { BlogSection } from '../components/home/BlogSection';
import { ContactSection } from '../components/home/ContactSection';
import { Footer } from '../components/common/Footer';

interface HomeProps {
  onNavigate: (path: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#080C14] text-gray-100 flex flex-col selection:bg-violet-600 selection:text-white">
      <Navbar onNavigate={onNavigate} activePath="/" />
      
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <BlogSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
};
