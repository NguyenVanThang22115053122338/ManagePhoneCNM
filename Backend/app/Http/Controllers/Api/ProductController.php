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


    public function index(Request $request)
    {
        $keyword = $request->query('keyword');
        $categoryId = $request->query('categoryId');

        $products = $this->service->getAll($keyword, $categoryId);

        return ProductResource::collection($products);
    }


    public function show(int $id)
    {
        $product = $this->service->getById($id);

        return new ProductResource($product);
    }


    public function store(Request $request)
    {
        $product = $this->service->create($request->all());

        return new ProductResource($product);
    }


    public function update(Request $request, int $id)
    {
        $product = $this->service->update($id, $request->all());

        return new ProductResource($product);
    }


    public function destroy(int $id)
    {
        $this->service->delete($id);

        return response()->json([
            'message' => 'Product deleted successfully'
        ]);
    }
}