<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProductImage extends Model
{
    use HasFactory;

    protected $table = 'ProductImage';

    protected $fillable = [
        'url',
        'img_index',
        'product_id'
    ];

    protected $hidden = [
        'product'
    ];

    // ===== RELATION =====
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'ProductID');
    }
}
