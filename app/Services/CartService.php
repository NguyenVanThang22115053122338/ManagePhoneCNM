<?php

namespace App\Services;

use App\Models\Cart;
use App\Resources\CartResource;

class CartService
{
    public function getAll()
    {
        return CartResource::collection(Cart::all());
    }

    public function getByUserId(int $userId)
    {
        return new CartResource(
            Cart::where('UserID', $userId)->firstOrFail()
        );
    }

    public function create(array $data)
    {
        $cart = Cart::create([
            'UserID' => $data['userId'],
            'status' => $data['status'] ?? 'ACTIVE',
        ]);

        return new CartResource($cart);
    }

    public function deleteByUserId(int $userId): void
    {
        $cart = Cart::where('UserID', $userId)->firstOrFail();
        $cart->delete();
    }
}
