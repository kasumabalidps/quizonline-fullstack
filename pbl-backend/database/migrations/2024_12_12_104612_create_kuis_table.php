<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('kuis', function (Blueprint $table) {
            $table->id();
            $table->string('judul');
            $table->foreignId('id_dosen')->references('id')->on('dosen')->onDelete('cascade');
            $table->foreignId('id_kelas')->references('id')->on('kelas')->onDelete('cascade');
            $table->foreignId('id_matkul')->references('id')->on('mata_kuliah')->onDelete('cascade');
            $table->dateTime('waktu_mulai');
            $table->dateTime('waktu_selesai');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kuis');
    }
};
