<?php

namespace App\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'ProductID' => $this->ProductID,
            'name' => $this->name,
            'price' => $this->price,
            'Stock_Quantity' => $this->Stock_Quantity,
            'description' => $this->description,
            'BrandID' => $this->BrandID,
            'CategoryID' => $this->CategoryID,

            'specification' => new SpecificationResource(
                $this->whenLoaded('specification')
            ),

            'productImages' => ProductImageResource::collection(
                $this->whenLoaded('images')
            )
        ];
    }
}
