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
            ['nim' => '2024001', 'nama' => 'Aditya Pratama', 'email' => 'aditya.pratama@pnb.ac.id', 'password' => Hash::make('password'), 'id_kelas' => 1],
            ['nim' => '2024002', 'nama' => 'Bunga Melati', 'email' => 'bunga.melati@pnb.ac.id', 'password' => Hash::make('password'), 'id_kelas' => 1],
            ['nim' => '2024003', 'nama' => 'Cahya Wijaya', 'email' => 'cahya.wijaya@pnb.ac.id', 'password' => Hash::make('password'), 'id_kelas' => 1],
            ['nim' => '2024004', 'nama' => 'Dinda Permata', 'email' => 'dinda.permata@pnb.ac.id', 'password' => Hash::make('password'), 'id_kelas' => 1],
            ['nim' => '2024005', 'nama' => 'Eko Saputra', 'email' => 'eko.saputra@pnb.ac.id', 'password' => Hash::make('password'), 'id_kelas' => 1],
            ['nim' => '2024006', 'nama' => 'Fitria Sari', 'email' => 'fitria.sari@pnb.ac.id', 'password' => Hash::make('password'), 'id_kelas' => 2],
            ['nim' => '2024007', 'nama' => 'Galih Prakoso', 'email' => 'galih.prakoso@pnb.ac.id', 'password' => Hash::make('password'), 'id_kelas' => 2],
            ['nim' => '2024008', 'nama' => 'Hana Safira', 'email' => 'hana.safira@pnb.ac.id', 'password' => Hash::make('password'), 'id_kelas' => 2],
            ['nim' => '2024009', 'nama' => 'Irfan Hakim', 'email' => 'irfan.hakim@pnb.ac.id', 'password' => Hash::make('password'), 'id_kelas' => 2],
            ['nim' => '2024010', 'nama' => 'Jasmine Putri', 'email' => 'jasmine.putri@pnb.ac.id', 'password' => Hash::make('password'), 'id_kelas' => 2],
            ['nim' => '2024011', 'nama' => 'Kusuma Wijaya', 'email' => 'kusuma.wijaya@pnb.ac.id', 'password' => Hash::make('password'), 'id_kelas' => 3],
            ['nim' => '2024012', 'nama' => 'Laras Ayu', 'email' => 'laras.ayu@pnb.ac.id', 'password' => Hash::make('password'), 'id_kelas' => 3],
            ['nim' => '2024013', 'nama' => 'Muhammad Rizky', 'email' => 'muhammad.rizky@pnb.ac.id', 'password' => Hash::make('password'), 'id_kelas' => 3],
            ['nim' => '2024014', 'nama' => 'Nadia Putri', 'email' => 'nadia.putri@pnb.ac.id', 'password' => Hash::make('password'), 'id_kelas' => 3],
            ['nim' => '2024015', 'nama' => 'Oktavian Pratama', 'email' => 'oktavian.pratama@pnb.ac.id', 'password' => Hash::make('password'), 'id_kelas' => 3],
            ['nim' => '2024016', 'nama' => 'Putri Wulandari', 'email' => 'putri.wulandari@pnb.ac.id', 'password' => Hash::make('password'), 'id_kelas' => 4],
            ['nim' => '2024017', 'nama' => 'Rafi Ahmad', 'email' => 'rafi.ahmad@pnb.ac.id', 'password' => Hash::make('password'), 'id_kelas' => 4],
            ['nim' => '2024018', 'nama' => 'Sinta Dewi', 'email' => 'sinta.dewi@pnb.ac.id', 'password' => Hash::make('password'), 'id_kelas' => 4],
            ['nim' => '2024019', 'nama' => 'Tegar Firmansyah', 'email' => 'tegar.firmansyah@pnb.ac.id', 'password' => Hash::make('password'), 'id_kelas' => 4],
            ['nim' => '2024020', 'nama' => 'Utari Handayani', 'email' => 'utari.handayani@pnb.ac.id', 'password' => Hash::make('password'), 'id_kelas' => 4]
        ];

        foreach ($mahasiswas as $mahasiswa) {
            Mahasiswa::create($mahasiswa);
        }
    }
}
