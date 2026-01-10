<?php

namespace App\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class StockInResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'stockInID' => $this->stockInID,
            'batchID' => $this->batch?->BatchID,
            'name' => $this->batch?->Product?->name,
            'quantity' => $this->quantity,
            'note' => $this->note,
            'userName' => $this->user?->FullName,
            'date' => $this->date,
        ];
    }
}
