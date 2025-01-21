<?php

namespace App\Http\Requests\Kuis;

use Illuminate\Foundation\Http\FormRequest;

class KuisDataEditRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $isUpdate = $this->isMethod('PUT');

        $rules = [
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'id_matkul' => 'required|exists:mata_kuliah,id',
            'id_kelas' => 'required|exists:kelas,id',
            'waktu_mulai' => 'required|date',
            'waktu_selesai' => 'required|date|after:waktu_mulai',
            'soal' => 'required|array|min:1',
        ];

        // Aturan untuk soal
        if ($isUpdate) {
            $rules['deleted_soal_ids'] = 'nullable|array';
            $rules['deleted_soal_ids.*'] = 'exists:soal,id';
            $rules['soal.*.id'] = 'nullable|exists:soal,id';
        }

        // Aturan untuk setiap soal
        $rules['soal.*.soal'] = 'required|string';
        $rules['soal.*.a'] = 'required|string';
        $rules['soal.*.b'] = 'required|string';
        $rules['soal.*.c'] = 'required|string';
        $rules['soal.*.d'] = 'required|string';
        $rules['soal.*.jawaban'] = 'required|in:a,b,c,d';

        return $rules;
    }

    public function messages(): array
    {
        return [
            'judul.required' => 'Judul kuis wajib diisi',
            'judul.max' => 'Judul kuis maksimal 255 karakter',
            'id_matkul.required' => 'Mata kuliah wajib diisi',
            'id_matkul.exists' => 'Mata kuliah tidak ditemukan',
            'id_kelas.required' => 'Kelas wajib diisi',
            'id_kelas.exists' => 'Kelas tidak ditemukan',
            'waktu_mulai.required' => 'Waktu mulai wajib diisi',
            'waktu_mulai.date' => 'Format waktu mulai tidak valid',
            'waktu_selesai.required' => 'Waktu selesai wajib diisi',
            'waktu_selesai.date' => 'Format waktu selesai tidak valid',
            'waktu_selesai.after' => 'Waktu selesai harus setelah waktu mulai',
            'soal.required' => 'Soal wajib diisi',
            'soal.array' => 'Format soal tidak valid',
            'soal.min' => 'Minimal 1 soal',
            'deleted_soal_ids.array' => 'Format ID soal yang dihapus tidak valid',
            'deleted_soal_ids.*.exists' => 'ID soal yang dihapus tidak valid',
            'soal.*.id.exists' => 'ID soal tidak valid',
            'soal.*.soal.required' => 'Pertanyaan wajib diisi',
            'soal.*.a.required' => 'Pilihan A wajib diisi',
            'soal.*.b.required' => 'Pilihan B wajib diisi',
            'soal.*.c.required' => 'Pilihan C wajib diisi',
            'soal.*.d.required' => 'Pilihan D wajib diisi',
            'soal.*.jawaban.required' => 'Jawaban wajib diisi',
            'soal.*.jawaban.in' => 'Jawaban harus a, b, c, atau d',
        ];
    }
}
