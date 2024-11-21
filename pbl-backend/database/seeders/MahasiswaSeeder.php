<?php

namespace Database\Seeders;

use App\Models\Mahasiswa;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class MahasiswaSeeder extends Seeder
{
    public function run(): void
    {
        $mahasiswas = [
            ['nim' => '2024001', 'nama' => 'Aditya Pratama', 'email' => 'aditya.pratama@student.com', 'password' => Hash::make('password'), 'id_kelas' => 1],
            ['nim' => '2024002', 'nama' => 'Bunga Melati', 'email' => 'bunga.melati@student.com', 'password' => Hash::make('password'), 'id_kelas' => 1],
            ['nim' => '2024003', 'nama' => 'Cahya Wijaya', 'email' => 'cahya.wijaya@student.com', 'password' => Hash::make('password'), 'id_kelas' => 1],
            ['nim' => '2024004', 'nama' => 'Dinda Permata', 'email' => 'dinda.permata@student.com', 'password' => Hash::make('password'), 'id_kelas' => 1],
            ['nim' => '2024005', 'nama' => 'Eko Saputra', 'email' => 'eko.saputra@student.com', 'password' => Hash::make('password'), 'id_kelas' => 1],
            ['nim' => '2024006', 'nama' => 'Fitria Sari', 'email' => 'fitria.sari@student.com', 'password' => Hash::make('password'), 'id_kelas' => 2],
            ['nim' => '2024007', 'nama' => 'Galih Prakoso', 'email' => 'galih.prakoso@student.com', 'password' => Hash::make('password'), 'id_kelas' => 2],
            ['nim' => '2024008', 'nama' => 'Hana Safira', 'email' => 'hana.safira@student.com', 'password' => Hash::make('password'), 'id_kelas' => 2],
            ['nim' => '2024009', 'nama' => 'Irfan Hakim', 'email' => 'irfan.hakim@student.com', 'password' => Hash::make('password'), 'id_kelas' => 2],
            ['nim' => '2024010', 'nama' => 'Jasmine Putri', 'email' => 'jasmine.putri@student.com', 'password' => Hash::make('password'), 'id_kelas' => 2],
            ['nim' => '2024011', 'nama' => 'Kusuma Wijaya', 'email' => 'kusuma.wijaya@student.com', 'password' => Hash::make('password'), 'id_kelas' => 3],
            ['nim' => '2024012', 'nama' => 'Laras Ayu', 'email' => 'laras.ayu@student.com', 'password' => Hash::make('password'), 'id_kelas' => 3],
            ['nim' => '2024013', 'nama' => 'Muhammad Rizky', 'email' => 'muhammad.rizky@student.com', 'password' => Hash::make('password'), 'id_kelas' => 3],
            ['nim' => '2024014', 'nama' => 'Nadia Putri', 'email' => 'nadia.putri@student.com', 'password' => Hash::make('password'), 'id_kelas' => 3],
            ['nim' => '2024015', 'nama' => 'Oktavian Pratama', 'email' => 'oktavian.pratama@student.com', 'password' => Hash::make('password'), 'id_kelas' => 3],
            ['nim' => '2024016', 'nama' => 'Putri Wulandari', 'email' => 'putri.wulandari@student.com', 'password' => Hash::make('password'), 'id_kelas' => 4],
            ['nim' => '2024017', 'nama' => 'Rafi Ahmad', 'email' => 'rafi.ahmad@student.com', 'password' => Hash::make('password'), 'id_kelas' => 4],
            ['nim' => '2024018', 'nama' => 'Sinta Dewi', 'email' => 'sinta.dewi@student.com', 'password' => Hash::make('password'), 'id_kelas' => 4],
            ['nim' => '2024019', 'nama' => 'Tegar Firmansyah', 'email' => 'tegar.firmansyah@student.com', 'password' => Hash::make('password'), 'id_kelas' => 4],
            ['nim' => '2024020', 'nama' => 'Utari Handayani', 'email' => 'utari.handayani@student.com', 'password' => Hash::make('password'), 'id_kelas' => 4]
        ];

        foreach ($mahasiswas as $mahasiswa) {
            Mahasiswa::create($mahasiswa);
        }
    }
}
