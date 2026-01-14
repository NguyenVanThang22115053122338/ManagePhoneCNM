<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Discount extends Model
{
    use HasFactory;

    protected $table = 'discounts';
    protected $primaryKey = 'DiscountID';

    public $timestamps = true;

    protected $fillable = [

        /* ===== BASIC ===== */
        'Code',                 // NEWYEAR2026
        'Type',                 // PERCENT | FIXED
        'Value',                // 10 | 50000

        /* ===== LIMIT ===== */
        'MaxDiscountAmount',    // tối đa được giảm
        'MinOrderValue',        // đơn tối thiểu

        /* ===== TIME ===== */
        'StartDate',
        'EndDate',

        /* ===== USAGE ===== */
        'UsageLimit',           // số lượt dùng tối đa
        'UsedCount',            // đã dùng

        /* ===== STATUS ===== */
        'IsActive'
    ];

    /* ================= HELPER ================= */

    public function isValid(): bool
    {
        $now = now();

        if (!$this->IsActive) {
            return false;
        }

        if ($this->StartDate && $now->lt($this->StartDate)) {
            return false;
        }

        if ($this->EndDate && $now->gt($this->EndDate)) {
            return false;
        }

        if ($this->UsageLimit !== null && $this->UsedCount >= $this->UsageLimit) {
            return false;
        }

        return true;
    }
}
