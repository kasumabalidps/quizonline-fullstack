<?php

namespace Database\Seeders;

use App\Models\DosenKelas;
use Illuminate\Database\Seeder;

class DosenKelasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $dosen_kelas = [
            [
                'id_dosen' => 1,
                'id_kelas' => 1
            ],
            [
                'id_dosen' => 1,
                'id_kelas' => 2
            ],
            [
                'id_dosen' => 2,
                'id_kelas' => 1
            ],
            [
                'id_dosen' => 2,
                'id_kelas' => 2
            ]
        ];

        foreach ($dosen_kelas as $dk) {
            DosenKelas::create($dk);
        }
    }
}
