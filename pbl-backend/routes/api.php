<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\CountDataController;
use App\Http\Controllers\DataHandlerController;
use App\Http\Controllers\KelasDataController;
use App\Http\Controllers\ProdiDataController;
use App\Http\Controllers\JurusanDataController;
use App\Http\Controllers\DosenDataController;
use App\Http\Controllers\MahasiswaDataController;
use App\Http\Controllers\KuisDataController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

// Admin Routes
Route::middleware(['auth:admin'])->group(function () {
    Route::get('/admin/user', function (Request $request) {
        return $request->user();
    });
});

// Mahasiswa Routes
Route::middleware(['auth:mahasiswa'])->group(function () {
    Route::get('/mahasiswa/user', function (Request $request) {
        return $request->user();
    });
});

// Dosen Routes
Route::prefix('dosen')->middleware(['auth:dosen'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    // Kelas routes
    Route::get('/kelas', [DosenDataController::class, 'getDosenKelas']);
    
    // Mata kuliah routes
    Route::get('/matkul', [DosenDataController::class, 'getDosenMatkul']);
    
    // Kuis routes untuk dosen
    Route::get('/kuis', [KuisDataController::class, 'index']);
    Route::get('/soal', [KuisDataController::class, 'getAllSoal']);
    Route::post('/kuis', [KuisDataController::class, 'store']);
    Route::put('/kuis/{id}', [KuisDataController::class, 'update']);
    Route::delete('/kuis/{id}', [KuisDataController::class, 'destroy']);
});

// Data Handler Route
Route::middleware(['auth:admin'])->group(function () {
    Route::get('/all-data', [DataHandlerController::class, 'getAllData']);
    Route::get('/mahasiswa-data', [MahasiswaDataController::class, 'getMahasiswaData']);
    Route::get('/dosen-data', [DosenDataController::class, 'getDosenData']);
    Route::get('/jurusan-data', [JurusanDataController::class, 'getJurusanData']);
    Route::get('/prodi-data', [ProdiDataController::class, 'getProdiData']);
    Route::get('/kelas-data', [KelasDataController::class, 'getKelasData']);
    // Count Data
    Route::get('/count/user', [CountDataController::class, 'countData']);
});

// Edit Create Data Handler
Route::middleware('auth:admin')->group(function () {
    // Kelas routes
    Route::get('/kelas', [KelasDataController::class, 'index']);
    Route::post('/kelas', [KelasDataController::class, 'store']);
    Route::put('/kelas/{kelas}', [KelasDataController::class, 'update']);
    Route::delete('/kelas/{kelas}', [KelasDataController::class, 'destroy']);

    // Prodi routes
    Route::get('/prodi', [ProdiDataController::class, 'index']);
    Route::post('/prodi', [ProdiDataController::class, 'store']);
    Route::put('/prodi/{prodi}', [ProdiDataController::class, 'update']);
    Route::delete('/prodi/{prodi}', [ProdiDataController::class, 'destroy']);

    // Jurusan routes
    Route::get('/jurusan', [JurusanDataController::class, 'index']);
    Route::post('/jurusan', [JurusanDataController::class, 'store']);
    Route::put('/jurusan/{jurusan}', [JurusanDataController::class, 'update']);
    Route::delete('/jurusan/{jurusan}', [JurusanDataController::class, 'destroy']);

    // Dosen routes
    Route::get('/dosen', [DosenDataController::class, 'index']);
    Route::post('/dosen', [DosenDataController::class, 'store']);
    Route::put('/dosen/{dosen}', [DosenDataController::class, 'update']);
    Route::delete('/dosen/{dosen}', [DosenDataController::class, 'destroy']);

    // Mahasiswa routes
    Route::get('/mahasiswa', [MahasiswaDataController::class, 'index']);
    Route::post('/mahasiswa', [MahasiswaDataController::class, 'store']);
    Route::put('/mahasiswa/{mahasiswa}', [MahasiswaDataController::class, 'update']);
    Route::delete('/mahasiswa/{mahasiswa}', [MahasiswaDataController::class, 'destroy']);
});

// Kuis routes untuk dosen dan mahasiswa
// Route::middleware(['auth:dosen,mahasiswa'])->group(function () {
//     Route::get('/kuis', [KuisDataController::class, 'index']);
//     Route::get('/kuis/{id}', [KuisDataController::class, 'show']);
//     Route::get('/soal', [KuisDataController::class, 'getAllSoal']);
// });
