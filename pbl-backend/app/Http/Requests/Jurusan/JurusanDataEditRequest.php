<?php

namespace App\Http\Requests\Jurusan;

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
        $id = $this->route('id');

        return [
            'code_jurusan' => [
                'required',
                'string',
                Rule::unique('jurusan', 'code_jurusan')->ignore($id),
            ],
            'nama_jurusan' => 'required|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'code_jurusan.required' => 'Kode jurusan wajib diisi',
            'code_jurusan.unique' => 'Kode jurusan sudah terdaftar',
            'nama_jurusan.required' => 'Nama jurusan wajib diisi',
            'nama_jurusan.max' => 'Nama jurusan maksimal 255 karakter',
        ];
    }
}
