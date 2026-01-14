<?php

namespace App\Services;

use App\Models\Discount;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class DiscountService
{
    /* ================= GET ================= */

    public function getAll()
    {
        return Discount::orderByDesc('created_at')->get();
    }

    public function getById(int $id): Discount
    {
        return Discount::findOrFail($id);
    }

    /* ================= CREATE ================= */

    public function create(array $data): Discount
    {
        return DB::transaction(function () use ($data) {

            if (Discount::where('Code', strtoupper($data['code']))->exists()) {
                throw ValidationException::withMessages([
                    'code' => 'Mã giảm giá đã tồn tại'
                ]);
            }

            return Discount::create([
                'Code' => strtoupper($data['code']),
                'Type' => $data['type'],
                'Value' => $data['value'],
                'MaxDiscountAmount' => $data['maxDiscountAmount'] ?? null,
                'MinOrderValue' => $data['minOrderValue'] ?? null,
                'StartDate' => $data['startDate'] ?? null,
                'EndDate' => $data['endDate'] ?? null,
                'UsageLimit' => $data['usageLimit'] ?? null,
                'UsedCount' => 0,
                'IsActive' => $data['active'] ?? true,
            ]);
        });
    }

    /* ================= UPDATE ================= */

    public function update(int $id, array $data): Discount
    {
        $discount = Discount::findOrFail($id);

        $discount->update([
            'Code' => isset($data['code']) ? strtoupper($data['code']) : $discount->Code,
            'Type' => $data['type'] ?? $discount->Type,
            'Value' => $data['value'] ?? $discount->Value,
            'MaxDiscountAmount' => $data['maxDiscountAmount'] ?? $discount->MaxDiscountAmount,
            'MinOrderValue' => $data['minOrderValue'] ?? $discount->MinOrderValue,
            'StartDate' => $data['startDate'] ?? $discount->StartDate,
            'EndDate' => $data['endDate'] ?? $discount->EndDate,
            'UsageLimit' => $data['usageLimit'] ?? $discount->UsageLimit,
            'IsActive' => $data['active'] ?? $discount->IsActive,
        ]);

        return $discount;
    }

    /* ================= DELETE ================= */

    public function delete(int $id): void
    {
        $discount = Discount::findOrFail($id);

        if ($discount->UsedCount > 0) {
            throw ValidationException::withMessages([
                'discount' => 'Không thể xóa mã đã được sử dụng'
            ]);
        }

        $discount->delete();
    }
}
