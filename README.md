# Quiz Online - Sistem Ujian Online

Aplikasi Quiz Online adalah platform ujian online yang memungkinkan dosen untuk membuat dan mengelola kuis, serta mahasiswa untuk mengikuti ujian secara online.

## Persyaratan Sistem
- PHP 8.1 atau lebih tinggi
- Node.js 16.0 atau lebih tinggi
- MySQL/MariaDB
- Composer
- NPM/Yarn/Bun

## Cara Instalasi

### Backend (Laravel)

1. Masuk ke direktori backend:
```bash
cd pbl-backend
```

2. Install dependencies menggunakan Composer:
```bash
composer install
```

3. Salin file .env.example menjadi .env:
```bash
cp .env.example .env
```

4. Generate application key:
```bash
php artisan key:generate
```

5. Konfigurasi database di file .env:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nama_database
DB_USERNAME=username
DB_PASSWORD=password
```

6. Jalankan migrasi database:
```bash
# Tanpa data awal
php artisan migrate

# Dengan data awal (recommended)
php artisan migrate --seed
```

7. Jalankan server Laravel:
```bash
php artisan serve
```

### Frontend (Next.js)

1. Masuk ke direktori frontend:
```bash
cd pbl-frontend
```

2. Install dependencies (pilih salah satu):
```bash
# Menggunakan NPM
npm install

# Menggunakan Yarn
yarn install

# Menggunakan Bun
bun install
```

3. Salin file .env.example menjadi .env:
```bash
cp .env.example .env
```

4. Jalankan development server (pilih salah satu):
```bash
# Menggunakan NPM
npm run dev

# Menggunakan Yarn
yarn dev

# Menggunakan Bun
bun dev
```

## Akses Aplikasi

- Frontend: http://localhost:3000
- Backend: http://localhost:8000

## Akun Default

### Dosen
- Email: dosen@example.com
- Password: password

### Mahasiswa
- Email: mahasiswa@example.com
- Password: password

## Fitur Utama

1. **Dosen**
   - Membuat dan mengelola kuis
   - Mengelola kelas
   - Melihat nilai mahasiswa
   - Dashboard statistik

2. **Mahasiswa**
   - Mengikuti kuis
   - Melihat nilai
   - Riwayat kuis

## Troubleshooting

1. Jika terjadi error saat instalasi dependencies:
   - Hapus folder node_modules dan package-lock.json
   - Jalankan ulang npm install/yarn install/bun install

2. Jika terjadi error database:
   - Pastikan service MySQL/MariaDB berjalan
   - Cek konfigurasi database di .env
   - Reset database: php artisan migrate:fresh --seed

## Kontribusi

Silakan buat pull request untuk kontribusi. Untuk perubahan besar, harap buka issue terlebih dahulu untuk diskusi.

## Lisensi

[MIT License](LICENSE)