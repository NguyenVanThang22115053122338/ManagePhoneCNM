<?php

namespace App\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DiscountResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->DiscountID,
            'code' => $this->Code,
            'type' => $this->Type,
            'value' => (float) $this->Value,

            'maxDiscountAmount' => $this->MaxDiscountAmount,
            'minOrderValue' => $this->MinOrderValue,

            'usageLimit' => $this->UsageLimit,
            'usedCount' => $this->UsedCount,

            'startDate' => $this->StartDate,
            'endDate' => $this->EndDate,

            'active' => (bool) $this->IsActive,

            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }
}
