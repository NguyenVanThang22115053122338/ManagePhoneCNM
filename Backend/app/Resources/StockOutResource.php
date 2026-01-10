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
            'name' => $this->batch?->Product?->name,
            'quantity' => $this->quantity,
            'note' => $this->note,
            'userName' => $this->user?->FullName,
            'date' => $this->date,
        ];
    }
}
