<?php

namespace App\Http\Requests\Kuis;

use Illuminate\Foundation\Http\FormRequest;

class GetKuisRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id_kelas' => 'sometimes|integer|exists:kelas,id',
        ];
    }

    public function messages(): array
    {
        return [
            'id_kelas.integer' => 'ID kelas harus berupa angka',
            'id_kelas.exists' => 'Kelas tidak ditemukan',
        ];
    }
}
