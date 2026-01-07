<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CartDetail extends Model
{
    use HasFactory;

    protected $table = 'cart_details';

    protected $primaryKey = 'cartDetailsId'; // ← KHỚP DB


    protected $fillable = [
        'CartID',
        'ProductID',
    ];

    // ===== RELATION =====
    public function cart()
    {
        return $this->belongsTo(Cart::class, 'CartID', 'CartID');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'ProductID', 'ProductID');
    }
}
