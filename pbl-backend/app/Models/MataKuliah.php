<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MataKuliah extends Model
{
    use HasFactory;

    protected $table = 'mata_kuliah';
    
    protected $fillable = [
        'nama_matkul'
    ];

    public function kelas(): BelongsToMany
    {
        return $this->belongsToMany(Kelas::class, 'matkul_kelas', 'id_matkul', 'id_kelas');
    }

    public function kuis(): HasMany
    {
        return $this->hasMany(Kuis::class, 'id_matkul');
    }
}
