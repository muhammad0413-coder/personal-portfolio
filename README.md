# Personal Profile & Professional Portfolio
### Modern Full-Stack Portfolio Website (React + TypeScript + Tailwind CSS + Firebase + Vercel)

Website Personal Profile & Professional Portfolio modern, elegan, responsif, dan siap produksi. Didesain secara presisi mengikuti referensi visual berkarakter dark navy elegan dengan aksen violet/ungu dan biru (`CodeCraft`). Dilengkapi portal manajemen administrator lengkap (15 modul) dan terintegrasi langsung dengan Firebase (Authentication, Cloud Firestore, Firebase Storage) serta siap dipublikasikan ke Vercel melalui GitHub.

---

## 🌟 Fitur Utama

- **Desain Modern & Glassmorphism:**
  - Tema dark navy (`#080C14`), aksen gradasi ungu violet (`#7C3AED` ke `#6366F1`) dan biru (`#3B82F6`).
  - Efek blur glassmorphism, border tipis berbayang, dan animasi transisi halus.
- **Hero Section Dinamis:**
  - Foto profil fotorealistik profesional dengan background lingkaran gradasi ungu menyala dan kartu kode interaktif (`const developer = { ... }`).
  - Barisan ikon teknologi yang dikuasai (HTML5, CSS3, JS, TS, React, Next.js, Git).
  - Tombol aksi "View My Work" dan "Download CV".
- **Tentang Saya & Statistik:**
  - 4 kartu statistik bercahaya (Years Experience, Projects Completed, Happy Clients, Client Satisfaction).
  - Modal interaktif riwayat pendidikan, pengalaman karier, serta visi & misi profesional.
- **Keahlian & Skills:**
  - Progress bar dinamis dengan indikator persentase dan filter kategori (Languages, Frameworks, Tools, Soft Skills).
- **Galeri Portfolio Proyek:**
  - Kartu proyek bernomor (`01`, `02`, `03`) dengan preview gambar, label teknologi, link live demo, dan link repository GitHub.
- **Artikel & Blog:**
  - Publikasi artikel teknis dengan thumbnail, estimasi waktu baca, filter pencarian, dan modal pembaca artikel.
- **Formulir Kontak Langsung:**
  - Pesan pengunjung langsung tersimpan secara aman ke Cloud Firestore dan dapat dibaca serta dibalas oleh admin.
  - Kartu testimoni klien dan tautan media sosial.
- **Dashboard Administrator Lengkap (15 Sub-Modul):**
  1. Dashboard Overview (Statistik & status koneksi Firebase)
  2. Profil Saya (Biodata, profesi, deskripsi, code snippet)
  3. Foto Profil & CV (Upload foto ke Firebase Storage & upload PDF CV)
  4. Tentang Saya & Statistik (Pengaturan 4 kartu statistik)
  5. Pendidikan (CRUD riwayat pendidikan)
  6. Pengalaman (CRUD perjalanan karier)
  7. Skills (CRUD keahlian & slider persentase)
  8. Projects (CRUD portfolio proyek)
  9. Blog (CRUD artikel draft/published)
  10. Pesan Masuk (Baca, tandai selesai, balas email, hapus)
  11. Media Sosial (Kelola tautan sosmed)
  12. Pengaturan Website (Branding, logo, footer, kutipan testimoni)
  13. Pengaturan SEO (Meta title, meta description, Google SERP preview)
  14. Pengaturan Firebase & Data Sync (1-Click Seed Data Default ke Cloud Firestore)
  15. Logout Administrator
- **Keamanan Firebase Berlapis:**
  - `firestore.rules` & `storage.rules` siap pakai yang melindungi data dari manipulasi pihak luar.

---

## 🛠️ Teknologi yang Digunakan

| Komponen | Teknologi |
|---|---|
| **Frontend Framework** | React 19 + TypeScript |
| **Build Tool** | Vite 8 |
| **Styling & Theme** | Tailwind CSS v4 + Custom Modern Dark Design System |
| **Icons** | Lucide React + Custom SVG Brand Icons |
| **Authentication** | Firebase Authentication (Email/Password & Google OAuth) |
| **Database** | Cloud Firestore (Real-time NoSQL) |
| **File Storage** | Firebase Storage (Foto Profil, Berkas CV, Media Proyek & Blog) |
| **Deployment** | Vercel (Edge Network) + GitHub Repository |

---

## 🚀 Panduan Instalasi Lokal

### 1. Kloning Repository
```bash
git clone https://github.com/username/personal-portfolio.git
cd personal-portfolio
```

### 2. Pasang Dependensi
```bash
npm install
```

### 3. Konfigurasi Variabel Lingkungan (.env)
Salin `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Isi konfigurasi Firebase Anda pada `.env`:
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:...
VITE_ADMIN_EMAIL=admin@codecraft.dev
```

### 4. Jalankan Server Pengembangan
```bash
npm run dev
```
Buka browser di `http://localhost:5173`.

### 5. Bangun Versi Produksi
```bash
npm run build
npm run preview
```

---

## 🔐 Akun & Akses Administrator

- Halaman login admin: `/login`
- Dashboard admin: `/admin`
- Jika belum menghubungkan Firebase, Anda dapat langsung login menggunakan email apa saja dengan password minimal 6 karakter untuk menguji seluruh fitur dashboard secara instan (Hybrid Resilient Mode).
- Setelah Firebase terhubung, Anda dapat menyuntikkan seluruh data awal ke Cloud Firestore hanya dengan mengklik tombol **"Suntikkan Data Default ke Cloud Firestore"** di menu **Pengaturan Firebase**.

---

## 📦 Deployment ke GitHub & Vercel

Lihat panduan lengkap langkah-demi-langkah pada:
- [`FIREBASE_SETUP.md`](file:///FIREBASE_SETUP.md) — Panduan setup Firebase & Security Rules.
- [`ADMIN_GUIDE.md`](file:///ADMIN_GUIDE.md) — Panduan penggunaan dashboard admin.
- [`TEST_REPORT.md`](file:///TEST_REPORT.md) — Laporan pengujian fitur dan QA.
