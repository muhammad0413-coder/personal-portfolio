import React, { useState, useEffect } from 'react';
import { X, Upload, FileText, CheckCircle2, Folder } from 'lucide-react';
import { PersonalDocument, DocumentCategory, DocumentStatus, DocumentFolder } from '../../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (docData: Omit<PersonalDocument, 'id'> & { id?: string }) => Promise<void>;
  editingDoc?: PersonalDocument | null;
  folders?: DocumentFolder[];
  defaultFolderId?: string;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingDoc,
  folders = [],
  defaultFolderId = '',
}) => {
  const [title, setTitle] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [folderId, setFolderId] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('Kependudukan');
  const [status, setStatus] = useState<DocumentStatus>('Terverifikasi');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('Seumur Hidup');
  const [notes, setNotes] = useState('');

  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [fileType, setFileType] = useState<'image' | 'pdf' | 'document'>('image');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingDoc) {
      setTitle(editingDoc.title || '');
      setDocNumber(editingDoc.docNumber || '');
      setFolderId(editingDoc.folderId || '');
      setCategory(editingDoc.category || 'Kependudukan');
      setStatus(editingDoc.status || 'Terverifikasi');
      setIssueDate(editingDoc.issueDate || '');
      setExpiryDate(editingDoc.expiryDate || 'Seumur Hidup');
      setNotes(editingDoc.notes || '');
      setFileUrl(editingDoc.fileUrl || '');
      setFileName(editingDoc.fileName || '');
      setFileSize(editingDoc.fileSize || '');
      setFileType(editingDoc.fileType || 'image');
    } else {
      setTitle('');
      setDocNumber('');
      setFolderId(defaultFolderId || '');
      setCategory('Kependudukan');
      setStatus('Terverifikasi');
      setIssueDate(new Date().toISOString().split('T')[0]);
      setExpiryDate('Seumur Hidup');
      setNotes('');
      setFileUrl('');
      setFileName('');
      setFileSize('');
      setFileType('image');
    }
  }, [editingDoc, defaultFolderId, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    setFileSize(`${sizeInMB} MB`);

    if (file.type.includes('pdf')) {
      setFileType('pdf');
    } else {
      setFileType('image');
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFileUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Harap isi judul dokumen!');
      return;
    }

    setLoading(true);
    try {
      await onSave({
        id: editingDoc ? editingDoc.id : undefined,
        folderId: folderId || undefined,
        title: title.trim(),
        docNumber: docNumber.trim(),
        category,
        fileUrl:
          fileUrl ||
          'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1000&q=80',
        fileName: fileName || `${title.replace(/\s+/g, '_')}.jpg`,
        fileType,
        fileSize: fileSize || '1.5 MB',
        issueDate: issueDate || new Date().toISOString().split('T')[0],
        expiryDate: expiryDate || 'Seumur Hidup',
        status,
        notes,
        uploadedAt: editingDoc ? editingDoc.uploadedAt : new Date().toISOString().split('T')[0],
      });
      onClose();
    } catch (err: any) {
      alert(err?.message || 'Gagal menyimpan dokumen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn text-left">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative border border-gray-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-base font-black text-gray-900">
              {editingDoc ? 'Edit Data Dokumen' : 'Unggah Dokumen Baru'}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Simpan file KTP, KK, Ijazah SD - S3, SIM, NPWP untuk diarsipkan dan diunduh kembali.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
          
          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Nama Dokumen *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Ijazah SD / Ijazah SMA / Ijazah S1 / KTP"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-blue-500 font-medium"
            />
          </div>

          {/* Pilih Folder */}
          <div>
            <label className="block font-bold text-gray-700 mb-1 flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5 text-blue-600" />
              <span>Simpan ke Dalam Folder:</span>
            </label>
            <select
              value={folderId}
              onChange={(e) => setFolderId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-blue-500 font-medium cursor-pointer"
            >
              <option value="">📁 (Tanpa Folder / Berkas Utama)</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  📁 {f.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Nomor Berkas / NIK / No Ijazah
              </label>
              <input
                type="text"
                placeholder="Contoh: DN-01/D-SD/06/0012..."
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-blue-500 font-medium"
              >
                <option value="Pendidikan">Pendidikan (Ijazah SD-S3)</option>
                <option value="Kependudukan">Kependudukan (KTP/KK)</option>
                <option value="Lisensi & Kendaraan">Lisensi & Kendaraan (SIM)</option>
                <option value="Finansial & Pajak">Finansial & Pajak (NPWP)</option>
                <option value="Kesehatan & Kerja">Kesehatan & Kerja (BPJS)</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          {/* Upload File Input */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Pilih Berkas Asli (Foto / PDF) *
            </label>
            <div className="border-2 border-dashed border-gray-200 hover:border-blue-500 rounded-2xl p-4 text-center bg-gray-50/50 transition">
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                accept="image/*,application/pdf"
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center justify-center gap-1.5"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shadow-xs">
                  <Upload className="w-5 h-5" />
                </div>
                <span className="font-bold text-blue-600 text-xs">
                  Pilih Berkas dari Komputer / HP
                </span>
                <span className="text-[10px] text-gray-400">
                  Mendukung JPG, PNG, PDF (Maks. 25MB)
                </span>
              </label>

              {fileName && (
                <div className="mt-3 p-2.5 rounded-xl bg-blue-50/80 border border-blue-200 flex items-center justify-between text-left">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="font-semibold text-blue-900 text-xs truncate max-w-[220px]">
                      {fileName}
                    </span>
                  </div>
                  <span className="text-[10px] text-blue-600 font-mono font-bold">
                    {fileSize}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Catatan Keterangan (Opsional)
            </label>
            <textarea
              rows={2}
              placeholder="Contoh: Ijazah asli berlegalisir basah..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 font-semibold transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/20 transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Menyimpan...' : editingDoc ? 'Simpan Perubahan' : 'Simpan Dokumen'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
