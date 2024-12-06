<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class MatkulSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        $matkuls = [
            [
                'id_matkul' => '1',
                'nama_matkul' => 'Matematika',
            ],
            [
                'id_matkul' => '2',
                'nama_matkul' => 'Fisika',
            ],
            [
                'id_matkul' => '3',
                'nama_matkul' => 'Kimia',
            ],
            [
                'id_matkul' => '4',
                'nama_matkul' => 'Biologi',
            ]   
        ];

        $dosen_matkul = [
            [
                'dosen_id' => 1,
                'matkul_id' => 1
            ],
            [
                'dosen_id' => 2,
                'matkul_id' => 2
            ],
            [
                'dosen_id' => 3,
                'matkul_id' => 3
            ],
            [
                'dosen_id' => 4,
                'matkul_id' => 4
            ]
        ];

        foreach ($matkuls as $matkul) {
            \App\Models\Matkul::create($matkul);
        }

        foreach ($dosen_matkul as $dm) {
            \App\Models\DosenMatkul::create($dm);
        }
    }
}