<?php

namespace App\Http\Requests\Dosen;

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
        $id = $this->route('dosen')?->id;

        $rules = [
            'nama' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                Rule::unique('dosen', 'email')->ignore($id),
            ],
            'password' => 'nullable|string|min:8',
            'id_jurusan' => 'required|exists:jurusan,id',
        ];

        if ($this->isMethod('post')) {
            $rules['nip'] = [
                'required',
                'string',
                Rule::unique('dosen', 'nip')->ignore($id),
            ];
        } else {
            $rules['nip'] = [
                'nullable',
                'string',
                Rule::unique('dosen', 'nip')->ignore($id),
            ];
        }

        return $rules;
    }

    protected function prepareForValidation()
    {
        if ($this->isMethod('put') || $this->isMethod('patch')) {
            $dosen = $this->route('dosen');
            if (!$this->has('nip') && $dosen) {
                $this->merge(['nip' => $dosen->nip]);
            }
        }
    }

    public function messages(): array
    {
        return [
            'nip.required' => 'NIP wajib diisi',
            'nip.unique' => 'NIP sudah terdaftar',
            'nama.required' => 'Nama wajib diisi',
            'nama.max' => 'Nama maksimal 255 karakter',
            'email.required' => 'Email wajib diisi',
            'email.email' => 'Format email tidak valid',
            'email.unique' => 'Email sudah terdaftar',
            'password.min' => 'Password minimal 8 karakter',
            'id_jurusan.required' => 'Jurusan wajib diisi',
            'id_jurusan.exists' => 'Jurusan tidak ditemukan',
        ];
    }
}
