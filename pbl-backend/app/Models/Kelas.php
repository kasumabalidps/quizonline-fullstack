<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Kelas extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'kelas';

    protected $fillable = [
        'code_kelas',
        'nama_kelas',
        'id_prodi',
    ];
}
