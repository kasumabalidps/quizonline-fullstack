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
                'code_kelas' => 'PR-3A',
                'nama_kelas' => 'Perhotalan 3A',
                'id_prodi' => 1
            ],
            [
                'code_kelas' => 'AB-3B',
                'nama_kelas' => 'Adminitrasi Bisnis 3B',
                'id_prodi' => 2
            ],
            [
                'code_kelas' => 'TM-3A',
                'nama_kelas' => 'Teknik Mesin 3A',
                'id_prodi' => 3
            ],
            [
                'code_kelas' => 'TS-3C',
                'nama_kelas' => 'Teknik Sipil 3C',
                'id_prodi' => 4
            ],
            [
                'code_kelas' => 'AK-3B',
                'nama_kelas' => 'Akuntasi 3B',
                'id_prodi' => 5
            ],
            [
                'code_kelas' => 'TL-3B',
                'nama_kelas' => 'Teknik Listrik 3B',
                'id_prodi' => 6
            ],
            [
                'code_kelas' => 'TRL-3C',
                'nama_kelas' => 'Teknologi Rekayasa Perangkat Lunak 3C',
                'id_prodi' => 7
            ]
        ];

        foreach ($kelas as $k) {
            Kelas::create($k);
        }
    }
}
