import React, { useState } from 'react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { Header } from '../components/dashboard/Header';
import { MetricCards } from '../components/dashboard/MetricCards';
import { ChartsSummary } from '../components/dashboard/ChartsSummary';
import { DocumentTable } from '../components/dashboard/DocumentTable';
import { UploadModal } from '../components/dashboard/UploadModal';
import { PreviewModal } from '../components/dashboard/PreviewModal';
import { ProfileModal } from '../components/dashboard/ProfileModal';
import { CloudModal } from '../components/dashboard/CloudModal';
import { useData } from '../contexts/DataContext';
import { PersonalDocument, DocumentCategory } from '../types';

export const DashboardPage: React.FC = () => {
  const { profile, documents, updateProfile, saveDocument, deleteDocument } = useData();

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedYear, setSelectedYear] = useState<string>('2024/2025');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [editingDoc, setEditingDoc] = useState<PersonalDocument | null>(null);
  const [previewDoc, setPreviewDoc] = useState<PersonalDocument | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isCloudOpen, setIsCloudOpen] = useState<boolean>(false);

  // Handle Tab Switch from Sidebar
  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'biodata') {
      setIsProfileOpen(true);
    } else if (tab === 'cloud') {
      setIsCloudOpen(true);
    } else if (tab === 'overview') {
      setSelectedCategory('Semua');
    } else {
      // It's a category filter tab (e.g. Kependudukan, Pendidikan)
      setSelectedCategory(tab);
    }
  };

  // Instant Document Download Handler
  const handleDownloadDocument = (doc: PersonalDocument) => {
    try {
      const link = document.createElement('a');
      link.href = doc.fileUrl;
      link.download = doc.fileName || `${doc.title.replace(/\s+/g, '_')}.jpg`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      window.open(doc.fileUrl, '_blank');
    }
  };

  const handleStartEdit = (doc: PersonalDocument) => {
    setEditingDoc(doc);
    setIsUploadOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus arsip dokumen ini?')) {
      await deleteDocument(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FC] text-[#1E293B] flex flex-col lg:flex-row antialiased selection:bg-blue-600 selection:text-white">
      
      {/* 1. Dark Navy Sidebar matching Screenshot */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onOpenUpload={() => {
          setEditingDoc(null);
          setIsUploadOpen(true);
        }}
      />

      {/* 2. Main Dashboard Content Canvas */}
      <main className="flex-1 p-4 sm:p-7 max-w-[1600px] w-full mx-auto space-y-5">
        
        {/* Top Header Bar */}
        <Header
          onToggleMobile={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          onOpenProfile={() => setIsProfileOpen(true)}
          selectedYear={selectedYear}
          onChangeYear={setSelectedYear}
        />

        {/* 5 Vibrant Metric Cards at the Top */}
        <MetricCards documents={documents} />

        {/* Middle Charts & Top Ready-to-Download Documents */}
        <ChartsSummary
          documents={documents}
          onPreview={(d) => setPreviewDoc(d)}
          onDownload={handleDownloadDocument}
        />

        {/* Lower Row: Full Document Management Table */}
        <DocumentTable
          documents={documents}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          onPreview={(d) => setPreviewDoc(d)}
          onDownload={handleDownloadDocument}
          onEdit={handleStartEdit}
          onDelete={handleDelete}
        />

        {/* Bottom System Footer */}
        <footer className="pt-4 border-t border-gray-200/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 gap-2">
          <span>Sistem Informasi & Manajemen Arsip Data Pribadi Terpadu</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCloudOpen(true)}
              className="text-blue-600 hover:underline font-semibold"
            >
              Sinkronisasi Cloud Firebase
            </button>
            <span>•</span>
            <span>Tersimpan Terenkripsi</span>
          </div>
        </footer>

      </main>

      {/* Upload / Edit Document Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => {
          setIsUploadOpen(false);
          setEditingDoc(null);
        }}
        onSave={async (d) => {
          await saveDocument(d);
        }}
        editingDoc={editingDoc}
      />

      {/* Preview & Instant Download Modal */}
      <PreviewModal
        document={previewDoc}
        onClose={() => setPreviewDoc(null)}
        onDownload={handleDownloadDocument}
      />

      {/* Personal Identity Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onSave={updateProfile}
      />

      {/* Cloud Firebase Sync Modal */}
      <CloudModal
        isOpen={isCloudOpen}
        onClose={() => setIsCloudOpen(false)}
      />

    </div>
  );
};
