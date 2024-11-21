<?php

namespace Database\Seeders;

use App\Models\Prodi;
use Illuminate\Database\Seeder;

class ProdiSeeder extends Seeder
{
    public function run(): void
    {
        Prodi::create([
            'code_prodi' => 'D3TI',
            'nama_prodi' => 'D3 Teknik Informatika',
            'id_jurusan' => '1'
        ]);
    }
}
