import React, { useState } from 'react';
import {
  Database,
  CloudUpload,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  ShieldCheck,
  Flame
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { isFirebaseConfigured, firebaseConfig } from '../../services/firebase';

export const FirebaseSettingsManager: React.FC = () => {
  const { seedFirebaseDatabase } = useData();

  const isConnected = isFirebaseConfigured();
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const envTemplate = `# Konfigurasi Firebase untuk Web Portfolio
VITE_FIREBASE_API_KEY=${firebaseConfig.apiKey || 'AIzaSy...'}
VITE_FIREBASE_AUTH_DOMAIN=${firebaseConfig.authDomain || 'your-app.firebaseapp.com'}
VITE_FIREBASE_PROJECT_ID=${firebaseConfig.projectId || 'your-project-id'}
VITE_FIREBASE_STORAGE_BUCKET=${firebaseConfig.storageBucket || 'your-app.appspot.com'}
VITE_FIREBASE_MESSAGING_SENDER_ID=${firebaseConfig.messagingSenderId || '1234567890'}
VITE_FIREBASE_APP_ID=${firebaseConfig.appId || '1:1234567890:web:...'}
VITE_ADMIN_EMAIL=admin@codecraft.dev`;

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(envTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSeed = async () => {
    if (!confirm('Apakah Anda yakin ingin menyuntikkan seluruh data default (Alex - CodeCraft) ke Cloud Firestore? Data di Firestore akan diselaraskan.')) {
      return;
    }

    setSeeding(true);
    setSeedResult(null);

    try {
      const res = await seedFirebaseDatabase();
      setSeedResult(res);
    } catch (err: any) {
      setSeedResult({
        success: false,
        message: err?.message || 'Terjadi kesalahan saat menyuntikkan data.',
      });
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-4xl">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <span>Pengaturan & Sinkronisasi Firebase Cloud</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Monitor koneksi database Firestore, Authentication, dan Firebase Storage.
          </p>
        </div>

        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
            isConnected
              ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30'
              : 'bg-amber-950/40 text-amber-300 border border-amber-500/30'
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
            }`}
          />
          <span>{isConnected ? 'Firebase Terhubung' : 'Demo / Resilient Mode'}</span>
        </div>
      </div>

      {seedResult && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 text-xs animate-fadeIn ${
            seedResult.success
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : 'bg-red-950/40 border-red-500/40 text-red-300'
          }`}
        >
          {seedResult.success ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <span>{seedResult.message}</span>
        </div>
      )}

      {/* 1-Click Database Seed Action */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-950/50 via-indigo-950/30 to-black border border-violet-500/30 space-y-3">
        <div className="flex items-center gap-2 text-violet-300 font-bold text-sm">
          <CloudUpload className="w-4 h-4" />
          <span>Inisialisasi / Seed Data Default ke Firestore</span>
        </div>
        <p className="text-xs text-gray-300 leading-relaxed max-w-2xl">
          Tombol ini akan otomatis mengisi koleksi <code className="text-violet-400">profile</code>, <code className="text-violet-400">skills</code>, <code className="text-violet-400">projects</code>, <code className="text-violet-400">blog</code>, <code className="text-violet-400">education</code>, dan <code className="text-violet-400">experiences</code> langsung ke database Cloud Firestore Anda secara permanen.
        </p>

        <button
          onClick={handleSeed}
          disabled={seeding}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-lg shadow-violet-600/30 transition disabled:opacity-50"
        >
          <Database className="w-4 h-4" />
          <span>
            {seeding ? 'Menyuntikkan Data...' : 'Suntikkan Data Default ke Cloud Firestore'}
          </span>
        </button>
      </div>

      {/* Environment Variables Reference */}
      <div className="p-6 rounded-2xl bg-[#0D1322] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-violet-400" />
            <span>Format File .env (Environment Variables)</span>
          </h3>
          <button
            onClick={handleCopyEnv}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.04] hover:bg-white/10 text-xs text-gray-300 transition"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Tersalin!' : 'Salin Template'}</span>
          </button>
        </div>

        <p className="text-xs text-gray-400">
          Simpan variabel berikut pada file <code className="text-gray-200">.env</code> lokal Anda atau pada pengaturan <strong>Environment Variables</strong> di dashboard hosting Vercel:
        </p>

        <pre className="p-4 rounded-xl bg-black/60 font-mono text-xs text-violet-300 border border-white/10 overflow-x-auto leading-relaxed">
          {envTemplate}
        </pre>
      </div>

      {/* Guide Links */}
      <div className="p-5 rounded-2xl bg-[#0D1322] border border-white/10 space-y-3">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
          Panduan Akses Firebase Console
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a
            href="https://console.firebase.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 flex items-center justify-between text-xs text-gray-300 hover:text-white transition"
          >
            <span>Firebase Console</span>
            <ExternalLink className="w-3.5 h-3.5 text-violet-400" />
          </a>

          <a
            href="https://console.firebase.google.com/project/_/firestore"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 flex items-center justify-between text-xs text-gray-300 hover:text-white transition"
          >
            <span>Cloud Firestore</span>
            <ExternalLink className="w-3.5 h-3.5 text-violet-400" />
          </a>

          <a
            href="https://console.firebase.google.com/project/_/storage"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 flex items-center justify-between text-xs text-gray-300 hover:text-white transition"
          >
            <span>Firebase Storage</span>
            <ExternalLink className="w-3.5 h-3.5 text-violet-400" />
          </a>
        </div>
      </div>
    </div>
  );
};
