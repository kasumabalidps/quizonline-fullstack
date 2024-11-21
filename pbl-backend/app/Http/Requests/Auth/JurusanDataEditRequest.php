<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class JurusanDataEditRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $jurusanId = $this->route('jurusan');

        return [
            'code_jurusan' => [
                'required',
                'string',
                'max:10',
                Rule::unique('jurusan', 'code_jurusan')->ignore($jurusanId)
            ],
            'nama_jurusan' => ['required', 'string', 'max:100'],
        ];
    }

    public function messages(): array
    {
        return [
            'code_jurusan.required' => 'Kode jurusan wajib diisi',
            'code_jurusan.string' => 'Kode jurusan harus berupa teks',
            'code_jurusan.max' => 'Kode jurusan maksimal 10 karakter',
            'code_jurusan.unique' => 'Kode jurusan sudah digunakan',
            'nama_jurusan.required' => 'Nama jurusan wajib diisi',
            'nama_jurusan.string' => 'Nama jurusan harus berupa teks',
            'nama_jurusan.max' => 'Nama jurusan maksimal 100 karakter',
        ];
    }
}
