<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Review extends Model
{
    use HasFactory;

    protected $table = 'review';
    protected $primaryKey = 'ReviewID';
    public $timestamps = false; // vì dùng CreatedAt custom

    protected $fillable = [
        'OrderID',
        'ProductID',
        'UserID',
        'Comment',
        'Video',
        'Photo',
        'Rating',
        'CreatedAt'
    ];

    // ===== RELATIONS =====
    public function order()
    {
        return $this->belongsTo(Order::class, 'OrderID', 'OrderID');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'ProductID', 'ProductID');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'UserID', 'UserID');
    }

    // ===== AUTO CREATED TIME (giống @PrePersist) =====
    protected static function booted()
    {
        static::creating(function ($model) {
            $model->CreatedAt = now();
        });
    }
}
