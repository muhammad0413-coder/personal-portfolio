# Panduan Lengkap Dashboard Administrator
### Personal Profile & Professional Portfolio (`CodeCraft`)

Dokumen ini memandu Anda dalam mengelola seluruh konten website personal profile & portfolio melalui Dashboard Administrator tanpa perlu mengubah kode program.

---

## 1. Cara Masuk ke Halaman Administrator

1. Kunjungi tautan `/login` pada browser Anda (atau klik tombol **Login** di header website publik).
2. Anda memiliki 2 opsi masuk:
   - **Email & Kata Sandi**: Masukkan email terdaftar dan kata sandi Anda, lalu klik tombol **Masuk ke Dashboard**.
   - **Lanjutkan dengan Google**: Klik tombol Google OAuth untuk masuk menggunakan akun Google Anda yang telah memiliki hak admin.
3. Jika lupa kata sandi, klik tautan **Lupa Password?** pada form login untuk menerima email instruksi reset sandi dari Firebase.

---

## 2. Mengubah Biodata & Profil Utama

1. Di menu sidebar, pilih **Profil Saya**.
2. Anda dapat memperbarui:
   - **Nama Lengkap & Panggilan**: Ditampilkan pada hero headline dan watermark.
   - **Profesi / Jabatan**: Teks badge atas (misalnya `I'M A WEB DEVELOPER` atau `FULL-STACK ENGINEER`).
   - **Deskripsi Singkat**: Teks pembuka di bawah judul hero.
   - **Deskripsi Lengkap**: Paragraf biografi pada bagian *About Me*.
   - **Kontak Publik**: Email, nomor WhatsApp/telepon, dan lokasi kerja.
   - **Cuplikan Kode (Code Snippet)**: Teks kode JavaScript/TypeScript yang tampil pada floating card di samping foto profil.
3. Klik tombol **SIMPAN PERUBAHAN**. Data akan langsung terupdate di halaman publik.

---

## 3. Mengganti Foto Profil & Mengunggah CV

1. Di sidebar, pilih menu **Foto Profil & CV**.
2. **Mengganti Foto Profil**:
   - Klik tombol **Pilih & Unggah Foto Baru**.
   - Pilih berkas foto JPG, PNG, atau WEBP (maksimal 5MB).
   - Indikator progres upload akan berjalan. Foto otomatis terunggah ke folder `/profile/` di Firebase Storage dan langsung menggantikan foto lama di website publik.
   - Jika ingin kembali ke foto ilustratif default, klik tombol **Gunakan Foto Bawaan Alex**.
3. **Mengunggah File CV (Curriculum Vitae)**:
   - Klik tombol **Unggah Berkas CV (PDF)**.
   - Pilih berkas dokumen CV berformat PDF (maksimal 10MB).
   - Setelah selesai, tombol **Download CV** di halaman publik akan otomatis mengunduh berkas PDF tersebut.

---

## 4. Mengatur 4 Kartu Statistik (About Me)

1. Di sidebar, pilih **Tentang Saya & Stats**.
2. Ubah angka atau nilai pada 4 kolom:
   - **Years Experience**: Contoh `4+` atau `5+`
   - **Projects Completed**: Contoh `50+` atau `75+`
   - **Happy Clients**: Contoh `30+`
   - **Client Satisfaction**: Contoh `100%`
3. Klik **SIMPAN STATISTIK**.

---

## 5. Mengelola Keahlian & Keterampilan (Skills)

1. Di sidebar, pilih **Skills & Kemampuan**.
2. **Menambah Skill Baru**:
   - Klik **Tambah Skill Baru**.
   - Masukkan nama skill (contoh: `Docker`, `Python`, `GraphQL`).
   - Pilih kategori (`Programming Languages`, `Frameworks`, `Tools`, `Soft Skills`, dll.).
   - Geser slider persentase kemahiran (misalnya `85%`).
   - Tentukan nama ikon Lucide (misal `Server`, `Code`, `Layers`).
   - Klik **Simpan Skill**.
3. **Mengedit atau Menghapus**:
   - Klik ikon pensil untuk mengedit nama atau persentase.
   - Klik ikon tempat sampah merah untuk menghapus skill.

---

## 6. Mengelola Galeri Portfolio (Projects)

1. Di sidebar, pilih **Projects & Portfolio**.
2. **Menambah Proyek Baru**:
   - Klik **Tambah Proyek Baru**.
   - Masukkan Judul Proyek dan Kategori.
   - Tuliskan ringkasan deskripsi proyek.
   - Unggah gambar thumbnail (atau masukkan URL gambar eksternal).
   - Masukkan daftar teknologi yang dipisahkan tanda koma (contoh: `React, TypeScript, Tailwind, Firebase`).
   - Masukkan link **Live Demo** dan link **GitHub Repository**.
   - Klik **Simpan Proyek**.
3. Urutan proyek dapat diatur sesuai nomor urut yang diinginkan.

---

## 7. Mengelola Artikel Blog (My Writings)

1. Di sidebar, pilih **Blog & Artikel**.
2. **Menulis Artikel**:
   - Klik **Tulis Artikel Baru**.
   - Tentukan Judul Artikel (slug URL otomatis digenerate).
   - Pilih status: **Published** (tayang untuk umum) atau **Draft** (hanya terlihat oleh admin).
   - Masukkan ringkasan singkat (excerpt) dan waktu baca (contoh: `5 min read`).
   - Tuliskan isi konten artikel lengkap (mendukung format heading `## Subjudul`).
   - Unggah gambar sampul artikel.
   - Klik **Simpan Artikel**.

---

## 8. Membaca & Membalas Pesan Kontak Masuk

1. Di sidebar, pilih **Pesan Masuk** (akan muncul badge jumlah pesan belum dibaca).
2. Anda dapat memfilter pesan berdasarkan **Semua** atau **Belum Dibaca**.
3. Baca pesan lengkap, tanggal pengiriman, dan subjek yang dikirim pengunjung.
4. Klik **Tandai Selesai Dibaca** untuk mengarsipkan pesan.
5. Klik **Balas via Email** untuk membuka aplikasi email Anda dengan alamat tujuan dan subjek yang sudah otomatis terisi.
6. Hapus pesan yang sudah tidak dibutuhkan dengan tombol tempat sampah.
