<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DosenDataEditRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $dosenId = $this->route('dosen');
        $rules = [
            'nidn' => [
                'required',
                'string',
                'max:20',
                Rule::unique('dosen', 'nidn')->ignore($dosenId)
            ],
            'nama' => ['required', 'string', 'max:100'],
            'email' => [
                'required',
                'email',
                Rule::unique('dosen', 'email')->ignore($dosenId)
            ],
            'id_jurusan' => ['required', 'exists:jurusan,id']
        ];

        if (!$dosenId) {
            $rules['password'] = ['required', 'string', 'min:8'];
        } else {
            $rules['password'] = ['nullable', 'string', 'min:8'];
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'nidn.required' => 'NIDN wajib diisi',
            'nidn.string' => 'NIDN harus berupa teks',
            'nidn.max' => 'NIDN maksimal 20 karakter',
            'nidn.unique' => 'NIDN sudah digunakan',
            'nama.required' => 'Nama dosen wajib diisi',
            'nama.string' => 'Nama dosen harus berupa teks',
            'nama.max' => 'Nama dosen maksimal 100 karakter',
            'email.required' => 'Email wajib diisi',
            'email.email' => 'Format email tidak valid',
            'email.unique' => 'Email sudah digunakan',
            'id_jurusan.required' => 'Jurusan wajib dipilih',
            'id_jurusan.exists' => 'Jurusan tidak valid',
            'password.required' => 'Password wajib diisi',
            'password.min' => 'Password minimal 8 karakter'
        ];
    }
}
