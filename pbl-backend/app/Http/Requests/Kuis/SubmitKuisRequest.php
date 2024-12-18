<?php

namespace App\Http\Requests\Kuis;

use Illuminate\Foundation\Http\FormRequest;

class SubmitKuisRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'jawaban' => 'required|array',
            'jawaban.*' => 'required|string|in:a,b,c,d',
        ];
    }

    public function messages(): array
    {
        return [
            'jawaban.required' => 'Jawaban harus diisi',
            'jawaban.array' => 'Format jawaban tidak valid',
            'jawaban.*.required' => 'Semua soal harus dijawab',
            'jawaban.*.string' => 'Jawaban harus berupa teks',
            'jawaban.*.in' => 'Pilihan jawaban harus a, b, c, atau d',
        ];
    }

    protected function prepareForValidation()
    {
        if ($this->has('jawaban') && is_array($this->jawaban)) {
            $this->merge([
                'jawaban' => array_map(function ($value) {
                    return strtolower(trim($value));
                }, $this->jawaban)
            ]);
        }
    }
}
