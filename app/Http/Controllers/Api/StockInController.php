<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\StockInService;
use App\Requests\StockInRequest;
use Illuminate\Http\Request;

class StockInController extends Controller
{
    public function __construct(
        private StockInService $service
    ) {}

    // GET ALL
    public function index()
    {
        return $this->service->getAll();
    }

    // GET BY ID
    public function show($id)
    {
        return $this->service->getById($id);
    }

    // CREATE
    public function store(StockInRequest $request)
    {
        $validatedData = $request->validated();
        try {
            return $this->service->create($validatedData, $request);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }

    // UPDATE
    public function update(StockInRequest $request, $id)
    {
        $validatedData = $request->validated();
        try {
            return $this->service->update($id, $validatedData, $request);
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
            return response()->json(['message' => "Đã xoá phiếu nhập hàng ID = $id"]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }
}
