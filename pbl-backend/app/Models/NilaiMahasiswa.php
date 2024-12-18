<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Model untuk nilai mahasiswa
 */
class NilaiMahasiswa extends Model
{
    use HasFactory;

    /**
     * Nama tabel yang digunakan oleh model
     *
     * @var string
     */
    protected $table = 'nilai_mhs';

    /**
     * Atribut yang dapat diisi
     *
     * @var array<string>
     */
    protected $fillable = [
        'id_mhs',
        'nilai_total',
        'id_kuis',
    ];

    /**
     * Atribut yang harus dikonversi
     *
     * @var array<string, string>
     */
    protected $casts = [
        'nilai_total' => 'float',
    ];

    /**
     * Relasi ke model Mahasiswa
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function mahasiswa(): BelongsTo
    {
        return $this->belongsTo(Mahasiswa::class, 'id_mhs');
    }

    /**
     * Relasi ke model Kuis
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function kuis(): BelongsTo
    {
        return $this->belongsTo(Kuis::class, 'id_kuis');
    }
}