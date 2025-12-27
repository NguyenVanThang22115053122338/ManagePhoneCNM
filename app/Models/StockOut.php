<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StockOut extends Model
{
    use HasFactory;

    protected $table = 'stockout';
    protected $primaryKey = 'stockOutID';

    protected $fillable = [
        'BatchID',
        'UserID',
        'quantity',
        'note',
        'date'
    ];

    // ===== RELATIONS =====
    public function batch()
    {
        return $this->belongsTo(Batch::class, 'BatchID', 'BatchID');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'UserID', 'UserID');
    }
}
