<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Leaderboard extends Model
{
    use HasFactory;
    
    protected $table = 'leader_board';
    
    protected $fillable = [
        'id_mhs',
        'jumlah_total',
        'waktu',
        'id_kuis',
    ];

    public function mahasiswa(): BelongsTo
    {
        return $this->belongsTo(Mahasiswa::class, 'id_mhs', 'id');
    }
}