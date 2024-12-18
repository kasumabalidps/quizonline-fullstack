<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    public function mahasiswa(): BelongsToMany
    {
        return $this->belongsToMany(Mahasiswa::class, 'nilai_mhs', 'id_mhs', 'id_mhs');
    }

    public function kuis(): BelongsToMany
    {
        return $this->belongsToMany(Kuis::class, 'nilai_mhs', 'id_kuis', 'id_kuis');
    }
}