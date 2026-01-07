<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Batch extends Model
{
    use HasFactory;

    protected $table = 'batch';
    protected $primaryKey = 'BatchID';

    protected $fillable = [
        'ProductID',
        'ProductionDate',
        'Quantity',
        'PriceIn',
        'Expiry'
    ];

    // ===== RELATION =====
    public function product()
    {
        return $this->belongsTo(Product::class, 'ProductID', 'ProductID');
    }

    public function stockIns()
    {
        return $this->hasMany(StockIn::class, 'BatchID', 'BatchID');
    }    

}
