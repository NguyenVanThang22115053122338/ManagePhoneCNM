<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasFactory;

    protected $table = 'order';
    protected $primaryKey = 'OrderID';

    protected $fillable = [
        'Order_Date',
        'Status',
        'PaymentStatus',
        'UserID'
    ];

    // ===== RELATION =====
    public function user()
    {
        return $this->belongsTo(User::class, 'UserID', 'UserID');
    }

    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class, 'OrderID', 'OrderID');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'OrderID', 'OrderID');
    }
}
