<?php

namespace Database\Seeders;

use App\Models\Dosen;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DosenSeeder extends Seeder
{
    public function run(): void
    {
        $dosens = [
            ['nidn' => '198501012010011001', 'nama' => 'Dr. Ahmad Wijaya', 'email' => 'ahmad.wijaya@lecturer.com', 'password' => Hash::make('password'), 'id_jurusan' => 1],
            ['nidn' => '198601022010012002', 'nama' => 'Prof. Siti Aminah', 'email' => 'siti.aminah@lecturer.com', 'password' => Hash::make('password'), 'id_jurusan' => 1],
            ['nidn' => '198702032010013003', 'nama' => 'Dr. Budi Hartono', 'email' => 'budi.hartono@lecturer.com', 'password' => Hash::make('password'), 'id_jurusan' => 1],
            ['nidn' => '198803042010014004', 'nama' => 'Dr. Dewi Kusuma', 'email' => 'dewi.kusuma@lecturer.com', 'password' => Hash::make('password'), 'id_jurusan' => 1],
            ['nidn' => '198904052010015005', 'nama' => 'Prof. Eko Prasetyo', 'email' => 'eko.prasetyo@lecturer.com', 'password' => Hash::make('password'), 'id_jurusan' => 1],
            ['nidn' => '199005062010016006', 'nama' => 'Dr. Fajar Ramadhan', 'email' => 'fajar.ramadhan@lecturer.com', 'password' => Hash::make('password'), 'id_jurusan' => 2],
            ['nidn' => '199106072010017007', 'nama' => 'Dr. Gita Purnama', 'email' => 'gita.purnama@lecturer.com', 'password' => Hash::make('password'), 'id_jurusan' => 2],
            ['nidn' => '199207082010018008', 'nama' => 'Prof. Hendra Susanto', 'email' => 'hendra.susanto@lecturer.com', 'password' => Hash::make('password'), 'id_jurusan' => 2],
            ['nidn' => '199308092010019009', 'nama' => 'Dr. Indah Permata', 'email' => 'indah.permata@lecturer.com', 'password' => Hash::make('password'), 'id_jurusan' => 2],
            ['nidn' => '199409102010010010', 'nama' => 'Dr. Joko Widodo', 'email' => 'joko.widodo@lecturer.com', 'password' => Hash::make('password'), 'id_jurusan' => 2],
            ['nidn' => '199510112010011011', 'nama' => 'Prof. Kartini Sari', 'email' => 'kartini.sari@lecturer.com', 'password' => Hash::make('password'), 'id_jurusan' => 3],
            ['nidn' => '199611122010012012', 'nama' => 'Dr. Lukman Hakim', 'email' => 'lukman.hakim@lecturer.com', 'password' => Hash::make('password'), 'id_jurusan' => 3],
            ['nidn' => '199712132010013013', 'nama' => 'Dr. Maya Anggraini', 'email' => 'maya.anggraini@lecturer.com', 'password' => Hash::make('password'), 'id_jurusan' => 3],
            ['nidn' => '199813142010014014', 'nama' => 'Prof. Nugroho Santoso', 'email' => 'nugroho.santoso@lecturer.com', 'password' => Hash::make('password'), 'id_jurusan' => 3],
            ['nidn' => '199914152010015015', 'nama' => 'Dr. Oktavia Rahayu', 'email' => 'oktavia.rahayu@lecturer.com', 'password' => Hash::make('password'), 'id_jurusan' => 3],
            ['nidn' => '200015162010016016', 'nama' => 'Dr. Putri Handayani', 'email' => 'putri.handayani@lecturer.com', 'password' => Hash::make('password'), 'id_jurusan' => 4],
            ['nidn' => '200116172010017017', 'nama' => 'Prof. Rachmat Hidayat', 'email' => 'rachmat.hidayat@lecturer.com', 'password' => Hash::make('password'), 'id_jurusan' => 4],
            ['nidn' => '200217182010018018', 'nama' => 'Dr. Surya Darma', 'email' => 'surya.darma@lecturer.com', 'password' => Hash::make('password'), 'id_jurusan' => 4],
            ['nidn' => '200318192010019019', 'nama' => 'Dr. Tuti Wulandari', 'email' => 'tuti.wulandari@lecturer.com', 'password' => Hash::make('password'), 'id_jurusan' => 4],
            ['nidn' => '200419202010020020', 'nama' => 'Prof. Umar Wibowo', 'email' => 'umar.wibowo@lecturer.com', 'password' => Hash::make('password'), 'id_jurusan' => 4]
        ];

        foreach ($dosens as $dosen) {
            Dosen::create($dosen);
        }
    }
}
