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
            'FullName' => $this->user?->FullName 
                ?? 'Người dùng',
            'Avatar' => $this->user?->Avatar,
            'Comment' => $this->Comment,
            'Video' => $this->Video,
            'Photo' => $this->Photo,
            'Rating' => $this->Rating,
            'CreatedAt' => $this->created_at?->format('Y-m-d H:i:s') 
                ?? $this->CreatedAt,
        ];
    }
}