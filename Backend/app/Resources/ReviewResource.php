<?php

namespace App\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'ReviewID' => $this->ReviewID,
            'OrderID' => $this->OrderID,
            'ProductID' => $this->ProductID,
            'UserID' => $this->UserID,
            'Comment' => $this->Comment,
            'Video' => $this->Video,
            'Photo' => $this->Photo,
            'Rating' => $this->Rating,
        ];
    }
}
