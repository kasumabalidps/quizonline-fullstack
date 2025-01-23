<?php

namespace Database\Seeders;

use App\Models\Prodi;
use Illuminate\Database\Seeder;

class ProdiSeeder extends Seeder
{
    public function run(): void
    {
        $prodis = [
            [
                'code_prodi' => 'D3PR',
                'nama_prodi' => 'D3 Perhotelan',
                'id_jurusan' => 1
            ],
            [
                'code_prodi' => 'D3AB',
                'nama_prodi' => 'D3 Administrasi Bisnis',
                'id_jurusan' => 2
            ],
            [
                'code_prodi' => 'D3TM',
                'nama_prodi' => 'D3 Teknik Mesin',
                'id_jurusan' => 3
            ],
            [
                'code_prodi' => 'D3TS',
                'nama_prodi' => 'D3 Teknik Sipil',
                'id_jurusan' => 4
            ],
            [
                'code_prodi' => 'D3AK',
                'nama_prodi' => 'D3 Akutansi',
                'id_jurusan' => 5
            ],
            [
                'code_prodi' => 'D3TE',
                'nama_prodi' => 'D3 Teknik Listrik',
                'id_jurusan' => 6
            ],
            [
                'code_prodi' => 'D4TI',
                'nama_prodi' => 'D4 Teknologi Rekayasa Perangkat Lunak',
                'id_jurusan' => 7
            ]
        ];

        foreach ($prodis as $prodi) {
            Prodi::create($prodi);
        }
    }
}
