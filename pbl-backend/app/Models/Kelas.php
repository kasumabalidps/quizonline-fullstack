<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
}
