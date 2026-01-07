<?php

namespace App\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'categoryId'   => $this->categoryId,
            'categoryName' => $this->categoryName,
            'description'  => $this->description,
        ];
    }
}
