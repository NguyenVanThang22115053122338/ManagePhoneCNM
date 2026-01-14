<?php

namespace App\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class MonthlyRevenueResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'thang'     => (int) $this->thang,
            'soLuong'  => (int) $this->soLuong,
            'doanhThu' => (double) $this->doanhThu,
        ];
    }
}
