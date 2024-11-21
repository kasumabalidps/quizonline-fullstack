<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Dosen extends Authenticatable
{
    protected $table = 'dosen';
    
    protected $fillable = [
        'nidn',
        'nama',
        'email',
        'password',
        'id_jurusan'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function jurusan(): BelongsTo
    {
        return $this->belongsTo(Jurusan::class, 'id_jurusan');
    }
}
