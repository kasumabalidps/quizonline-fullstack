# Pengembangan Fitur Kuis untuk Sistem Online (Laravel & NextJS)

**CATATAN PENTING:** 
- Ikuti standar penulisan kode yang ada di backend untuk menghindari error dan inkonsistensi
- Pastikan UI dashboard frontend konsisten dengan yang sudah ada (tema, warna, font, dan bentuk UI)
- Tulis kode dengan rapi dan dokumentasikan setiap perubahan
- Perhatikan relasi antar file
- Gunakan metode yang sudah ada di class backend/frontend (hindari duplikasi)
- Catat semua perubahan di daftar perubahan

## Langkah 1: Pembuatan Database (Backend)
Status: BELUM SELESAI ⏳

### 1.1 Tabel `kuis`
- [ ] Kolom `id` (int, auto increment)
- [ ] Kolom `judul` (varchar)
- [ ] Kolom `id_dosen` (foreign key → tabel `dosen`)
- [ ] Kolom `id_kelas` (foreign key → tabel `kelas`)
- [ ] Kolom `id_matkul` (foreign key → tabel `mata_kuliah`)
- [ ] Kolom `waktu_mulai` (datetime)
- [ ] Kolom `waktu_selesai` (datetime)

### 1.2 Tabel `soal_kuis`
- [ ] Kolom `id` (int, auto increment)
- [ ] Kolom `id_kuis` (foreign key → tabel `kuis`)
- [ ] Kolom `id_soal` (foreign key → tabel `soal`)

### 1.3 Tabel `soal`
- [ ] Kolom `id` (int, auto increment)
- [ ] Kolom `soal` (varchar)
- [ ] Kolom `a` (varchar)
- [ ] Kolom `b` (varchar)
- [ ] Kolom `c` (varchar)
- [ ] Kolom `d` (varchar)
- [ ] Kolom `jawaban` (varchar)

### 1.4 Tabel `jawaban_mhs`
- [ ] Kolom `id` (int, auto increment)
- [ ] Kolom `id_mhs` (foreign key → tabel `mahasiswa`)
- [ ] Kolom `id_kuis` (foreign key → tabel `kuis`)
- [ ] Kolom `id_soal` (foreign key → tabel `soal`)
- [ ] Kolom `jawaban` (varchar)
- [ ] Kolom `nilai` (double/float)

## Langkah 2: Pengembangan Backend & Frontend
Status: MENUNGGU LANGKAH 1 ⏳

### 2.1 Backend (Laravel)
- [ ] Buat `KuisDataController.php`
- [ ] Buat `KuisDataEditRequest.php`
- [ ] Update `routes/api.php`

### 2.2 Frontend (NextJS)
- [ ] Buat halaman `/dashboard/dosen/kuis`
- [ ] Buat halaman `/dashboard/dosen/buat-kuis`
- [ ] Buat hooks `kuisData.js`

## Langkah 3: Implementasi Fitur
Status: MENUNGGU LANGKAH 2 ⏳

### 3.1 Form Buat Kuis
- [ ] Input judul kuis
- [ ] Input waktu mulai
- [ ] Input waktu selesai
- [ ] Pilihan kelas (dropdown)
- [ ] Pilihan mata kuliah (dropdown)

### 3.2 Halaman Daftar Kuis
- [ ] Tabel list kuis
- [ ] Fungsi edit kuis
- [ ] Fungsi hapus kuis
- [ ] Modal detail kuis
- [ ] Integrasi dengan database

---
**PETUNJUK PENGGUNAAN:**
1. Selesaikan Langkah 1 terlebih dahulu
2. Laporkan setelah Langkah 1 selesai untuk verifikasi
3. Jangan lanjut ke langkah berikutnya sebelum langkah sebelumnya selesai
4. Tandai setiap item yang sudah selesai dengan [x]