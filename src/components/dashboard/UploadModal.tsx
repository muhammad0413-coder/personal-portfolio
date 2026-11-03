import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2 } from 'lucide-react';
import { PersonalDocument, DocumentCategory, DocumentStatus } from '../../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (docData: Omit<PersonalDocument, 'id'> & { id?: string }) => Promise<void>;
  editingDoc?: PersonalDocument | null;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingDoc,
}) => {
  const [title, setTitle] = useState(editingDoc ? editingDoc.title : '');
  const [docNumber, setDocNumber] = useState(editingDoc ? editingDoc.docNumber : '');
  const [category, setCategory] = useState<DocumentCategory>(
    editingDoc ? editingDoc.category : 'Kependudukan'
  );
  const [status, setStatus] = useState<DocumentStatus>(
    editingDoc ? editingDoc.status : 'Terverifikasi'
  );
  const [issueDate, setIssueDate] = useState(editingDoc ? editingDoc.issueDate || '' : '');
  const [expiryDate, setExpiryDate] = useState(
    editingDoc ? editingDoc.expiryDate || 'Seumur Hidup' : 'Seumur Hidup'
  );
  const [notes, setNotes] = useState(editingDoc ? editingDoc.notes || '' : '');

  const [fileUrl, setFileUrl] = useState(editingDoc ? editingDoc.fileUrl : '');
  const [fileName, setFileName] = useState(editingDoc ? editingDoc.fileName : '');
  const [fileSize, setFileSize] = useState(editingDoc ? editingDoc.fileSize : '');
  const [fileType, setFileType] = useState<'image' | 'pdf' | 'document'>(
    editingDoc ? editingDoc.fileType : 'image'
  );
  const [loading, setLoading] = useState(false);

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

    // Convert file to Base64 Data URL for instant preview & download
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
              Simpan file KTP, KK, Ijazah, SIM, NPWP untuk diarsipkan dan diunduh kembali.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
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
              placeholder="Contoh: KTP Elektronik / Kartu Keluarga (KK) / Ijazah S1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-blue-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Nomor Dokumen (NIK / No KK)
              </label>
              <input
                type="text"
                placeholder="Contoh: 3201011504980002"
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Kategori Dokumen
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-blue-500 font-medium cursor-pointer"
              >
                <option value="Kependudukan">Kependudukan (KTP, KK, Akta)</option>
                <option value="Pendidikan">Pendidikan (Ijazah, Transkrip)</option>
                <option value="Finansial & Pajak">Finansial & Pajak (NPWP, Rekening)</option>
                <option value="Lisensi & Kendaraan">Lisensi & Kendaraan (SIM, STNK)</option>
                <option value="Kesehatan & Kerja">Kesehatan & Kerja (BPJS, SK)</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          {/* File Picker */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Pilih Berkas Dokumen (Foto / PDF)
            </label>
            <div className="flex items-center gap-2">
              <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-500 bg-gray-50 hover:bg-blue-50/30 cursor-pointer transition text-gray-600">
                <Upload className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-xs">
                  {fileName ? `File: ${fileName} (${fileSize})` : 'Klik untuk memilih file foto KTP/KK atau PDF'}
                </span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Tanggal Terbit
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Masa Berlaku
              </label>
              <input
                type="text"
                placeholder="Seumur Hidup / 2026-04-15"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Status Dokumen
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as DocumentStatus)}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-blue-500 font-medium cursor-pointer"
              >
                <option value="Terverifikasi">Terverifikasi (Valid)</option>
                <option value="Menunggu">Menunggu Verifikasi</option>
                <option value="Perlu Pembaruan">Perlu Pembaruan</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Catatan / Keterangan
              </label>
              <input
                type="text"
                placeholder="Contoh: Disdukcapil Kota Bogor"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-3 border-t border-gray-100">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-[#0B132B] hover:bg-blue-900 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : 'Simpan & Arsipkan Dokumen'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs"
            >
              Batal
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
