<?php

namespace Database\Seeders;

use App\Models\Dosen;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DosenSeeder extends Seeder
{
    public function run(): void
    {
        Dosen::create([
            'nidn' => '2318273738',
            'nama' => 'Dosen Test',
            'email' => 'dosen@dosen.com',
            'password' => Hash::make('dosen123'),
            'id_jurusan' => '1',
        ]);
    }
}
