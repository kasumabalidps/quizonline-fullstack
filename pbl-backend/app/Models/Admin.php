<?php

namespace App\Models;

use Illuminate\Container\Attributes\Auth;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Admin extends Authenticatable
{
    protected $table = 'admin';
    
    protected $fillable = [
        'nama',
        'email',
        'password'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];
}
