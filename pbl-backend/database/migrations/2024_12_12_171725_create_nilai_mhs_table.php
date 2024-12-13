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
        Schema::create('nilai_mhs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_mhs')->references('id')->on('mahasiswa')->onDelete('cascade');
            $table->integer('nilai_total');
            $table->foreignId('id_kuis')->references('id')->on('kuis')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nilai_mhs');
    }
};
