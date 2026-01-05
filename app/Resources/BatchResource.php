<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BatchResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'batchID' => $this->BatchID,
            'productID' =>$this->ProductID,
            'productionDate' => $this->ProductionDate,
            'quantity' =>$this->Quantity,
            'priceIn' => $this->PriceIn,
            'expiry' =>$this->Expiry
        ];
    }
}