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
            ['nidn' => '199902212024061001', 'nama' => 'I Nyoman Rai Widartha Kesuma, S.Kom., M.Kom.', 'email' => 'Widartha.Kesuma@gmail.com', 'password' => Hash::make('password'), 'id_jurusan' => 1],
            ['nidn' => '199011052019031009', 'nama' => 'I Komang Wiratama, S.Kom.,M.Cs', 'email' => 'Komang.Wiratama@gmail.com', 'password' => Hash::make('password'), 'id_jurusan' => 1],
            ['nidn' => '199004042019031017', 'nama' => 'I Made Riyan Adi Nugroho, S.SI.,M.T.', 'email' => 'Riyan.Adi@gmail.com', 'password' => Hash::make('password'), 'id_jurusan' => 1],
            ['nidn' => '199501052023211012', 'nama' => 'I Putu Astya Prayudha, S.TI.,M.T.', 'email' => 'Astya.Prayudha@gmail.com', 'password' => Hash::make('password'), 'id_jurusan' => 1],
            ['nidn' => '0012059501', 'nama' => 'I Putu Bagus Arya Pradnyana, S.Kom., M.Kom.', 'email' => 'Bagus.Arya@gmail.com', 'password' => Hash::make('password'), 'id_jurusan' => 1],
            ['nidn' => '198507062015042003', 'nama' => 'Gusti Nyoman Ayu Sukerti, SS, M.Hum', 'email' => 'Ayu.Sukerti@gmail.com', 'password' => Hash::make('password'), 'id_jurusan' => 1],
            ['nidn' => '197111051999031002', 'nama' => 'I Gusti Ngurah Bagus Catur Bawa, ST, M.Kom.', 'email' => 'Catur.Bawa@gmail.com', 'password' => Hash::make('password'), 'id_jurusan' => 1],
            ['nidn' => '197203142001121001', 'nama' => 'Putu Gde Sukarata, S.T.,M.T.', 'email' => 'Gde.Sukarata@gmail.com', 'password' => Hash::make('password'), 'id_jurusan' => 1],
            ['nidn' => '197306261999032001', 'nama' => 'Sri Andriati Asri, ST.,M.Kom', 'email' => 'Andriati.Asri@gmail.com', 'password' => Hash::make('password'), 'id_jurusan' => 1],
            ['nidn' => '199011082022031002', 'nama' => 'I Putu Oka Wisnawa, S.Kom.,M.T.', 'email' => 'Oka.Wiswana@gmail.com', 'password' => Hash::make('password'), 'id_jurusan' => 1],
            ['nidn' => '198612172022032002', 'nama' => 'Ni Nyoman Harini Puspita, ST.,M.Kom', 'email' => 'Harini.Puspita@gmail.com', 'password' => Hash::make('password'), 'id_jurusan' => 1],
            ['nidn' => '199404112022032022', 'nama' => 'Luh Gede Putri Suardani, S.Kom., M.T.', 'email' => 'Putri.Suardani@gmail.com', 'password' => Hash::make('password'), 'id_jurusan' => 1],
            ['nidn' => '199111302022031006', 'nama' => 'Ida Bagus Adisimakrisna Peling, S.Kom, M.T.', 'email' => 'Adisimakrisna.Pelinh@gmail.com', 'password' => Hash::make('password'), 'id_jurusan' => 1],
            ['nidn' => '199408132022031007', 'nama' => 'Made Pasek Agus Ariawan, S.Kom., M.T', 'email' => 'Made.Pasek@gmail.com', 'password' => Hash::make('password'), 'id_jurusan' => 1],
            ['nidn' => '199108312022031007', 'nama' => 'Ir. Gde Brahupadhya Subiksa, S.Kom., M.T.', 'email' => 'Gde.Brahupadhya@gmail.com', 'password' => Hash::make('password'), 'id_jurusan' => 1],
            ['nidn' => '199009012019031012', 'nama' => 'Agus Adi Putrawan, S.Pd.,M.Pd.', 'email' => 'Agus.Adi@gmail.com', 'password' => Hash::make('password'), 'id_jurusan' => 1],
            ['nidn' => '198504132014042001', 'nama' => 'Putu Indah Ciptayani, S.Kom.,M.Cs.', 'email' => 'Indah.Ciptayani@gmail.com', 'password' => Hash::make('password'), 'id_jurusan' => 1],
            ['nidn' => '198005312005011003', 'nama' => 'I Wayan Candra Winetra, S.Kom.,M.Kom', 'email' => 'Candra.Winetra@gmail.com', 'password' => Hash::make('password'), 'id_jurusan' => 1],
            ['nidn' => '198003062003122002', 'nama' => 'Ni Wayan Wisswani, S.T.,M.T.', 'email' => 'Wayan.Wisswani@gmail.com', 'password' => Hash::make('password'), 'id_jurusan' => 1],
            ['nidn' => '198003172002122001', 'nama' => 'Dr. Putu Manik Prihatini, S.T.,M.T.', 'email' => 'Putu.Manik@gmail.com', 'password' => Hash::make('password'), 'id_jurusan' => 1],
            ['nidn' => '197602202006041001', 'nama' => 'I Nyoman Eddy Indrayana, S.Kom.,M.T.', 'email' => 'Eddy.Indrayana@gmail.com', 'password' => Hash::make('password'), 'id_jurusan' => 1],
            ['nidn' => '198707052015041002', 'nama' => 'Ida Bagus Putra Manuaba,S.Kom.,M.T.', 'email' => 'Putra.Manuaba@gmail.com', 'password' => Hash::make('password'), 'id_jurusan' => 1],
            ['nidn' => '197604122008012017', 'nama' => 'Elina Rudiastari, SH,MH', 'email' => 'Elina.Rudiastri@gmail.com', 'password' => Hash::make('password'), 'id_jurusan' => 1],
            ['nidn' => '0015069601', 'nama' => 'Ni Ketut Pradani Gayatri Sarja, S.Kom.,M.Kom', 'email' => 'Ketut.Pradani@gmail.com', 'password' => Hash::make('password'), 'id_jurusan' => 1],
            ['nidn' => '198102202015042001', 'nama' => 'Komang Ayu Triana Indah,ST,MT.', 'email' => 'Komang.Ayu@gmail.com', 'password' => Hash::make('password'), 'id_jurusan' => 1],
            ['nidn' => '197104191997021001', 'nama' => 'I Ketut Gede Sudiartha, ST.,M.T.', 'email' => 'Gede.Sudiartha@gmail.com', 'password' => Hash::make('password'), 'id_jurusan' => 1],
            ['nidn' => '198802152022031001', 'nama' => 'Made Pradnyana Ambara, S.Kom.,M.T', 'email' => 'Made.Pradnyana@gmail.com', 'password' => Hash::make('password'), 'id_jurusan' => 1],
            ['nidn' => '198202142006041001', 'nama' => 'I Made Ari Dwi Suta Atmaja, S.T.,M.T.', 'email' => 'Dwi.Suta@gmail.com', 'password' => Hash::make('password'), 'id_jurusan' => 1],
            ['nidn' => '197511102001121002', 'nama' => 'I Wayan Suasnawa,S.T.,M.T.', 'email' => 'Wayan.Suasnawa@gmail.com', 'password' => Hash::make('password'), 'id_jurusan' => 1],
            ['nidn' => '197609042006042001', 'nama' => 'Ni Gusti Ayu Putu Harry Saptarini, S.Kom., M.Cs', 'email' => 'Harry.Saptarini@gmail.com', 'password' => Hash::make('password'), 'id_jurusan' => 1],
            ['nidn' => '198111052014041001', 'nama' => 'I Wayan Budi Sentana, S.T., M.Kom.', 'email' => 'Budi.Sentana@gmail.com', 'password' => Hash::make('password'), 'id_jurusan' => 1],
            ['nidn' => '196902121995121001', 'nama' => 'Prof. Dr. I Nym Gd Arya Astawa, ST., M.Kom.', 'email' => 'arya_kmg@pnb.ac.id', 'password' => Hash::make('password'), 'id_jurusan' => 1]
        ];

        foreach ($dosens as $dosen) {
            Dosen::create($dosen);
        }
    }
}
