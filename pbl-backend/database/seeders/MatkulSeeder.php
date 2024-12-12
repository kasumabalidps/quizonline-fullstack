<?php

namespace Database\Seeders;

use App\Models\MataKuliah;
use App\Models\MatkulKelas;
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
                'nama_matkul' => 'Matematika'
            ],
            [
                'nama_matkul' => 'Fisika'
            ],
            [
                'nama_matkul' => 'Kimia'
            ],
            [
                'nama_matkul' => 'Biologi'
            ]
        ];

        foreach ($matkuls as $matkul) {
            MataKuliah::create($matkul);
        }

        // Contoh relasi matkul dengan kelas
        $matkul_kelas = [
            [
                'id_matkul' => 1,
                'id_kelas' => 1
            ],
            [
                'id_matkul' => 2,
                'id_kelas' => 1
            ],
            [
                'id_matkul' => 3,
                'id_kelas' => 2
            ],
            [
                'id_matkul' => 4,
                'id_kelas' => 2
            ]
        ];

        foreach ($matkul_kelas as $mk) {
            MatkulKelas::create($mk);
        }
    }
}