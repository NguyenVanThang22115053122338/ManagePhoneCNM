<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
    use HasFactory;

    protected $table = 'user';
    protected $primaryKey = 'UserID';

    protected $fillable = [
        'SDT',
        'FullName',
        'Email',
        'Address',
        'Avatar',
        'Password',
        'googleId',
        'RoleID',
        'is_verified',
        'code',
        'code_expires_at',
    ];

    protected $hidden = [
        'Password',
    ];
    protected $casts = [
        'email_verified_at' => 'datetime',
        'code_expires_at' => 'datetime',
    ];
    // ===== RELATION =====
    public function role()
    {
        return $this->belongsTo(Role::class, 'RoleID', 'RoleID');
    }

    public function cart()
    {
        return $this->hasOne(Cart::class, 'UserID', 'UserID');
    }

    public function orders()
    {
            return $this->hasMany(Order::class, 'UserID', 'UserID');
    }

    public function notifications()
    {
        return $this->belongsToMany(
            Notification::class,
            'receivenotification',
            'UserID',
            'NotificationID'
            )->withPivot('isRead');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'UserID', 'UserID');
    }

    public function stockIns()
    {
        return $this->hasMany(StockIn::class, 'UserID', 'UserID');
    }

}
