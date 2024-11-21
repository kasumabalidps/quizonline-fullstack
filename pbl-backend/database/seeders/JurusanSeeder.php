<?php

namespace Database\Seeders;

use App\Models\Jurusan;
use Illuminate\Database\Seeder;

class JurusanSeeder extends Seeder
{
    public function run(): void
    {
        Jurusan::create([
            'code_jurusan' => 'TI',
            'nama_jurusan' => 'Teknik Informatika'
        ]);
    }
}
