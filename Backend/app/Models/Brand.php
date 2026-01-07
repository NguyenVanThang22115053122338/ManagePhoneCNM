<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Brand extends Model
{
    use HasFactory;

    protected $table = 'brand';
    protected $primaryKey = 'brandId';

    protected $fillable = [
        'name',
        'country',
        'description'
    ];

    // ===== RELATION =====
    public function products()
    {
        return $this->hasMany(Product::class, 'brandId', 'brandId');
    }
}
