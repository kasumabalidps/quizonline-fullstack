<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('kelas', function (Blueprint $table) {
            $table->id();
            $table->string('nama_kelas');
            $table->foreignId('jurusan_id')->constrained('jurusan')->onDelete('cascade');
            $table->foreignId('prodi_id')->constrained('prodi')->onDelete('cascade');
            $table->timestamps();
        });

        // Create pivot table for dosen-kelas relationship
        Schema::create('dosen_kelas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dosen_id')->constrained('dosen')->onDelete('cascade');
            $table->foreignId('kelas_id')->constrained('kelas')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('dosen_kelas');
        Schema::dropIfExists('kelas');
    }
};
