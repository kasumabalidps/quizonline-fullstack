<?php

namespace App\Http\Requests\Nilai;

use Illuminate\Foundation\Http\FormRequest;

class GetNilaiRequest extends FormRequest
{
    /**
     * Tentukan apakah user berhak membuat request ini
     */
    public function authorize(): bool
    {
        return true; // Otorisasi detail akan ditangani di middleware
    }

    /**
     * Aturan validasi untuk request
     */
    public function rules(): array
    {
        return [
            'search' => 'nullable|string|max:255',
            'per_page' => 'nullable|integer|min:1|max:100',
            'page' => 'nullable|integer|min:1',
        ];
    }

    /**
     * Pesan error kustom untuk validasi
     */
    public function messages(): array
    {
        return [
            'search.max' => 'Kata kunci pencarian tidak boleh lebih dari 255 karakter',
            'per_page.min' => 'Jumlah data per halaman minimal 1',
            'per_page.max' => 'Jumlah data per halaman maksimal 100',
            'page.min' => 'Nomor halaman minimal 1',
        ];
    }
}
