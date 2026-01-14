<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\DiscountService;
use Illuminate\Http\Request;
use App\Resources\DiscountResource;

class DiscountController extends Controller
{
    private DiscountService $discountService;

    public function __construct(DiscountService $discountService)
    {
        $this->discountService = $discountService;
    }

    /* ================= GET ================= */

    public function index()
{
    return response()->json([
        'data' => DiscountResource::collection(
            $this->discountService->getAll()
        )
    ]);
}

public function show(int $id)
{
    return response()->json([
        'data' => new DiscountResource(
            $this->discountService->getById($id)
        )
    ]);
}

    /* ================= CREATE ================= */

    public function store(Request $request)
    {
        // 👉 VALIDATE CAMELCASE (KHỚP FE)
        $data = $request->validate([
            'code' => 'required|string|max:50',
            'type' => 'required|in:PERCENT,FIXED',
            'value' => 'required|numeric|min:0',

            'maxDiscountAmount' => 'nullable|numeric|min:0',
            'minOrderValue'     => 'nullable|numeric|min:0',

            'startDate' => 'nullable|date',
            'endDate'   => 'nullable|date|after:startDate',

            'usageLimit' => 'nullable|integer|min:1',
            'active'     => 'boolean',
        ]);

        $discount = $this->discountService->create($data);

        return response()->json([
            'message' => 'Tạo mã giảm giá thành công',
            'data' => $discount
        ], 201);
    }

    /* ================= UPDATE ================= */

    public function update(Request $request, int $id)
    {
        // 👉 VALIDATE CAMELCASE
        $data = $request->validate([
            'code' => 'string|max:50',
            'type' => 'in:PERCENT,FIXED',
            'value' => 'numeric|min:0',

            'maxDiscountAmount' => 'nullable|numeric|min:0',
            'minOrderValue'     => 'nullable|numeric|min:0',

            'startDate' => 'nullable|date',
            'endDate'   => 'nullable|date|after:startDate',

            'usageLimit' => 'nullable|integer|min:1',
            'active'     => 'boolean',
        ]);

        $discount = $this->discountService->update($id, $data);

        return response()->json([
            'message' => 'Cập nhật mã giảm giá thành công',
            'data' => $discount
        ]);
    }

    /* ================= DELETE ================= */

    public function destroy(int $id)
    {
        $this->discountService->delete($id);

        return response()->json([
            'message' => 'Xóa mã giảm giá thành công'
        ]);
    }
}
