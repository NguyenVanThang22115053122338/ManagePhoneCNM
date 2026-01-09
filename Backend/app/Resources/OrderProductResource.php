<?php

namespace App\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderProductResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'productID' => $this->product->ProductID,
            'name' => $this->product->name,
            'price' => $this->product->price,
            'quantity' => $this->Quantity,
            'imageUrl' => $this->product->images->first()?->image_url ?? null,
        ];
    }
}
