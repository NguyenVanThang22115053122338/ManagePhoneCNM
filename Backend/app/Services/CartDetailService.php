<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\Product;
use App\Models\CartDetail;
use App\Resources\CartDetailResource;

class CartDetailService
{
    public function getAll()
    {
        return CartDetailResource::collection(
            CartDetail::with(['cart', 'product'])->get()
        );
    }

    public function getById(int $id)
    {
        return new CartDetailResource(
            CartDetail::with(['cart', 'product'])->findOrFail($id)
        );
    }

    public function getByCartId(int $cartId)
    {
        return CartDetailResource::collection(
            CartDetail::with('product')
                ->where('CartID', $cartId)
                ->get()
        );
    }

    public function create(array $data)
    {
        $cart = Cart::findOrFail($data['cartId']);
        $product = Product::findOrFail($data['productId']);

        $cartDetail = CartDetail::create([
            'CartID'    => $cart->CartID,
            'ProductID' => $product->ProductID,
        ]);

        return new CartDetailResource($cartDetail->load('product'));
    }

    public function update(int $id, array $data)
    {
        $cartDetail = CartDetail::findOrFail($id);

        $cart = Cart::findOrFail($data['cartId']);
        $product = Product::findOrFail($data['productId']);

        $cartDetail->update([
            'CartID'    => $cart->CartID,
            'ProductID' => $product->ProductID,
        ]);

        return new CartDetailResource($cartDetail->load('product'));
    }

    public function delete(int $id): void
    {
        CartDetail::findOrFail($id)->delete();
    }

    public function deleteByCartId(int $cartId): void
    {
        CartDetail::where('CartID', $cartId)->delete();
    }
}
