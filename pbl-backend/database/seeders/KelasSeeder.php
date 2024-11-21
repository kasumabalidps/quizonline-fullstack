<?php

namespace Database\Seeders;

use App\Models\Kelas;
use Illuminate\Database\Seeder;

class KelasSeeder extends Seeder
{
    public function run(): void
    {
        Kelas::create([
            'code_kelas' => 'TI-1A',
            'nama_kelas' => 'TI-1A',
            'id_prodi' => '1',
        ]);
    }
}
