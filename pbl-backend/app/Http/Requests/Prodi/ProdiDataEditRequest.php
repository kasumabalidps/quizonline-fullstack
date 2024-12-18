<?php

namespace App\Http\Requests\Prodi;

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
        $id = $this->route('id');

        return [
            'code_prodi' => [
                'required',
                'string',
                Rule::unique('prodi', 'code_prodi')->ignore($id),
            ],
            'nama_prodi' => 'required|string|max:255',
            'id_jurusan' => 'required|exists:jurusan,id',
        ];
    }

    public function messages(): array
    {
        return [
            'code_prodi.required' => 'Kode prodi wajib diisi',
            'code_prodi.unique' => 'Kode prodi sudah terdaftar',
            'nama_prodi.required' => 'Nama prodi wajib diisi',
            'nama_prodi.max' => 'Nama prodi maksimal 255 karakter',
            'id_jurusan.required' => 'Jurusan wajib diisi',
            'id_jurusan.exists' => 'Jurusan tidak ditemukan',
        ];
    }
}
