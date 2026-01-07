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
            'quantity' => $this->quantity,
            'note' => $this->note,
            'userId' => $this->user?->UserID,
            'date' => $this->date,
        ];
    }
}
