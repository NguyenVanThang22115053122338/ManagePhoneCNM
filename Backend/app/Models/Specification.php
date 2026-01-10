<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Specification extends Model
{
    use HasFactory;

    protected $table = 'Specification';
    protected $primaryKey = 'specId';

    protected $fillable = [
        'screen',
        'cpu',
        'ram',
        'storage',
        'camera',
        'battery',
        'os'
    ];

    public function product()
    {
        return $this->hasOne(Product::class, 'SpecID', 'specId');
    }
}
