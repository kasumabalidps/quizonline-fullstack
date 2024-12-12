<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MatkulKelas extends Model
{
    use HasFactory;

    protected $table = 'matkul_kelas';
    
    protected $fillable = [
        'id_matkul',
        'id_kelas'
    ];

    public function matkul()
    {
        return $this->belongsTo(MataKuliah::class, 'id_matkul');
    }

    public function kelas()
    {
        return $this->belongsTo(Kelas::class, 'id_kelas');
    }
}
