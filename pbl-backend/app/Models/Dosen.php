<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Dosen extends Authenticatable
{
    use HasApiTokens, Notifiable;

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

    public function kelas(): BelongsToMany
    {
        return $this->belongsToMany(Kelas::class, 'dosen_kelas', 'id_dosen', 'id_kelas');
    }

    public function kuis(): HasMany
    {
        return $this->hasMany(Kuis::class, 'id_dosen');
    }

    public function matkul(): BelongsToMany
    {
        return $this->belongsToMany(Matkul::class, 'dosen_matkul', 'id_dosen', 'id_matkul');
    }

    /**
     * Get the login username to be used by the controller.
     */
    public function username()
    {
        return 'nidn';
    }
}
