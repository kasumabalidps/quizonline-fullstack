<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Jurusan extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'jurusan';

    protected $fillable = [
        'code_jurusan',
        'nama_jurusan',
    ];
}
