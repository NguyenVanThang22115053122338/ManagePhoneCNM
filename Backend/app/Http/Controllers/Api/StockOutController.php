<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\StockOutService;
use App\Requests\StockOutRequest;
use Illuminate\Http\Request;

class StockOutController extends Controller
{
    public function __construct(
        private StockOutService $service
    ) {}

    // GET ALL
    public function index(int $perPage = 5)
    {
        return $this->service->getAll($perPage);
    }

    // GET BY ID
    public function show($id)
    {
        return $this->service->getById($id);
    }

    // CREATE
    public function store(StockOutRequest $request)
    {
        try {
            return $this->service->create($request->validated(), $request);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }

    // UPDATE
    public function update(StockOutRequest $request, $id)
    {
        try {
            return $this->service->update($id, $request->validated(), $request);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }

    // DELETE
    public function destroy($id)
    {
        try {
            $this->service->delete($id);
            return response()->json(['message' => "Đã xoá phiếu xuất hàng ID = $id"]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }
}
