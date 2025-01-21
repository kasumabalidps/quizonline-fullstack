<?php

namespace Database\Seeders;

use App\Models\SoalKuis;
use Illuminate\Database\Seeder;

class SoalKuisSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $soalKuis = [
            [
                'id_kuis' => 1,
                'id_soal' => 1,
            ],
            [
                'id_kuis' => 1,
                'id_soal' => 2,
            ],
            [
                'id_kuis' => 2,
                'id_soal' => 3,
            ],
        ];

        foreach ($soalKuis as $sk) {
            SoalKuis::create($sk);
        }
    }
}
