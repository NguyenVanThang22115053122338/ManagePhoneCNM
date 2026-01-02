<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReceiveNotification extends Model
{
    protected $table = 'receivenotification';
    public $timestamps = false;
    public $incrementing = false;

    protected $fillable = [
        'NotificationID',
        'UserID',
        'isRead'
    ];

    public function notification()
    {
        return $this->belongsTo(Notification::class, 'NotificationID', 'NotificationID');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'UserID', 'UserID');
    }
}
