<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MataKuliah extends Model
{
    use HasFactory;

    protected $table = 'mata_kuliah';
    
    protected $fillable = [
        'nama_matkul'
    ];

    public function kelas()
    {
        return $this->belongsToMany(Kelas::class, 'matkul_kelas', 'id_matkul', 'id_kelas');
    }

    public function kuis()
    {
        return $this->hasMany(Kuis::class, 'id_matkul');
    }
}
