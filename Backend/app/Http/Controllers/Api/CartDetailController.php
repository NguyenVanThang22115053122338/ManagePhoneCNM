<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\CartDetailService;

class CartDetailController extends Controller
{
    protected CartDetailService $cartDetailService;

    public function __construct(CartDetailService $cartDetailService)
    {
        $this->cartDetailService = $cartDetailService;
    }

    public function index()
    {
        return $this->cartDetailService->getAll();
    }

    public function show(int $id)
    {
        return $this->cartDetailService->getById($id);
    }

    public function getByCart(int $cartId)
    {
        return $this->cartDetailService->getByCartId($cartId);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'cartId'    => 'required|integer|exists:carts,CartID',
            'ProductID' => 'required|integer|exists:product,ProductID',
        ]);

        return $this->cartDetailService->create($data);
    }

    public function update(Request $request, int $id)
    {
        $data = $request->validate([
            'cartId'    => 'required|integer|exists:carts,CartID',
            'ProductID' => 'required|integer|exists:product,ProductID',
        ]);

        return $this->cartDetailService->update($id, $data);
    }

    public function destroy(int $id)
    {
        $this->cartDetailService->delete($id);
        return response()->noContent();
    }

    public function clearCart(int $cartId)
    {
        $this->cartDetailService->deleteByCartId($cartId);
        return response()->noContent();
    }
}
