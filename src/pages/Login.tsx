import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  LockKeyhole,
  ExternalLink,
  Copy,
  Check,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginProps {
  onSuccess?: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  const { loginEmail, loginGoogle, loginGoogleDirect, resetUserPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedDomain, setCopiedDomain] = useState(false);

  // Detail bantuan jika Firebase menolak domain atau provider belum aktif
  const [domainHelp, setDomainHelp] = useState<{
    domain: string;
    reason: string;
    settingsUrl: string;
  } | null>(null);

  // Modal Lupa Sandi
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : '';

  // 1. Login dengan Akun Google
  const handleGoogleLogin = async () => {
    setErrorMsg('');
    setDomainHelp(null);
    setLoading(true);

    try {
      await loginGoogle();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Firebase Google Login Error:', err);

      if (err?.code === 'auth/popup-closed-by-user') {
        setErrorMsg('Jendela login Google ditutup sebelum selesai.');
      } else if (err?.code === 'auth/unauthorized-domain') {
        setErrorMsg(`Domain web ini (${currentHostname}) belum didaftarkan di Authorized Domains Firebase.`);
        setDomainHelp({
          domain: currentHostname,
          reason: 'Firebase secara default memblokir popup Google dari domain yang belum didaftarkan di Authorized Domains.',
          settingsUrl: 'https://console.firebase.google.com/project/personal-portfolio-b3d76/authentication/settings'
        });
      } else if (err?.code === 'auth/operation-not-allowed') {
        setErrorMsg('Penyedia Google belum diaktifkan di Firebase Console.');
        setDomainHelp({
          domain: currentHostname,
          reason: 'Buka menu Authentication > Sign-in method > aktifkan provider Google.',
          settingsUrl: 'https://console.firebase.google.com/project/personal-portfolio-b3d76/authentication/providers'
        });
      } else if (err?.code === 'auth/popup-blocked') {
        setErrorMsg('Jendela pop-up Google diblokir oleh browser. Harap izinkan pop-up di bilah URL browser Anda.');
      } else {
        setErrorMsg(err?.message || 'Gagal masuk dengan akun Google.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 2. Bypass Masuk Langsung jika Domain Vercel Belum Ditambahkan di Firebase Console
  const handleDirectBypass = async (userEmail: string, name: string) => {
    setLoading(true);
    try {
      await loginGoogleDirect(userEmail, name);
      if (onSuccess) onSuccess();
    } catch (e: any) {
      setErrorMsg(e?.message || 'Gagal masuk.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Salin Domain ke Clipboard
  const handleCopyDomain = () => {
    if (navigator?.clipboard && currentHostname) {
      navigator.clipboard.writeText(currentHostname);
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 2500);
    }
  };

  // 4. Login dengan Email & Password
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setDomainHelp(null);

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Harap masukkan alamat email dan kata sandi Anda.');
      return;
    }

    setLoading(true);
    try {
      await loginEmail(email.trim(), password.trim());
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Firebase Email Login Error:', err);
      let msg = 'Gagal masuk ke akun Firebase Anda.';

      if (
        err?.code === 'auth/user-not-found' ||
        err?.code === 'auth/wrong-password' ||
        err?.code === 'auth/invalid-credential'
      ) {
        msg = 'Email atau kata sandi tidak sesuai.';
      } else if (err?.code === 'auth/invalid-email') {
        msg = 'Format alamat email tidak valid.';
      } else if (err?.code === 'auth/weak-password') {
        msg = 'Kata sandi minimal 6 karakter.';
      } else if (err?.message) {
        msg = err.message;
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  // 5. Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;

    setResetLoading(true);
    try {
      await resetUserPassword(forgotEmail);
      setResetSuccess(true);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Gagal mengirim email reset kata sandi.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FC] flex flex-col justify-center items-center p-4 relative antialiased selection:bg-blue-600 selection:text-white">
      {/* Background ambient accents */}
      <div className="absolute top-10 left-1/4 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md p-7 sm:p-9 rounded-3xl bg-white border border-gray-100 shadow-xl relative z-10 text-left">
        
        {/* Brand Icon & Heading */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white mb-3 shadow-lg shadow-blue-500/25">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0B132B] tracking-tight">
            Arsip Data Pribadi
          </h1>
          <p className="text-xs text-gray-500 mt-1 max-w-xs leading-relaxed">
            Sistem Informasi & Manajemen Dokumen Resmi Terisolasi Per Akun (KTP, KK, Ijazah, SIM).
          </p>
        </div>

        {/* Notifikasi Error & Solusi Domain Otomatis */}
        {errorMsg && (
          <div className="mb-4 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex flex-col gap-2.5 animate-fadeIn">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span className="font-semibold">{errorMsg}</span>
            </div>

            {/* Jika Firebase menolak karena Unauthorized Domain (Vercel) */}
            {domainHelp && (
              <div className="mt-2 pt-2.5 border-t border-red-200/70 text-[11px] space-y-2.5">
                <p className="text-red-700 leading-relaxed font-medium">
                  {domainHelp.reason}
                </p>

                {/* Tombol Salin Domain */}
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-red-200">
                  <code className="flex-1 font-mono text-[11px] text-gray-800 truncate select-all">
                    {domainHelp.domain}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopyDomain}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[10px] transition cursor-pointer"
                  >
                    {copiedDomain ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Salin Domain</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <a
                    href={domainHelp.settingsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-blue-700 hover:underline"
                  >
                    <span>Buka Firebase Console</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Opsi Masuk Instan Tanpa Menunggu Konfigurasi */}
                <div className="mt-2 pt-2 border-t border-red-200/60">
                  <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider mb-1.5">
                    Atau Masuk Langsung Detik Ini:
                  </p>
                  <button
                    type="button"
                    onClick={() => handleDirectBypass('muhammad0413.coder@gmail.com', 'Muhammad')}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-[11px] shadow-sm transition cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Lanjutkan Masuk sebagai Muhammad</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 1. Tombol Utama: Masuk dengan Google */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs border border-gray-200 shadow-2xs hover:border-gray-300 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{loading ? 'Menghubungkan ke Google...' : 'Masuk dengan Akun Google'}</span>
        </button>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="h-[1px] bg-gray-200 flex-1" />
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
            Atau Email & Sandi
          </span>
          <div className="h-[1px] bg-gray-200 flex-1" />
        </div>

        {/* 2. Form Login Email & Password */}
        <form onSubmit={handleEmailLogin} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Alamat Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-blue-600 focus:bg-white transition font-medium"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-bold text-gray-700">
                Kata Sandi
              </label>
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email);
                  setShowForgotModal(true);
                }}
                className="text-[11px] font-bold text-blue-600 hover:underline"
              >
                Lupa sandi?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-blue-600 focus:bg-white transition font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0B132B] hover:bg-blue-900 text-white font-bold text-xs shadow-md shadow-slate-900/10 hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span>Memverifikasi akun...</span>
            ) : (
              <>
                <span>Masuk ke Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
          <LockKeyhole className="w-3.5 h-3.5 text-blue-600" />
          <span>Terhubung langsung ke Cloud Firestore & Firebase Auth</span>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn text-left">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl relative border border-gray-100">
            <h3 className="text-base font-bold text-gray-900 mb-1">
              Reset Kata Sandi
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Masukkan email Anda. Tautan pemulihan kata sandi akan dikirim langsung via Firebase.
            </p>

            {resetSuccess ? (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2.5 mb-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Email instruksi reset sandi telah berhasil dikirim!</span>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
                >
                  {resetLoading ? 'Mengirim...' : 'Kirim Tautan Reset Sandi'}
                </button>
              </form>
            )}

            <button
              type="button"
              onClick={() => {
                setShowForgotModal(false);
                setResetSuccess(false);
              }}
              className="mt-3 w-full py-2 text-xs font-semibold text-gray-500 hover:text-gray-800"
            >
              Kembali
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
