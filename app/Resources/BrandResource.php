<?php

namespace App\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BrandResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'brandId'     => $this->brandId,
            'name'        => $this->name,
            'country'     => $this->country,
            'description' => $this->description,
        ];
    }
}
