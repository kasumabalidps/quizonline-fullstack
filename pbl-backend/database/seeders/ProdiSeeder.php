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
                'code_prodi' => 'D3TI',
                'nama_prodi' => 'D3 Teknik Informatika',
                'id_jurusan' => 1
            ],
            [
                'code_prodi' => 'D4TI',
                'nama_prodi' => 'D4 Teknik Informatika',
                'id_jurusan' => 1
            ],
            [
                'code_prodi' => 'D3TE',
                'nama_prodi' => 'D3 Teknik Elektro',
                'id_jurusan' => 2
            ],
            [
                'code_prodi' => 'D4TE',
                'nama_prodi' => 'D4 Teknik Elektro',
                'id_jurusan' => 2
            ]
        ];

        foreach ($prodis as $prodi) {
            Prodi::create($prodi);
        }
    }
}
