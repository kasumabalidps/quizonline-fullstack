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
    protected $table = 'nilai_mhs';

    protected $fillable = [
        'id_mhs',
        'nilai_total',
        'id_kuis',
    ];

    protected $casts = [
        'nilai_total' => 'float',
    ];

    public function mahasiswa(): BelongsTo
    {
        return $this->belongsTo(Mahasiswa::class, 'id_mhs');
    }

    public function kuis(): BelongsTo
    {
        return $this->belongsTo(Kuis::class, 'id_kuis');
    }
}