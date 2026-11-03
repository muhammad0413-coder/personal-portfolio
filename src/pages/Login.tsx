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
  UserCheck,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginProps {
  onSuccess?: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  const { loginEmail, loginGoogle, loginDirectGoogle, resetUserPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [errorDetails, setErrorDetails] = useState<{ title?: string; tip?: string; link?: string } | null>(null);

  // Quick Direct Google Account testing
  const [showDirectPicker, setShowDirectPicker] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');

  // Lupa Password Modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setErrorDetails(null);

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Harap masukkan alamat email dan kata sandi Anda.');
      return;
    }

    setLoading(true);
    try {
      await loginEmail(email.trim(), password.trim());
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Login error:', err);
      let msg = 'Gagal masuk. Periksa kembali email dan kata sandi Anda.';
      if (
        err?.code === 'auth/user-not-found' ||
        err?.code === 'auth/wrong-password' ||
        err?.code === 'auth/invalid-credential'
      ) {
        msg = 'Email atau kata sandi tidak sesuai.';
      } else if (err?.code === 'auth/invalid-email') {
        msg = 'Format alamat email tidak valid.';
      } else if (err?.message) {
        msg = err.message;
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    setErrorDetails(null);
    setLoading(true);

    try {
      await loginGoogle();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Google login error:', err);
      if (err?.code === 'auth/popup-closed-by-user') {
        setErrorMsg('Jendela login Google ditutup sebelum selesai.');
      } else if (err?.code === 'auth/operation-not-allowed') {
        setErrorMsg('Provider Google belum diaktifkan di Firebase Console.');
        setErrorDetails({
          title: 'Cara Mengaktifkan Google Sign-In:',
          tip: 'Buka Firebase Console > Authentication > tab "Sign-in method" > klik Google > aktifkan (Enable) & pilih email dukungan.',
          link: 'https://console.firebase.google.com/project/personal-portfolio-b3d76/authentication/providers'
        });
        setShowDirectPicker(true);
      } else if (err?.code === 'auth/unauthorized-domain') {
        setErrorMsg('Domain ini belum didaftarkan di Authorized Domains Firebase.');
        setErrorDetails({
          title: 'Solusi Domain Resmi:',
          tip: 'Tambahkan domain ini (misal localhost atau URL vercel) di Firebase Console > Authentication > tab "Settings" > "Authorized domains".',
          link: 'https://console.firebase.google.com/project/personal-portfolio-b3d76/authentication/settings'
        });
        setShowDirectPicker(true);
      } else if (err?.code === 'auth/popup-blocked') {
        setErrorMsg('Jendela pop-up Google diblokir oleh browser. Harap izinkan pop-up di bilah URL.');
        setShowDirectPicker(true);
      } else {
        setErrorMsg(err?.message || 'Gagal masuk dengan akun Google.');
        setShowDirectPicker(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAccount = async (targetEmail: string, name: string) => {
    setLoading(true);
    try {
      await loginDirectGoogle(targetEmail, name);
      if (onSuccess) onSuccess();
    } catch (e: any) {
      setErrorMsg(e?.message || 'Gagal memilih akun.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGoogleEmail.trim()) return;
    await handleQuickAccount(customGoogleEmail.trim(), customGoogleEmail.trim().split('@')[0]);
  };

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

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex flex-col gap-2 animate-fadeIn">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span className="font-semibold">{errorMsg}</span>
            </div>
            {errorDetails && (
              <div className="mt-1 pt-2 border-t border-red-200/60 text-[11px] text-red-800 space-y-1">
                <p className="font-bold">{errorDetails.title}</p>
                <p>{errorDetails.tip}</p>
                {errorDetails.link && (
                  <a
                    href={errorDetails.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-blue-700 hover:underline mt-1"
                  >
                    Buka Konfigurasi Firebase Console
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        {/* 1. Login dengan Akun Google (Opsi Utama) */}
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
          <span>Masuk Cepat dengan Google</span>
        </button>

        {/* Pemilih Akun Google Langsung (Multi-User Data Separation) */}
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setShowDirectPicker(!showDirectPicker)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-blue-50/70 hover:bg-blue-50 text-blue-700 text-[11px] font-semibold transition"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Uji Pemisahan Multi-Akun Google</span>
            </span>
            <span className="text-[10px] text-blue-600/80">{showDirectPicker ? 'Sembunyikan' : 'Buka Pilihan'}</span>
          </button>

          {showDirectPicker && (
            <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-2.5 animate-fadeIn">
              <p className="text-[11px] text-gray-500 font-medium">
                Setiap akun Google memiliki data & dokumen yang terpisah 100%:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickAccount('muhammad@gmail.com', 'Muhammad')}
                  disabled={loading}
                  className="px-2.5 py-2 rounded-lg bg-white border border-gray-200 text-left hover:border-blue-500 hover:shadow-xs transition"
                >
                  <p className="font-bold text-gray-800 text-[11px] flex items-center gap-1">
                    <UserCheck className="w-3 h-3 text-blue-600" /> Muhammad
                  </p>
                  <p className="text-[9px] text-gray-400 truncate">muhammad@gmail.com</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAccount('budi@gmail.com', 'Budi Santoso')}
                  disabled={loading}
                  className="px-2.5 py-2 rounded-lg bg-white border border-gray-200 text-left hover:border-emerald-500 hover:shadow-xs transition"
                >
                  <p className="font-bold text-gray-800 text-[11px] flex items-center gap-1">
                    <UserCheck className="w-3 h-3 text-emerald-600" /> Budi
                  </p>
                  <p className="text-[9px] text-gray-400 truncate">budi@gmail.com</p>
                </button>
              </div>

              {/* Input Email Sendiri */}
              <form onSubmit={handleCustomAccountSubmit} className="flex gap-1.5 pt-1">
                <input
                  type="email"
                  placeholder="atau ketik email google Anda..."
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 text-[11px] focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={loading || !customGoogleEmail.trim()}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition disabled:opacity-50"
                >
                  Masuk
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="my-4 flex items-center gap-3">
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
              <span>Memverifikasi...</span>
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
          <span>Setiap akun memiliki database dokumen pribadi terpisah</span>
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
              Masukkan email Anda. Tautan pemulihan kata sandi akan dikirim ke kotak masuk Anda.
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
