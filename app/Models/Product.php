<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;

    protected $table = 'Product';
    protected $primaryKey = 'ProductID';
    public $timestamps = false;

    protected $fillable = [
        'name',
        'price',
        'Stock_Quantity',
        'description',
        'BrandID',
        'CategoryID',
        'SpecID',
        'Created_At',
        'Updated_At'
    ];

    // ===== RELATION =====

    public function images()
    {
        return $this->hasMany(ProductImage::class, 'product_id', 'ProductID');
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class, 'BrandID', 'brandId');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'CategoryID', 'categoryId');
    }

    public function specification()
    {
        return $this->belongsTo(Specification::class, 'SpecID', 'specId');
    }

    public function batches()
    {
        return $this->hasMany(Batch::class, 'ProductID', 'ProductID');
    }

    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class, 'ProductID', 'ProductID');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'ProductID', 'ProductID');
    }

    public function cartDetails()
    {
        return $this->hasMany(CartDetail::class, 'ProductID', 'ProductID');
    }

    // ===== TIMESTAMP EVENT (giống @PrePersist / @PreUpdate) =====
    protected static function booted()
    {
        static::creating(function ($model) {
            $model->Created_At = now();
            $model->Updated_At = now();
        });

        static::updating(function ($model) {
            $model->Updated_At = now();
        });
    }

}
