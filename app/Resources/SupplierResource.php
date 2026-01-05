<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SupplierResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'supplierId' => $this->supplierId,
            'supplierName' =>$this->supplierName
        ];
    }
}