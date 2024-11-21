<?php

namespace Database\Seeders;

use App\Models\Mahasiswa;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class MahasiswaSeeder extends Seeder
{
    public function run(): void
    {
        Mahasiswa::create([
            'nim' => '123456789',
            'nama' => 'Mahasiswa Test',
            'email' => 'mahasiswa@test.com',
            'password' => Hash::make('mahasiswa123'),
            'id_kelas' => '1',
        ]);
    }
}
