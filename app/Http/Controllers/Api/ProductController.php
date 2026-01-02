<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Resources\ProductResource;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    private ProductService $service;

    public function __construct(ProductService $service)
    {
        $this->service = $service;
    }

    /**
     * GET /api/products
     */
    public function index()
    {
        $products = $this->service->getAll();

        return ProductResource::collection($products);
    }

    /**
     * GET /api/products/{id}
     */
    public function show(int $id)
    {
        $product = $this->service->getById($id);

        return new ProductResource($product);
    }

    /**
     * POST /api/products
     */
    public function store(Request $request)
    {
        $product = $this->service->create($request->all());

        return new ProductResource($product);
    }

    /**
     * PUT /api/products/{id}
     */
    public function update(Request $request, int $id)
    {
        $product = $this->service->update($id, $request->all());

        return new ProductResource($product);
    }

    /**
     * DELETE /api/products/{id}
     */
    public function destroy(int $id)
    {
        $this->service->delete($id);

        return response()->json([
            'message' => 'Product deleted successfully'
        ]);
    }
}
