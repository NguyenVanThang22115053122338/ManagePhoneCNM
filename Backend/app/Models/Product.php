<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'product';
    protected $primaryKey = 'ProductID';
    public $timestamps = false;

    protected $fillable = [
        'name',
        'price',
        'Stock_Quantity',
        'description',
        'BrandID',
        'CategoryID',
        'SupplierID', // ✅ thêm
        'SpecID',
        'Created_At',
        'Updated_At'
    ];

    protected $dates = ['deleted_at'];

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

    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'SupplierID', 'supplierId');
    }


    // ===== TIMESTAMP EVENT =====
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
