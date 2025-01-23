<?php

namespace Database\Seeders;

use App\Models\MataKuliah;
use App\Models\MatkulKelas;
use App\Models\Dosen;
use App\Models\Kelas;
use Illuminate\Database\Seeder;

class MatkulSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $dosen = Dosen::first();

        if (!$dosen) {
            $this->command->error('Tidak ada dosen yang tersedia. Jalankan DosenSeeder terlebih dahulu.');
            return;
        }

        // Pastikan ada kelas
        $kelas = Kelas::first();
        if (!$kelas) {
            $this->command->error('Tidak ada kelas yang tersedia. Jalankan KelasSeeder terlebih dahulu.');
            return;
        }

        $matkuls = [
            ['nama_matkul' => 'Analisa dan Desain Perangkat Lunak', 'id_dosen' => $dosen->id],
            ['nama_matkul' => 'Basis Data', 'id_dosen' => $dosen->id],
            ['nama_matkul' => 'Pemrogramman Berorientasi Objek II', 'id_dosen' => $dosen->id],
            ['nama_matkul' => 'Pemrogramman Web Lanjut', 'id_dosen' => $dosen->id],
            ['nama_matkul' => 'Bahasa Indonesia', 'id_dosen' => $dosen->id],
            ['nama_matkul' => 'Statisika dan Probalitas', 'id_dosen' => $dosen->id],
            ['nama_matkul' => 'Pemrogramman Web Lanjut', 'id_dosen' => $dosen->id],

        ];

        MataKuliah::truncate();
        MatkulKelas::truncate();

        // Tambah data mata kuliah dan hubungkan dengan kelas
        foreach ($matkuls as $index => $matkulData) {
            $matkul = MataKuliah::create($matkulData);
            
            // Hubungkan dengan kelas
            MatkulKelas::create([
                'id_matkul' => $matkul->id,
                'id_kelas' => $kelas->id
            ]);
        }
    }
}