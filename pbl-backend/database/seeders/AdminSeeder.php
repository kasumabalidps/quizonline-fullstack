<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $admins = [
            [
                'nama' => 'Budi Santoso',
                'email' => 'budi.santoso@admin.com',
                'password' => Hash::make('password')
            ],
            [
                'nama' => 'Dewi Lestari',
                'email' => 'dewi.lestari@admin.com',
                'password' => Hash::make('password')
            ],
            [
                'nama' => 'Agus Setiawan',
                'email' => 'agus.setiawan@admin.com',
                'password' => Hash::make('password')
            ],
            [
                'nama' => 'Siti Rahayu',
                'email' => 'siti.rahayu@admin.com',
                'password' => Hash::make('password')
            ],
            [
                'nama' => 'Bambang Wijaya',
                'email' => 'bambang.wijaya@admin.com',
                'password' => Hash::make('password')
            ],
            [
                'nama' => 'admin',
                'email' => 'admin@admin.com',
                'password' => Hash::make('password123')
            ]

        ];

        foreach ($admins as $admin) {
            Admin::create($admin);
        }
    }
}
