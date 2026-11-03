import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { DashboardPage } from './pages/DashboardPage';

export function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <DashboardPage />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
