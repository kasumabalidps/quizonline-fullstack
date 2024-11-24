<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Jurusan extends Model
{
    protected $table = 'jurusan';
    
    protected $fillable = [
        'code_jurusan',
        'nama_jurusan'
    ];

    public function prodi(): HasMany
    {
        return $this->hasMany(Prodi::class, 'id_jurusan');
    }

    public function dosen(): HasMany
    {
        return $this->hasMany(Dosen::class, 'id_jurusan');
    }
}
