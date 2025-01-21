<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SoalKuis extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'soal_kuis';
    protected $fillable = [
        'id_kuis',
        'id_soal'
    ];

    public function kuis()
    {
        return $this->belongsTo(Kuis::class, 'id_kuis');
    }

    public function soal()
    {
        return $this->belongsTo(Soal::class, 'id_soal');
    }
}
