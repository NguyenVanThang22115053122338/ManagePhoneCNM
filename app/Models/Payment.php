<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Payment extends Model
{
    use HasFactory;

    protected $table = 'Payment';
    protected $primaryKey = 'id';
    public $incrementing = false;   // UUID
    protected $keyType = 'string';
    public $timestamps = false;     // custom timestamps

    protected $fillable = [
        'id',
        'orderId',
        'paypalOrderId',
        'paypalCaptureId',
        'status',
        'amount',
        'currency',
        'createdAt',
        'updatedAt'
    ];

    // ===== AUTO UUID + TIMESTAMP =====
    protected static function booted()
    {
        static::creating(function ($model) {
            if (!$model->id) {
                $model->id = (string) Str::uuid();
            }
            $model->createdAt = now();
            $model->updatedAt = now();
        });

        static::updating(function ($model) {
            $model->updatedAt = now();
        });
    }

    // ===== RELATION (optional nhưng rất nên có) =====
    public function order()
    {
        return $this->belongsTo(Order::class, 'orderId', 'OrderID');
    }
}
