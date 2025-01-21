<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\MahasiswaLoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MahasiswaAuthenticatedSessionController extends Controller
{
    public function store(MahasiswaLoginRequest $request): JsonResponse
    {
        $request->authenticate();
        $request->session()->regenerate();
        return response()->json(['message' => 'Berhasil logged in']);
    }

    public function destroy(Request $request): JsonResponse
    {
        Auth::guard('mahasiswa')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json(['message' => 'Berhasil logged out']);
    }
}
