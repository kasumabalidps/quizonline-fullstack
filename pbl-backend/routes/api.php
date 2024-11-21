<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\CountDataController;
use App\Http\Controllers\DataHandlerController;

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
Route::middleware(['auth:dosen'])->group(function () {
    Route::get('/dosen/user', function (Request $request) {
        return $request->user();
    });
});

// Data Handler Route
Route::get('/all-data', [DataHandlerController::class, 'getAllData']);
Route::get('/mahasiswa-data', [DataHandlerController::class, 'getMahasiswaData']);
Route::get('/dosen-data', [DataHandlerController::class, 'getDosenData']);
Route::get('/jurusan-data', [DataHandlerController::class, 'getJurusanData']);
Route::get('/prodi-data', [DataHandlerController::class, 'getProdiData']);
Route::get('/kelas-data', [DataHandlerController::class, 'getKelasData']);

// Count Data
Route::get('/count/user', [CountDataController::class, 'countData']);
