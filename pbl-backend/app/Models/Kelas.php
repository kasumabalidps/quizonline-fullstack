<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Kelas extends Model
{
    protected $table = 'kelas';
    
    protected $fillable = [
        'code_kelas',
        'nama_kelas',
        'id_prodi'
    ];

    public function prodi(): BelongsTo
    {
        return $this->belongsTo(Prodi::class, 'id_prodi');
    }

    public function mahasiswa(): HasMany
    {
        return $this->hasMany(Mahasiswa::class, 'id_kelas');
    }

    public function mataKuliah(): BelongsToMany
    {
        return $this->belongsToMany(MataKuliah::class, 'matkul_kelas', 'id_kelas', 'id_matkul');
    }

    public function dosen(): BelongsToMany
    {
        return $this->belongsToMany(Dosen::class, 'dosen_kelas', 'id_kelas', 'id_dosen');
    }
}
