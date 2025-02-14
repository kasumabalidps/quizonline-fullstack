<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        $this->call([
            AdminSeeder::class,
            JurusanSeeder::class,
            ProdiSeeder::class,
            KelasSeeder::class,
            MahasiswaSeeder::class,
            DosenSeeder::class,
            MatkulSeeder::class,
            DosenKelasSeeder::class,
            KuisSeeder::class,
            SoalSeeder::class,
            SoalKuisSeeder::class,
        ]);
    }
}
