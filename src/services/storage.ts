import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage, isFirebaseConfigured } from './firebase';

export interface UploadOptions {
  folder: 'profile' | 'projects' | 'blog' | 'documents' | 'branding';
  maxSizeMB?: number;
  allowedTypes?: string[];
  onProgress?: (progress: number) => void;
}

export const uploadFile = async (
  file: File,
  options: UploadOptions
): Promise<string> => {
  const maxSizeMB = options.maxSizeMB || 5;
  const allowedTypes = options.allowedTypes || [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'application/pdf'
  ];

  // Validation
  if (file.size > maxSizeMB * 1024 * 1024) {
    throw new Error(`Ukuran file melebihi batas maksimal ${maxSizeMB}MB.`);
  }

  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    throw new Error(`Format file (${file.type}) tidak didukung. Format yang diperbolehkan: ${allowedTypes.join(', ')}`);
  }

  // If Firebase Storage is configured, perform real upload
  if (isFirebaseConfigured() && storage) {
    const cleanFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const storagePath = `${options.folder}/${cleanFileName}`;
    const storageRef = ref(storage, storagePath);

    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: file.type,
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString()
      }
    });

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          if (options.onProgress) {
            options.onProgress(progress);
          }
        },
        (error) => {
          console.error('Firebase Storage upload error:', error);
          reject(new Error(`Gagal mengunggah file ke Firebase Storage: ${error.message}`));
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            if (options.onProgress) options.onProgress(100);
            resolve(downloadUrl);
          } catch (e: any) {
            reject(new Error(`Gagal mendapatkan link download: ${e.message}`));
          }
        }
      );
    });
  }

  // Fallback: Read as Data URL (Base64) for immediate preview & offline resilience
  return new Promise((resolve, reject) => {
    let current = 0;
    const interval = setInterval(() => {
      current += 25;
      if (options.onProgress) options.onProgress(Math.min(current, 100));
      if (current >= 100) {
        clearInterval(interval);
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Gagal membaca file lokal'));
        reader.readAsDataURL(file);
      }
    }, 80);
  });
};
