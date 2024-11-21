<?php

namespace Database\Seeders;

use App\Models\Kelas;
use Illuminate\Database\Seeder;

class KelasSeeder extends Seeder
{
    public function run(): void
    {
        $kelas = [
            [
                'code_kelas' => 'TI-1A',
                'nama_kelas' => 'Teknik Informatika 1A',
                'id_prodi' => 1
            ],
            [
                'code_kelas' => 'TI-1B',
                'nama_kelas' => 'Teknik Informatika 1B',
                'id_prodi' => 1
            ],
            [
                'code_kelas' => 'TE-1A',
                'nama_kelas' => 'Teknik Elektro 1A',
                'id_prodi' => 3
            ],
            [
                'code_kelas' => 'TE-1B',
                'nama_kelas' => 'Teknik Elektro 1B',
                'id_prodi' => 3
            ]
        ];

        foreach ($kelas as $k) {
            Kelas::create($k);
        }
    }
}
