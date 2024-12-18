<?php

namespace App\Http\Requests\Mahasiswa;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MahasiswaDataEditRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $mahasiswa = $this->route('mahasiswa');
        $id = $mahasiswa ? $mahasiswa->id : null;

        return [
            'nim' => [
                'required',
                'string',
                Rule::unique('mahasiswa', 'nim')->ignore($id),
            ],
            'nama' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                Rule::unique('mahasiswa', 'email')->ignore($id),
            ],
            'password' => 'nullable|string|min:8',
            'id_kelas' => 'required|exists:kelas,id',
        ];
    }

    public function messages(): array
    {
        return [
            'nim.required' => 'NIM wajib diisi',
            'nim.unique' => 'NIM sudah terdaftar',
            'nama.required' => 'Nama wajib diisi',
            'nama.max' => 'Nama maksimal 255 karakter',
            'email.required' => 'Email wajib diisi',
            'email.email' => 'Format email tidak valid',
            'email.unique' => 'Email sudah terdaftar',
            'password.min' => 'Password minimal 8 karakter',
            'id_kelas.required' => 'Kelas wajib diisi',
            'id_kelas.exists' => 'Kelas tidak ditemukan',
        ];
    }
}
