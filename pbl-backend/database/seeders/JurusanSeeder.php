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
                'code_jurusan' => 'TI',
                'nama_jurusan' => 'Teknik Informatika'
            ],
            [
                'code_jurusan' => 'TE',
                'nama_jurusan' => 'Teknik Elektro'
            ],
            [
                'code_jurusan' => 'TM',
                'nama_jurusan' => 'Teknik Mesin'
            ],
            [
                'code_jurusan' => 'TS',
                'nama_jurusan' => 'Teknik Sipil'
            ]
        ];

        foreach ($jurusans as $jurusan) {
            Jurusan::create($jurusan);
        }
    }
}
