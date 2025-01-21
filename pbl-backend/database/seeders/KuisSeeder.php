<?php

namespace Database\Seeders;

use App\Models\Kuis;
use Illuminate\Database\Seeder;

class KuisSeeder extends Seeder
{
    public function run(): void
    {
        $kuis = [
            [
                'judul' => 'UTS Pemrograman Web',
                'id_dosen' => 1,
                'id_kelas' => 1,
                'id_matkul' => 1,
                'waktu_mulai' => '2024-01-01 08:00:00',
                'waktu_selesai' => '2024-01-01 10:00:00',
            ],
            [
                'judul' => 'UAS Basis Data',
                'id_dosen' => 2,
                'id_kelas' => 2,
                'id_matkul' => 2,
                'waktu_mulai' => '2024-01-02 13:00:00',
                'waktu_selesai' => '2024-01-02 15:00:00',
            ],
        ];

        foreach ($kuis as $k) {
            Kuis::create($k);
        }
    }
}
