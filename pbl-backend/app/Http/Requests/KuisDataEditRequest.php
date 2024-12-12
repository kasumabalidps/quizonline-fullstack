<?php

namespace App\Http\Requests;

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
            'id_dosen' => 'required|exists:dosen,id',
            'id_kelas' => 'required|exists:kelas,id',
            'id_matkul' => 'required|exists:mata_kuliah,id',
            'waktu_mulai' => 'required|date',
            'waktu_selesai' => 'required|date|after:waktu_mulai',
            'soal_ids' => 'required|array',
            'soal_ids.*' => 'exists:soal,id'
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
            'id_dosen.required' => 'Dosen harus dipilih',
            'id_kelas.required' => 'Kelas harus dipilih',
            'id_matkul.required' => 'Mata kuliah harus dipilih',
            'waktu_mulai.required' => 'Waktu mulai harus diisi',
            'waktu_selesai.required' => 'Waktu selesai harus diisi',
            'waktu_selesai.after' => 'Waktu selesai harus setelah waktu mulai',
            'soal_ids.required' => 'Minimal satu soal harus dipilih',
        ];
    }
}
