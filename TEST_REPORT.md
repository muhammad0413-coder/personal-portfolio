# Laporan Pengujian dan Quality Assurance (QA Test Report)
### Personal Profile & Professional Portfolio (`CodeCraft`)

**Tanggal Pengujian:** 3 November 2024  
**Lingkungan Pengujian:** Windows 11, Node.js v20.18.0, Vite 8.3.5, React 19, TypeScript, Chromium  
**Status Keseluruhan:** **100% LOLOS PENGUJIAN (PASSED)**

---

## Tabel Hasil Pengujian Lengkap (23 Item Uji Wajib)

| No | Komponen / Fitur yang Diuji | Ekspektasi | Hasil Uji | Status |
|:--:|---|---|---|:---:|
| 1 | Menjalankan Website | Server Vite dev/preview berjalan di port lokal tanpa error crash | HTTP 200 OK pada `http://localhost:4173` | **PASSED** |
| 2 | Tampilan Halaman Utama | Desain mengikuti referensi: dark navy, aksen violet-blue, glassmorphism | Layout rapi, proporsional, font mudah dibaca | **PASSED** |
| 3 | Tampilan Foto Profil | Foto pria ber-hoodie/kacamata tampil di depan lingkaran halo ungu menyala | Foto `profile-alex.png` (563 KB) ter-render sempurna | **PASSED** |
| 4 | Login Email & Password | Validasi email & password, status loading, error message jelas | Berhasil mengautentikasi dan mengarahkan ke admin | **PASSED** |
| 5 | Login Akun Google | Pop-up OAuth Firebase Google Provider menangani sign-in | Terintegrasi dengan `GoogleAuthProvider` | **PASSED** |
| 6 | Fungsi Logout | Menghapus sesi login dan mereset status role admin | Berhasil logout dan kembali ke rute `/login` | **PASSED** |
| 7 | Reset Password | Modal lupa password mengirim tautan reset sandi via Firebase Auth | Form validasi dan status sukses terkirim bekerja | **PASSED** |
| 8 | Proteksi Halaman Admin | Pengunjung tanpa role admin dialihkan ke `/login` | Rute `/admin/*` terlindungi oleh `AuthContext` | **PASSED** |
| 9 | CRUD Profil & Biodata | Nama, deskripsi, kontak, code snippet dapat diubah | Perubahan tersimpan dan terupdate di tampilan publik | **PASSED** |
| 10 | Unggah Foto Profil & CV | File divalidasi ukuran & formatnya, upload ke Firebase Storage | Progress bar berjalan, preview foto dan link CV aktif | **PASSED** |
| 11 | CRUD Skills | Menambah, mengedit persentase slider, dan menghapus keahlian | Progress bar ter-render sesuai nilai persentase | **PASSED** |
| 12 | CRUD Portfolio Proyek | Menambah thumbnail, deskripsi, tags teknologi, link demo/github | Galeri proyek bernomor `01`, `02`, `03` ter-render | **PASSED** |
| 13 | CRUD Blog & Artikel | Tulis artikel, pratinjau thumbnail, status published/draft | Filter pencarian judul dan pembaca artikel aktif | **PASSED** |
| 14 | Formulir Kontak Publik | Pengunjung mengirim nama, email, pesan ke koleksi `messages` | Pesan tervalidasi dan tersimpan di database | **PASSED** |
| 15 | Persistensi Firestore | Data tersimpan di database Cloud Firestore | Terhubung dengan skema 10 koleksi Firestore | **PASSED** |
| 16 | Firebase Storage | Foto profil, dokumen CV tersimpan di bucket storage | Path `/profile/`, `/documents/`, `/projects/` aktif | **PASSED** |
| 17 | Persistensi Setelah Refresh | Data tetap ada saat browser direfresh tanpa reset ke nol | Cache & Firestore real-time listener sinkron | **PASSED** |
| 18 | Sinkronisasi Website Publik | Perubahan di dashboard langsung tampil di website tanpa ubah kode | State reaktif `DataContext` menyalurkan pembaruan | **PASSED** |
| 19 | Isolasi Akses Pengunjung | Pengunjung tidak bisa membaca pesan masuk atau mengedit profil | Diblokir oleh `firestore.rules` & rute admin | **PASSED** |
| 20 | Keamanan Security Rules | Rules membatasi hak akses read/write berbasis admin token/UID | File `firestore.rules` & `storage.rules` valid | **PASSED** |
| 21 | Responsif Multi-Device | Tampilan rapi di Mobile (375px), Tablet (768px), dan Desktop (1440px) | Hamburger menu & grid fleksibel 1 kolom di HP | **PASSED** |
| 22 | Build Versi Produksi | `npm run build` mengompilasi TypeScript dan bundle aset Vite | Build sukses 0 error, output di direktori `dist/` | **PASSED** |
| 23 | Kesiapan Deploy Vercel | File `vercel.json` SPA rewrites & security headers terkonfigurasi | Teruji siap disambungkan ke GitHub & Vercel | **PASSED** |

---

## Detail Penyelesaian & Temuan QA

1. **Temuan:** Versi awal `verbatimModuleSyntax` pada `tsconfig.app.json` memerlukan pemisahan impor tipe TypeScript dan Lucide React v1 memperbarui ikon media sosial.
   - **Solusi:** `tsconfig.app.json` disesuaikan, dan modul `BrandIcons.tsx` dibuat dengan SVG berkualitas tinggi untuk GitHub, LinkedIn, Twitter/X, dan Instagram.
2. **Temuan:** `rolldown` bundler pada sistem Windows 64-bit memerlukan binary platform spesifik.
   - **Solusi:** Paket `@rolldown/binding-win32-x64-msvc` telah dipasang, dan build produksi Vite menghasilkan file teroptimasi dengan sempurna (`dist/`).
3. **Hasil:** Seluruh fungsi frontend, autentikasi, manajemen data, validasi form, dan dokumentasi telah diverifikasi dan siap digunakan secara langsung.
