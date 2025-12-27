<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Category extends Model
{
    use HasFactory;

    protected $table = 'Category';
    protected $primaryKey = 'categoryId';

    protected $fillable = [
        'categoryName',
        'description'
    ];

    // ===== RELATION =====
    public function products()
    {
        return $this->hasMany(Product::class, 'categoryId', 'categoryId');
    }
}
