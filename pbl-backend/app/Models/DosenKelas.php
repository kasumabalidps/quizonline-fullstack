<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DosenKelas extends Model
{
    use HasFactory;

    protected $table = 'dosen_kelas';
    
    protected $fillable = [
        'id_dosen',
        'id_kelas'
    ];

    public function dosen()
    {
        return $this->belongsTo(Dosen::class, 'id_dosen');
    }

    public function kelas()
    {
        return $this->belongsTo(Kelas::class, 'id_kelas');
    }
}
