<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\DosenAuthenticatedSessionController;
use App\Http\Controllers\Auth\AdminAuthenticatedSessionController;
use App\Http\Controllers\Auth\MahasiswaAuthenticatedSessionController;
use Illuminate\Support\Facades\Route;

// Route::post('/register', [RegisteredUserController::class, 'store'])
//     ->middleware('guest')
//     ->name('register');

// Route::post('/login', [AuthenticatedSessionController::class, 'store'])
//     ->middleware('guest')
//     ->name('login');

// Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
//     ->middleware('guest')
//     ->name('password.email');

// Route::post('/reset-password', [NewPasswordController::class, 'store'])
//     ->middleware('guest')
//     ->name('password.store');

// Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
//     ->middleware('auth')
//     ->name('logout');

// Main Routes
Route::middleware('guest')->group(function () {
    Route::post('/admin/login', [AdminAuthenticatedSessionController::class, 'store'])
        ->name('admin.login');
});

Route::middleware('guest')->group(function () {
    Route::post('/mahasiswa/login', [MahasiswaAuthenticatedSessionController::class, 'store'])
        ->name('mahasiswa.login');
});

Route::middleware('guest')->group(function () {
    Route::post('/dosen/login', [DosenAuthenticatedSessionController::class, 'store'])
        ->name('dosen.login');
});


// Logout
Route::middleware('auth:admin')->group(function () {
    Route::post('/admin/logout', [AdminAuthenticatedSessionController::class, 'destroy'])
        ->name('admin.logout');
});

Route::middleware('auth:mahasiswa')->group(function () {
    Route::post('/mahasiswa/logout', [MahasiswaAuthenticatedSessionController::class, 'destroy'])
        ->name('mahasiswa.logout');
});

Route::middleware('auth:dosen')->group(function () {
    Route::post('/dosen/logout', [DosenAuthenticatedSessionController::class, 'destroy'])
        ->name('dosen.logout');
});
