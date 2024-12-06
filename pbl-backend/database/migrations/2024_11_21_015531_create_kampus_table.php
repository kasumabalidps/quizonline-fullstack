<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('jurusan', function (Blueprint $table) {
            $table->id();
            $table->string('code_jurusan')->unique();
            $table->string('nama_jurusan');
            $table->timestamps();
        });

        Schema::create('prodi', function (Blueprint $table) {
            $table->id();
            $table->string('code_prodi');
            $table->string('nama_prodi');
            $table->foreignId('id_jurusan')
                ->references('id')
                ->on('jurusan')
                ->onDelete('cascade')
                ->onUpdate('cascade');
            $table->timestamps();
        });

        Schema::create('kelas', function (Blueprint $table) {
            $table->id();
            $table->string('code_kelas');
            $table->string('nama_kelas');
            $table->foreignId('id_prodi')
                ->references('id')
                ->on('prodi')
                ->onDelete('cascade')
                ->onUpdate('cascade');
            $table->timestamps();
        });

        Schema::create('mata_kuliah', function (Blueprint $table) {
            $table->id();
            $table->string('id_matkul');
            $table->string('nama_matkul');
            $table->timestamps();
        });

        Schema::create('dosen_matkul', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dosen_id')->references('id')->on('dosen')->onDelete('cascade');
            $table->foreignId('matkul_id')->references('id')->on('mata_kuliah')->onDelete('cascade');
            $table->timestamps();
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('jurusan');
        Schema::dropIfExists('prodi');
        Schema::dropIfExists('kelas');
        Schema::dropIfExists('mata_kuliah');
        Schema::dropIfExists('dosen_matkul');
    }
};
