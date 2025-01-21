<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Soal extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'soal';
    protected $fillable = [
        'soal',
        'a',
        'b',
        'c',
        'd',
        'jawaban'
    ];

    public function kuis()
    {
        return $this->belongsToMany(Kuis::class, 'soal_kuis', 'id_soal', 'id_kuis');
    }

    public function soalKuis()
    {
        return $this->hasMany(SoalKuis::class, 'id_soal');
    }

    public function jawabanMhs()
    {
        return $this->hasMany(JawabanMhs::class, 'id_soal');
    }
}
