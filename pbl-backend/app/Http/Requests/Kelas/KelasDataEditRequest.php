<?php

namespace App\Http\Requests\Kelas;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class KelasDataEditRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('id');

        return [
            'code_kelas' => [
                'required',
                'string',
                Rule::unique('kelas', 'code_kelas')->ignore($id),
            ],
            'nama_kelas' => 'required|string|max:255',
            'id_prodi' => 'required|exists:prodi,id',
        ];
    }

    public function messages(): array
    {
        return [
            'code_kelas.required' => 'Kode kelas wajib diisi',
            'code_kelas.unique' => 'Kode kelas sudah terdaftar',
            'nama_kelas.required' => 'Nama kelas wajib diisi',
            'nama_kelas.max' => 'Nama kelas maksimal 255 karakter',
            'id_prodi.required' => 'Program studi wajib diisi',
            'id_prodi.exists' => 'Program studi tidak ditemukan',
        ];
    }
}
