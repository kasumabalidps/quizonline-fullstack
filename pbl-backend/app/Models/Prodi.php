<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Prodi extends Model
{
    protected $table = 'prodi';
    
    protected $fillable = [
        'code_prodi',
        'nama_prodi',
        'id_jurusan'
    ];

    public function jurusan(): BelongsTo
    {
        return $this->belongsTo(Jurusan::class, 'id_jurusan');
    }

    public function kelas(): HasMany
    {
        return $this->hasMany(Kelas::class, 'id_prodi');
    }
}
