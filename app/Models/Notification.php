<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Notification extends Model
{
    use HasFactory;

    protected $table = 'notification';
    protected $primaryKey = 'NotificationID';

    protected $fillable = [
        'Title',
        'NotificationType',
        'Content'
    ];

    // ===== RELATION =====
    public function users()
    {
        return $this->belongsToMany(
            User::class,
            'receivenotification',
            'NotificationID',
            'UserID'
        )->withPivot('isRead');
    }

}