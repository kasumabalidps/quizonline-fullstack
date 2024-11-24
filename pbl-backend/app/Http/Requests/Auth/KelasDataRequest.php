<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class KelasDataRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        if ($this->isMethod('POST')) {
            return [
                'code_kelas' => 'required|string|unique:kelas,code_kelas',
                'nama_kelas' => 'required|string',
                'id_prodi' => 'required|exists:prodi,id'
            ];
        }

        return [
            'code_kelas' => 'required|string|unique:kelas,code_kelas,' . $this->route('kelas'),
            'nama_kelas' => 'required|string',
            'id_prodi' => 'required|exists:prodi,id'
        ];
    }

    public function messages(): array
    {
        return [
            'code_kelas.required' => 'Kode kelas harus diisi',
            'code_kelas.unique' => 'Kode kelas sudah digunakan',
            'nama_kelas.required' => 'Nama kelas harus diisi',
            'id_prodi.required' => 'Program studi harus dipilih',
            'id_prodi.exists' => 'Program studi tidak valid'
        ];
    }
}