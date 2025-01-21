<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class JawabanMhs extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'jawaban_mhs';
    protected $fillable = [
        'id_mhs',
        'id_kuis',
        'id_soal',
        'jawaban',
        'nilai'
    ];

    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class, 'id_mhs');
    }

    public function kuis()
    {
        return $this->belongsTo(Kuis::class, 'id_kuis');
    }

    public function soal()
    {
        return $this->belongsTo(Soal::class, 'id_soal');
    }
}
