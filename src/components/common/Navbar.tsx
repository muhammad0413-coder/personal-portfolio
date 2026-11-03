import React, { useState, useEffect } from 'react';
import { Code2, Menu, X, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';

interface NavbarProps {
  onNavigate?: (path: string) => void;
  activePath?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, activePath = '/' }) => {
  const { settings } = useData();
  const { isAdmin } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home', path: '/' },
    { name: 'About', href: '#about', path: '/#about' },
    { name: 'Skills', href: '#skills', path: '/#skills' },
    { name: 'Projects', href: '#projects', path: '/#projects' },
    { name: 'Blog', href: '#blog', path: '/#blog' },
    { name: 'Contact', href: '#contact', path: '/#contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (activePath !== '/') {
      if (onNavigate) {
        onNavigate('/');
        setTimeout(() => {
          const el = document.querySelector(href);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
      return;
    }

    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#080C14]/80 backdrop-blur-md border-b border-white/[0.08] py-3.5 shadow-lg shadow-black/20'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#home"
          onClick={(e) => handleLinkClick(e, '#home')}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-violet-500/20 group-hover:scale-105 transition-transform">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white group-hover:text-violet-400 transition-colors">
            {settings.logoText || 'CodeCraft'}
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative py-1 hover:after:w-full after:w-0 after:h-[2px] after:bg-gradient-to-r after:from-violet-500 after:to-indigo-500 after:absolute after:bottom-0 after:left-0 after:transition-all"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isAdmin ? (
            <button
              onClick={() => onNavigate && onNavigate('/admin')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-950/60 text-violet-300 text-xs font-medium border border-violet-700/50 hover:bg-violet-900/60 transition"
              title="Panel Admin Aktif"
            >
              <ShieldCheck className="w-4 h-4 text-violet-400" />
              <span>Admin</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate && onNavigate('/login')}
              className="text-xs text-gray-400 hover:text-gray-200 transition px-2 py-1"
            >
              Login
            </button>
          )}

          <a
            href="#contact"
            onClick={(e) => handleLinkClick(e, '#contact')}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-medium shadow-md shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Hire Me</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          {isAdmin && (
            <button
              onClick={() => onNavigate && onNavigate('/admin')}
              className="p-2 text-violet-400 hover:text-violet-300"
            >
              <ShieldCheck className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B101E]/95 backdrop-blur-xl border-b border-white/10 px-4 pt-3 pb-6 animate-fadeIn">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <a
                href="#contact"
                onClick={(e) => handleLinkClick(e, '#contact')}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium text-sm shadow-md shadow-indigo-600/30"
              >
                <span>Hire Me</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onNavigate) onNavigate(isAdmin ? '/admin' : '/login');
                }}
                className="w-full text-center py-2 text-xs text-gray-400 hover:text-gray-200"
              >
                {isAdmin ? 'Buka Dashboard Admin' : 'Login Administrator'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
