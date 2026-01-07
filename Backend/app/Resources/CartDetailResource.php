<?php

namespace App\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CartDetailResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'cartDetailsId' => $this->cartDetailsId,
            'cartId'        => $this->CartID,
            'product'       => new ProductResource($this->product),
        ];
    }
}
