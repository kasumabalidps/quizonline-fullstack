<?php

namespace App\Http\Requests\Auth;

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
        if ($this->isMethod('POST')) {
            return [
                'code_kelas' => [
                    'required',
                    'string',
                    'max:10',
                    Rule::unique('kelas', 'code_kelas')
                ],
                'nama_kelas' => 'required|string|max:50',
                'id_prodi' => 'required|exists:prodi,id'
            ];
        }

        return [
            'code_kelas' => [
                'required',
                'string',
                'max:10',
                Rule::unique('kelas', 'code_kelas')->ignore($this->route('kelas'))
            ],
            'nama_kelas' => 'required|string|max:50',
            'id_prodi' => 'required|exists:prodi,id'
        ];
    }

    public function messages(): array
    {
        return [
            'code_kelas.required' => 'Kode kelas harus diisi',
            'code_kelas.string' => 'Kode kelas harus berupa teks',
            'code_kelas.max' => 'Kode kelas maksimal 10 karakter',
            'code_kelas.unique' => 'Kode kelas sudah digunakan',
            'nama_kelas.required' => 'Nama kelas harus diisi',
            'nama_kelas.string' => 'Nama kelas harus berupa teks',
            'nama_kelas.max' => 'Nama kelas maksimal 50 karakter',
            'id_prodi.required' => 'Program studi harus dipilih',
            'id_prodi.exists' => 'Program studi tidak valid'
        ];
    }
}
