<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cart extends Model
{
    use HasFactory;

    protected $table = 'carts';
    protected $primaryKey = 'CartID';

    protected $fillable = [
        'status',
        'UserID'
    ];

    protected $hidden = [
        'user'
    ];

    // ===== RELATION =====
    public function user()
    {
        return $this->belongsTo(User::class, 'UserID', 'id');
    }

    public function cartDetails()
    {
        return $this->hasMany(CartDetail::class, 'CartID', 'CartID');
    }
}
