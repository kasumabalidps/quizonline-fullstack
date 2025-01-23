<?php

namespace Database\Seeders;

use App\Models\Jurusan;
use Illuminate\Database\Seeder;

class JurusanSeeder extends Seeder
{
    public function run(): void
    {
        $jurusans = [
            [
                'code_jurusan' => 'PR',
                'nama_jurusan' => 'Pariwisata'
            ],
            [
                'code_jurusan' => 'AB',
                'nama_jurusan' => 'Administrasi Bisnis'
            ],
            [
                'code_jurusan' => 'TM',
                'nama_jurusan' => 'Teknik Mesin'
            ],
            [
                'code_jurusan' => 'TS',
                'nama_jurusan' => 'Teknik Sipil'
            ],
            [
                'code_jurusan' => 'AK',
                'nama_jurusan' => 'Akutansi'
            ],
            [
                'code_jurusan' => 'TI',
                'nama_jurusan' => 'Teknologi Informasi'
            ],
            [
                'code_jurusan' => 'TE',
                'nama_jurusan' => 'Teknik Elektro'
            ]
        ];

        foreach ($jurusans as $jurusan) {
            Jurusan::create($jurusan);
        }
    }
}
