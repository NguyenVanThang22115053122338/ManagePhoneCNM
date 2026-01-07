<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CartService;
use Illuminate\Http\Request;

class CartController extends Controller
{
    private CartService $cartService;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    public function index()
    {
        return response()->json($this->cartService->getAll());
    }

    public function show($userId)
    {
        return response()->json(
            $this->cartService->getByUserId($userId)
        );
    }

    public function store(Request $request)
    {
        return response()->json(
            $this->cartService->create($request->all()),
            201
        );
    }

    public function destroy($userId)
    {
        $this->cartService->deleteByUserId($userId);

        return response()->json([
            'message' => "Deleted cart of userId = $userId"
        ]);
    }
}
