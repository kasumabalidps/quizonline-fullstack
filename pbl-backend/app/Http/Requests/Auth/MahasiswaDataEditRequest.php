<?php

namespace App\Http\Requests\Auth;

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
        $mahasiswaId = $this->route('mahasiswa');
        $rules = [
            'nim' => [
                'required',
                'string',
                'max:20',
                Rule::unique('mahasiswa', 'nim')->ignore($mahasiswaId)
            ],
            'nama' => ['required', 'string', 'max:100'],
            'email' => [
                'required',
                'email',
                Rule::unique('mahasiswa', 'email')->ignore($mahasiswaId)
            ],
            'id_kelas' => ['required', 'exists:kelas,id'],
        ];

        // Only require password for new mahasiswa
        if (!$mahasiswaId) {
            $rules['password'] = ['required', 'string', 'min:8'];
        } else {
            $rules['password'] = ['nullable', 'string', 'min:8'];
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'nim.required' => 'NIM wajib diisi',
            'nim.string' => 'NIM harus berupa teks',
            'nim.max' => 'NIM maksimal 20 karakter',
            'nim.unique' => 'NIM sudah digunakan',
            'nama.required' => 'Nama mahasiswa wajib diisi',
            'nama.string' => 'Nama mahasiswa harus berupa teks',
            'nama.max' => 'Nama mahasiswa maksimal 100 karakter',
            'email.required' => 'Email wajib diisi',
            'email.email' => 'Format email tidak valid',
            'email.unique' => 'Email sudah digunakan',
            'id_kelas.required' => 'Kelas wajib diisi',
            'id_kelas.exists' => 'Kelas tidak ditemukan',
            'password.required' => 'Password wajib diisi',
            'password.string' => 'Password harus berupa teks',
            'password.min' => 'Password minimal 8 karakter',
        ];
    }
}
