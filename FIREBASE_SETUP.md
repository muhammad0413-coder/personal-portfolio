# Panduan Konfigurasi Firebase Lengkap
### Firebase Authentication, Cloud Firestore & Firebase Storage

Ikuti panduan langkah-demi-langkah ini untuk menghubungkan website portfolio dengan akun Firebase Anda.

---

## Langkah 1: Membuat Project Firebase

1. Buka [Firebase Console](https://console.firebase.google.com/) dan login dengan akun Google Anda.
2. Klik tombol **"Add project"** (Tambah project).
3. Masukkan nama project, misalnya `personal-portfolio-alex`.
4. (Opsional) Nonaktifkan atau aktifkan Google Analytics sesuai kebutuhan Anda, lalu klik **"Create project"**.
5. Tunggu proses pembuatan selesai, lalu klik **"Continue"**.

---

## Langkah 2: Mendaftarkan Web App & Mendapatkan Kredensial

1. Pada halaman ringkasan project (Project Overview), klik ikon web **`</>`** untuk menambahkan web app.
2. Beri nama aplikasi, misalnya `Portfolio Web`.
3. Centang opsi *"Also set up Firebase Hosting"* jika diinginkan (atau lewati karena kita menggunakan Vercel).
4. Klik **"Register app"**.
5. Salin objek `firebaseConfig` yang muncul. Anda akan melihat nilai:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`
6. Buka file `.env` di folder project Anda dan masukkan nilai-nilai tersebut:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=personal-portfolio-alex.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=personal-portfolio-alex
   VITE_FIREBASE_STORAGE_BUCKET=personal-portfolio-alex.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
   VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
   VITE_ADMIN_EMAIL=email_anda@gmail.com
   ```

---

## Langkah 3: Mengaktifkan Firebase Authentication

1. Di menu sidebar kiri Firebase Console, klik **Build** > **Authentication**.
2. Klik **"Get started"**.
3. Di tab **Sign-in method**, aktifkan:
   - **Email/Password**: Klik, aktifkan toggle pertama (Email/Password), lalu klik **Save**.
   - **Google**: Klik **Add new provider**, pilih **Google**, aktifkan toggle, pilih *Support email*, lalu klik **Save**.
4. Di tab **Users**, Anda dapat mengklik **"Add user"** untuk membuat akun admin pertama dengan email dan kata sandi Anda sendiri.

---

## Langkah 4: Membuat Database Cloud Firestore

1. Di sidebar kiri, klik **Build** > **Firestore Database**.
2. Klik **"Create database"**.
3. Pilih lokasi database terdekat (misalnya `asia-southeast1` untuk Singapura / Indonesia).
4. Pilih **"Start in production mode"**, lalu klik **Next** dan **Enable**.
5. Setelah database aktif, masuk ke tab **Rules**:
   - Buka file `firestore.rules` yang ada di root folder project Anda.
   - Salin seluruh isinya dan tempelkan ke editor Rules di Firebase Console.
   - Klik **"Publish"**.

---

## Langkah 5: Mengaktifkan Firebase Storage

1. Di sidebar kiri, klik **Build** > **Storage**.
2. Klik **"Get started"**.
3. Pilih **"Start in production mode"**, lalu klik **Next**.
4. Pilih lokasi Cloud Storage yang sama dengan Firestore, lalu klik **Done**.
5. Masuk ke tab **Rules**:
   - Buka file `storage.rules` yang ada di root folder project Anda.
   - Salin seluruh isinya dan tempelkan ke editor Rules di Firebase Console.
   - Klik **"Publish"**.

---

## Langkah 6: Mengatur Authorized Domains (Untuk Google Login & Vercel)

1. Di menu **Authentication** > tab **Settings** > klik **Authorized domains**.
2. Klik **"Add domain"**.
3. Tambahkan domain aplikasi Anda di Vercel, misalnya:
   - `your-portfolio.vercel.app`
   - `localhost` (biasanya sudah ada secara default)
4. Klik **Done**.

---

## Langkah 7: Sinkronisasi Data Awal (1-Click Database Seed)

1. Jalankan aplikasi web lokal atau buka versi Vercel Anda.
2. Masuk ke halaman login (`/login`) dengan akun admin yang telah Anda daftarkan.
3. Di dashboard admin, klik menu **Pengaturan Firebase** pada sidebar.
4. Klik tombol **"Suntikkan Data Default ke Cloud Firestore"**.
5. Sistem akan otomatis mengisi semua koleksi (`profile`, `skills`, `projects`, `blog`, `education`, `experiences`, `socialLinks`, `settings`) ke Cloud Firestore secara permanen!
