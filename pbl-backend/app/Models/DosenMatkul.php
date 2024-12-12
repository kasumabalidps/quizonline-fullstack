<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DosenMatkul extends Model
{
    protected $table = 'dosen_matkul';
    protected $fillable = [
        'dosen_id',
        'matkul_id',
    ];

    public function findDosenMatkul($dosen_id, $matkul_id)
    {
        $dosenMatkul = $this->where('dosen_id', $dosen_id)->where('matkul_id', $matkul_id)->first();
        if ($dosenMatkul) {
            $matkul = $dosenMatkul->matkul;
            return $matkul ? $matkul->nama_matkul : "Nama Matkul Tidak Ditemukan";
        }
        return null;
    }

}