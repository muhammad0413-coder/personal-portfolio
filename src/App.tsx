import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AlertTriangle, Home as HomeIcon } from 'lucide-react';

const MainApp: React.FC = () => {
  const { isAdmin, loading } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (path.startsWith('/#')) {
      // Anchor jump on home
      if (currentPath !== '/') {
        window.history.pushState({}, '', '/');
        setCurrentPath('/');
        setTimeout(() => {
          const id = path.replace('/#', '');
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        const id = path.replace('/#', '');
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080C14] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 rounded-full border-4 border-violet-500/20 border-t-violet-500 animate-spin mb-4" />
        <p className="text-xs font-mono text-gray-400">Memuat Personal Portfolio...</p>
      </div>
    );
  }

  // Routing Handler
  if (currentPath === '/login') {
    return <Login onNavigate={navigate} />;
  }

  if (currentPath.startsWith('/admin')) {
    if (!isAdmin) {
      return <Login onNavigate={navigate} />;
    }
    return <AdminDashboard onNavigate={navigate} />;
  }

  if (currentPath === '/') {
    return <Home onNavigate={navigate} />;
  }

  // 404 Fallback
  return (
    <div className="min-h-screen bg-[#080C14] flex flex-col items-center justify-center p-6 text-center text-white">
      <div className="w-16 h-16 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold mb-2">404</h1>
      <h2 className="text-xl font-semibold mb-3">Halaman Tidak Ditemukan</h2>
      <p className="text-xs text-gray-400 max-w-sm mb-6">
        Halaman yang Anda tuju mungkin telah dipindahkan atau tautan yang dimasukkan salah.
      </p>
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md transition"
      >
        <HomeIcon className="w-4 h-4" />
        <span>Kembali ke Beranda</span>
      </button>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <MainApp />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
