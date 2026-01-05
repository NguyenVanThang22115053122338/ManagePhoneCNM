<?php

namespace App\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class StockOutResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'stockOutID' => $this->stockOutID,
            'batchID' => $this->batch?->BatchID,
            'quantity' => $this->quantity,
            'note' => $this->note,
            'userID' => $this->user?->UserID,
            'date' => $this->date,
        ];
    }
}
