<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProdiDataEditRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $prodiId = $this->route('prodi');

        return [
            'code_prodi' => [
                'required',
                'string',
                'max:10',
                Rule::unique('prodi', 'code_prodi')->ignore($prodiId)
            ],
            'nama_prodi' => ['required', 'string', 'max:100'],
            'id_jurusan' => ['required', 'exists:jurusan,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'code_prodi.required' => 'Kode prodi wajib diisi',
            'code_prodi.string' => 'Kode prodi harus berupa teks',
            'code_prodi.max' => 'Kode prodi maksimal 10 karakter',
            'code_prodi.unique' => 'Kode prodi sudah digunakan',
            'nama_prodi.required' => 'Nama prodi wajib diisi',
            'nama_prodi.string' => 'Nama prodi harus berupa teks',
            'nama_prodi.max' => 'Nama prodi maksimal 100 karakter',
            'id_jurusan.required' => 'Jurusan wajib diisi',
            'id_jurusan.exists' => 'Jurusan tidak ditemukan',
        ];
    }
}
