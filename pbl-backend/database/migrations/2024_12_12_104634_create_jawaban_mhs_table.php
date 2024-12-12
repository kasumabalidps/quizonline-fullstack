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
        Schema::create('jawaban_mhs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_mhs')->constrained('mahasiswa')->onDelete('cascade');
            $table->foreignId('id_kuis')->constrained('kuis')->onDelete('cascade');
            $table->foreignId('id_soal')->constrained('soal')->onDelete('cascade');
            $table->enum('jawaban', ['a', 'b', 'c', 'd']);
            $table->float('nilai')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jawaban_mhs');
    }
};
