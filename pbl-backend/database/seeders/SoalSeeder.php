<?php

namespace Database\Seeders;

use App\Models\Soal;
use Illuminate\Database\Seeder;

class SoalSeeder extends Seeder
{
    public function run(): void
    {
        $soal = [
            [
                'soal' => 'Apa yang dimaksud dengan HTML?',
                'a' => 'Hyper Text Markup Language',
                'b' => 'High Text Markup Language',
                'c' => 'Hyper Text Making Language',
                'd' => 'High Text Making Language',
                'jawaban' => 'a'
            ],
            [
                'soal' => 'Apa fungsi utama dari CSS?',
                'a' => 'Membuat logika program',
                'b' => 'Styling halaman web',
                'c' => 'Mengatur database',
                'd' => 'Membuat animasi',
                'jawaban' => 'b'
            ],
            [
                'soal' => 'Apa itu SQL?',
                'a' => 'Strong Question Language',
                'b' => 'Structured Question Language',
                'c' => 'Structured Query Language',
                'd' => 'Strong Query Language',
                'jawaban' => 'c'
            ],
        ];

        foreach ($soal as $s) {
            Soal::create($s);
        }
    }
}
