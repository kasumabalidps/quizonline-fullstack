<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class KuisDataEditRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'judul' => 'required|string|max:255',
            'id_kelas' => 'required|exists:kelas,id',
            'id_matkul' => 'required|exists:mata_kuliah,id',
            'waktu_mulai' => 'required|date',
            'waktu_selesai' => 'required|date|after:waktu_mulai',
            'soal' => 'required|array|min:1',
            'soal.*.soal' => 'required|string',
            'soal.*.a' => 'required|string',
            'soal.*.b' => 'required|string',
            'soal.*.c' => 'required|string',
            'soal.*.d' => 'required|string',
            'soal.*.jawaban' => 'required|in:a,b,c,d',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'judul.required' => 'Judul kuis harus diisi',
            'id_kelas.required' => 'Kelas harus dipilih',
            'id_matkul.required' => 'Mata kuliah harus dipilih',
            'waktu_mulai.required' => 'Waktu mulai harus diisi',
            'waktu_selesai.required' => 'Waktu selesai harus diisi',
            'waktu_selesai.after' => 'Waktu selesai harus setelah waktu mulai',
            'soal.required' => 'Minimal satu soal harus diisi',
            'soal.*.soal.required' => 'Soal harus diisi',
            'soal.*.a.required' => 'Opsi A harus diisi',
            'soal.*.b.required' => 'Opsi B harus diisi',
            'soal.*.c.required' => 'Opsi C harus diisi',
            'soal.*.d.required' => 'Opsi D harus diisi',
            'soal.*.jawaban.required' => 'Jawaban harus dipilih',
            'soal.*.jawaban.in' => 'Jawaban harus salah satu dari: A, B, C, atau D',
        ];
    }
}
