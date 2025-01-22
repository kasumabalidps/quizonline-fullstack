<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Kelas extends Model
{
    use HasFactory;

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

    public function matakuliah(): BelongsToMany
    {
        return $this->belongsToMany(MataKuliah::class, 'matkul_kelas', 'id_kelas', 'id_matkul')
                    ->withTimestamps();
    }
}
