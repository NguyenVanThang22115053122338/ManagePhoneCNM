<?php

namespace App\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DoanhThuDonHangResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'data' => MonthlyRevenueResource::collection($this['data']),
            'tongDoanhThu' => (double) $this['tongDoanhThu'],
            'tongDonHang'  => (int) $this['tongDonHang'],
            'years'        => $this['years'],
        ];
    }
}
