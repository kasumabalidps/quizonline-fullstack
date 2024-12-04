<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
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

    /**
     * Get the login username to be used by the controller.
     */
    public function username()
    {
        return 'nidn';
    }
}
