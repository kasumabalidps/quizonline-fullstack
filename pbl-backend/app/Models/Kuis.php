<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Kuis extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'kuis';
    protected $fillable = [
        'judul',
        'id_dosen',
        'id_kelas',
        'id_matkul',
        'waktu_mulai',
        'waktu_selesai'
    ];

    public function dosen()
    {
        return $this->belongsTo(Dosen::class, 'id_dosen');
    }

    public function kelas()
    {
        return $this->belongsTo(Kelas::class, 'id_kelas');
    }

    public function mataKuliah()
    {
        return $this->belongsTo(MataKuliah::class, 'id_matkul');
    }

    public function soalKuis()
    {
        return $this->hasMany(SoalKuis::class, 'id_kuis');
    }

    public function jawabanMhs()
    {
        return $this->hasMany(JawabanMhs::class, 'id_kuis');
    }
}
