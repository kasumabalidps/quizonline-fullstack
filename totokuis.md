# Pembuatan Halaman Kuis Beserta Fiturnya

**Note:** Sebelum membuat halaman atau logic, periksa terlebih dahulu di backend dan frontend apakah fungsi, class, atau file tersebut sudah ada. Gunakan yang sudah ada untuk menghindari duplikasi dan kebingungan jika terjadi error. Teknologi yang digunakan adalah Laravel untuk Backend dan NextJS untuk Frontend.

## Langkah-langkah Pembuatan Halaman Kuis

1. **Buat Halaman di Frontend**
   - Lokasi: `src/app/kuis`

2. **Desain UI Halaman Utama Kuis**
   - Mirip dengan: `src/app/dashboard/(home)`
   - Catatan: Buat mirip, bukan berarti kontennya sama.

3. **Komponen Halaman Utama Kuis**
   - Navbar
   - Daftar Kuis yang dapat diakses oleh mahasiswa (akses berdasarkan `id_kelas` di Model Mahasiswa di backend)
   - Footer

4. **Navigasi Kuis**
   - Kuis card di halaman utama dapat diklik untuk masuk ke halaman kuis, di mana mahasiswa dapat memulai kuis.

5. **Halaman Menjawab Kuis**
   - Navbar kosong
   - Sidebar berisi kotak nomor soal yang dapat diklik
   - Tampilan soal dan pilihan jawaban
   - Tombol untuk memilih soal sebelumnya dan selanjutnya

6. **Database dan Model**
   - Semua migration dan model sudah disiapkan di backend. Jangan ubah atau tambahkan lagi untuk menjaga desain database.

7. **Fitur Tambahan di Halaman Kuis**
   - Timer
   - Notifikasi (Berhasil, Gagal, Selesai, Tidak Dapat Memilih Soal, Tidak Dapat Memilih Jawaban, dll.)

8. **Detail Kuis**
   - Informasi yang ditampilkan:
     - Nama Kuis
     - Nama Dosen Pembuat
     - Nama Kelas
     - Nama Mata Kuliah
     - Waktu Mulai dan Selesai
     - Jumlah Soal
   - Card Leaderboard akan dibuat setelah kuis berjalan dengan baik.

9. **Desain dan Fitur**
   - Buat halaman semenarik dan sesederhana mungkin, dengan banyak fitur.
   - Ikuti desain yang sudah ada tetapi dengan konten yang berbeda untuk menjaga konsistensi UI.

10. **Untuk Logic Di Frontend**
   - Semua Hooks harus tertata rapi di `src/app/hooks/kuis`
   - Penulisan kode jangan asal harus ada alasan dan minimal console log untuk debugging yang memudahkan nantinya memperbaiki jikalau terjadi error.