import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { DashboardPage } from './pages/DashboardPage';
import { Login } from './pages/Login';

const MainApp: React.FC = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F7FC] flex flex-col items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-blue-600/20 border-t-blue-600 animate-spin mb-3" />
        <p className="text-xs font-bold text-gray-500">Memuat Sistem Data Pribadi...</p>
      </div>
    );
  }

  // Jika belum login, tampilkan halaman Login (Email & Password atau Google)
  if (!currentUser) {
    return <Login />;
  }

  // Jika sudah login, tampilkan Dashboard Data Pribadi & Arsip Dokumen
  return <DashboardPage />;
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
