<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasFactory;

    protected $table = 'order';
    protected $primaryKey = 'OrderID';

    public $timestamps = true;

    protected $fillable = [

        /* ===== BASIC ===== */
        'Order_Date',
        'Status',
        'PaymentStatus',
        'UserID',

        /* ===== DISCOUNT SNAPSHOT ===== */
        'DiscountCode',     // VD: NEWYEAR2026
        'DiscountType',     // PERCENT | FIXED
        'DiscountValue',    // 10 | 50000
        'DiscountAmount',   // số tiền giảm thực tế

        /* ===== PRICE ===== */
        'SubTotal',         // tổng tiền trước giảm
        'TotalAmount'       // tổng tiền sau giảm
    ];

    /* ================= RELATION ================= */

    public function user()
    {
        return $this->belongsTo(User::class, 'UserID', 'UserID');
    }

    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class, 'OrderID', 'OrderID');
    }
}
