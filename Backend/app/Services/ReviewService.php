<?php

namespace App\Services;

use App\Models\Review;
use Illuminate\Database\Eloquent\Collection;

class ReviewService
{
    public function getByProduct(int $productId): Collection
    {
        return Review::where('ProductID', $productId)
            ->with(['user', 'product'])
            ->orderBy('CreatedAt', 'desc')
            ->get();
    }

    public function create(array $data): Review
    {
        return Review::create([
            'OrderID' => $data['OrderID'],
            'ProductID' => $data['ProductID'],
            'UserID' => $data['UserID'],
            'Comment' => $data['Comment'] ?? null,
            'Video' => $data['Video'] ?? null,
            'Photo' => $data['Photo'] ?? null,
            'Rating' => $data['Rating'],
        ]);
    }
}
