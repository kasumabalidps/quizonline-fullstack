<?php

namespace App\Http\Requests\Kelas;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Log;

class KelasDataEditRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $kelas = $this->route('kelas');
        $kelasId = $kelas ? $kelas->id : null;

        Log::info('KelasDataEditRequest Rules:', [
            'method' => $this->method(),
            'kelas_id' => $kelasId,
            'request_data' => $this->all()
        ]);

        $rules = [
            'code_kelas' => [
                'required',
                'string',
                Rule::unique('kelas', 'code_kelas')->ignore($kelasId),
            ],
            'nama_kelas' => 'required|string|max:255',
            'id_prodi' => 'required|exists:prodi,id',
        ];

        Log::info('Validation Rules:', $rules);
        return $rules;
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

    protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator)
    {
        Log::error('Validation Failed:', [
            'errors' => $validator->errors()->all(),
            'request_data' => $this->all()
        ]);
        
        parent::failedValidation($validator);
    }
}
