<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AdminAuthenticatedSessionController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

// Admin Routes
Route::middleware(['auth:admin'])->group(function () {
    Route::get('/admin/user', function (Request $request) {
        return $request->user();
    });
});
