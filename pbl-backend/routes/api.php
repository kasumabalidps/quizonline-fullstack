<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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
