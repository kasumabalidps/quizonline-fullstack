<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kuis extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'kuis';
    
    protected $fillable = [
        'judul',
        'id_dosen',
        'id_kelas',
        'id_matkul',
        'waktu_mulai',
        'waktu_selesai'
    ];

    protected $with = ['soal'];

    public function dosen(): BelongsTo
    {
        return $this->belongsTo(Dosen::class, 'id_dosen');
    }

    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class, 'id_kelas');
    }

    public function matkul(): BelongsTo
    {
        return $this->belongsTo(MataKuliah::class, 'id_matkul', 'id');
    }

    public function soalKuis(): HasMany
    {
        return $this->hasMany(SoalKuis::class, 'id_kuis');
    }

    public function soal(): BelongsToMany
    {
        return $this->belongsToMany(Soal::class, 'soal_kuis', 'id_kuis', 'id_soal');
    }

    public function jawabanMhs(): HasMany
    {
        return $this->hasMany(JawabanMhs::class, 'id_kuis');
    }
}
