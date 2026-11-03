import React, { useState } from 'react';
import {
  Code2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginProps {
  onNavigate: (path: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const { loginEmail, loginGoogle, resetUserPassword, isAdmin, currentUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // If already logged in as admin, redirect to /admin
  if (currentUser && isAdmin) {
    return (
      <div className="min-h-screen bg-[#080C14] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-2xl bg-[#0D1322] border border-white/10 text-center">
          <ShieldCheck className="w-12 h-12 text-violet-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Anda Sudah Masuk Sebagai Admin</h2>
          <p className="text-xs text-gray-400 mb-6">
            Sesi administrator Anda saat ini aktif ({currentUser.email || 'Admin'}).
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => onNavigate('/admin')}
              className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm transition"
            >
              Menuju Dashboard Admin
            </button>
            <button
              onClick={() => onNavigate('/')}
              className="w-full py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-gray-300 font-medium text-sm transition"
            >
              Kembali ke Portfolio Publik
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Harap masukkan email dan password.');
      return;
    }

    setLoading(true);
    try {
      await loginEmail(email, password);
      onNavigate('/admin');
    } catch (err: any) {
      console.error('Login error:', err);
      let message = 'Gagal melakukan login. Periksa email dan kata sandi Anda.';
      if (err?.code === 'auth/user-not-found' || err?.code === 'auth/wrong-password' || err?.code === 'auth/invalid-credential') {
        message = 'Email atau kata sandi tidak valid.';
      } else if (err?.code === 'auth/invalid-email') {
        message = 'Format email tidak valid.';
      } else if (err?.message) {
        message = err.message;
      }
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      await loginGoogle();
      onNavigate('/admin');
    } catch (err: any) {
      console.error('Google login error:', err);
      if (err?.code !== 'auth/popup-closed-by-user') {
        setErrorMsg(err?.message || 'Gagal login menggunakan akun Google.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;

    setResetLoading(true);
    try {
      await resetUserPassword(forgotEmail);
      setResetSuccess(true);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Gagal mengirim instruksi reset kata sandi.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080C14] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background glow halos */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Back to Home Button */}
      <button
        onClick={() => onNavigate('/')}
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white transition px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Kembali ke Website</span>
      </button>

      {/* Login Card */}
      <div className="w-full max-w-md p-8 sm:p-10 rounded-2xl bg-[#0D1322]/90 backdrop-blur-xl border border-white/10 shadow-2xl relative z-10 text-left">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white mb-3 shadow-lg shadow-violet-500/25">
            <Code2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Administrator Portal
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Masuk untuk mengelola seluruh profil, proyek, keahlian & pesan.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Email Administrator
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="admin@codecraft.dev"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-violet-500 transition"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-gray-300">
                Kata Sandi
              </label>
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email);
                  setShowForgotModal(true);
                }}
                className="text-[11px] text-violet-400 hover:text-violet-300 transition"
              >
                Lupa Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-violet-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 transition disabled:opacity-50"
          >
            {loading ? (
              <span>Memproses...</span>
            ) : (
              <>
                <span>Masuk ke Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-[1px] bg-white/10 flex-1" />
          <span className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
            Atau
          </span>
          <div className="h-[1px] bg-white/10 flex-1" />
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] text-gray-200 font-medium text-sm border border-white/10 transition"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
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
          <span>Lanjutkan dengan Google</span>
        </button>

        <p className="mt-6 text-center text-[11px] text-gray-500">
          Dilindungi oleh Firebase Authentication & Role-based Access Control
        </p>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0D1322] border border-white/10 rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative text-left">
            <h3 className="text-xl font-bold text-white mb-2">Reset Kata Sandi</h3>
            <p className="text-xs text-gray-400 mb-6">
              Masukkan email administrator Anda. Tautan untuk menyetel ulang kata sandi akan dikirim ke kotak masuk Anda.
            </p>

            {resetSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-3 mb-6">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                <span>Instruksi reset kata sandi telah dikirim ke email Anda!</span>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="admin@codecraft.dev"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm transition"
                >
                  {resetLoading ? 'Mengirim...' : 'Kirim Tautan Reset'}
                </button>
              </form>
            )}

            <div className="mt-4 pt-4 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(false);
                  setResetSuccess(false);
                }}
                className="px-4 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
