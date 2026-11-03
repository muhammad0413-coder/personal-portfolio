import React, { useState } from 'react';
import {
  ArrowUpRight,
  Mail,
  Phone,
  Send,
  CheckCircle2,
  Quote,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon, InstagramIcon } from '../common/BrandIcons';
import { useData } from '../../contexts/DataContext';

export const ContactSection: React.FC = () => {
  const { profile, settings, socialLinks, sendMessage } = useData();

  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github':
        return <GithubIcon className="w-4 h-4" />;
      case 'linkedin':
        return <LinkedinIcon className="w-4 h-4" />;
      case 'twitter':
      case 'x':
        return <TwitterIcon className="w-4 h-4" />;
      case 'instagram':
        return <InstagramIcon className="w-4 h-4" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setErrorMessage('Harap isi nama, email, dan pesan Anda.');
      return;
    }

    setSubmitting(true);
    try {
      await sendMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim() || 'General Inquiry',
        message: form.message.trim(),
      });
      setSubmitted(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 6000);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Gagal mengirim pesan. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top 3-Columns Grid matching Reference Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* Column 1: Have a project in mind? */}
          <div className="lg:col-span-4 flex flex-col items-start text-left justify-between p-8 rounded-2xl bg-[#0D1322]/80 border border-white/[0.08]">
            <div>
              <span className="text-xs font-semibold tracking-wider text-violet-400 uppercase mb-3 block">
                LET'S WORK TOGETHER
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 leading-snug">
                Have a project <br /> in mind?
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                I'm always open to discussing new projects and opportunities. Let's create something amazing together!
              </p>
            </div>

            <a
              href="#contact-form"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm shadow-md shadow-violet-600/30 transition-all hover:scale-[1.02]"
            >
              <span>Get In Touch</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          {/* Column 2: Testimonial Quote Card */}
          <div className="lg:col-span-4 flex flex-col justify-between p-8 rounded-2xl bg-[#0D1322]/80 border border-white/[0.08] text-left relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-violet-950/40 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-4">
              <Quote className="w-5 h-5" />
            </div>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed italic mb-6">
              "{settings.testimonialText ||
                'Alex is an exceptional developer who delivers high-quality work on time. His attention to detail and problem-solving skills are outstanding.'}"
            </p>

            <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
              <img
                src={
                  settings.testimonialAvatar ||
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
                }
                alt={settings.testimonialAuthor || 'Sarah Johnson'}
                className="w-10 h-10 rounded-full object-cover border border-violet-500/30"
              />
              <div>
                <h4 className="text-sm font-semibold text-white">
                  {settings.testimonialAuthor || 'Sarah Johnson'}
                </h4>
                <p className="text-xs text-gray-400">
                  {settings.testimonialRole || 'CEO, TechStart'}
                </p>
              </div>
            </div>
          </div>

          {/* Column 3: Follow Me & Direct Contact Info */}
          <div className="lg:col-span-4 flex flex-col justify-between p-8 rounded-2xl bg-[#0D1322]/80 border border-white/[0.08] text-left">
            <div>
              <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase mb-4 block">
                FOLLOW ME
              </span>

              {/* Social Icons */}
              <div className="flex items-center gap-3 mb-6">
                {socialLinks.map((soc) => (
                  <a
                    key={soc.id}
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-violet-600 border border-white/10 hover:border-violet-500 text-gray-300 hover:text-white flex items-center justify-center transition-all hover:scale-110"
                    title={soc.platform}
                  >
                    {getSocialIcon(soc.platform)}
                  </a>
                ))}
              </div>

              {/* Contact Email & Phone */}
              <div className="space-y-3">
                <a
                  href={`mailto:${profile.email || 'hello@alexdev.com'}`}
                  className="flex items-center gap-3 text-xs sm:text-sm text-gray-300 hover:text-violet-400 transition"
                >
                  <Mail className="w-4 h-4 text-violet-400 shrink-0" />
                  <span>{profile.email || 'hello@alexdev.com'}</span>
                </a>
                <a
                  href={`tel:${profile.phone || '+15551234567'}`}
                  className="flex items-center gap-3 text-xs sm:text-sm text-gray-300 hover:text-violet-400 transition"
                >
                  <Phone className="w-4 h-4 text-violet-400 shrink-0" />
                  <span>{profile.phone || '+1 (555) 123-4567'}</span>
                </a>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-6">
              {profile.address || 'San Francisco, CA & Remote Worldwide'}
            </p>
          </div>

        </div>

        {/* Visitor Message Form Section */}
        <div id="contact-form" className="max-w-2xl mx-auto p-8 rounded-2xl bg-[#0D1322]/90 border border-white/10 text-left relative">
          <div className="flex items-center gap-2 mb-2 text-violet-400 text-xs font-semibold uppercase tracking-wider">
            <MessageSquare className="w-4 h-4" />
            <span>Kirim Pesan Langsung</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-6">
            Kirimkan Pertanyaan atau Tawaran Kerjasama
          </h3>

          {submitted ? (
            <div className="p-6 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-4 text-emerald-300 animate-fadeIn">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
              <div>
                <h4 className="font-semibold text-base text-white">Pesan Anda Berhasil Terkirim!</h4>
                <p className="text-xs text-emerald-200/80">
                  Terima kasih sudah menghubungi saya. Pesan telah disimpan di sistem dan saya akan segera membalas ke email Anda.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3.5 rounded-lg bg-red-950/30 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Santoso"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-violet-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Alamat Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="budi@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-violet-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Subjek / Kebutuhan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Diskusi Pembuatan Aplikasi Web E-Commerce"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-violet-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Pesan Anda *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tuliskan detail proyek, anggaran, atau pesan yang ingin Anda sampaikan..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-violet-500 transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 transition disabled:opacity-50"
              >
                {submitting ? (
                  <span>Mengirim...</span>
                ) : (
                  <>
                    <span>Kirim Pesan</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  );
};
