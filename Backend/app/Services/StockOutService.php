<?php

namespace App\Services;

use App\Models\StockOut;
use App\Models\Batch;
use App\Models\User;
use App\Resources\StockOutResource;
use Carbon\Carbon;
use App\Models\Product;

class StockOutService
{
    // Lấy tất cả phiếu xuất
    public function getAll()
    {
        $stockOuts = StockOut::all();
        return StockOutResource::collection($stockOuts);
    }

    // Lấy theo ID
    public function getById($id)
    {
        $stockOut = StockOut::findOrFail($id);
        return new StockOutResource($stockOut);
    }

    // Tạo mới phiếu xuất
    public function create(array $data, $request)
    {
        // Lấy user từ JWT token
        $jwtUser = $request->attributes->get('jwt_user');
        $user = User::where('Email', $jwtUser->sub)
                    ->orWhere('SDT', $jwtUser->sub)
                    ->first();
        
        if (!$user) {
            throw new \Exception('Người dùng không tồn tại');
        }

        // Tạo stock out
        $stockOut = StockOut::create([
            'BatchID' => $data['BatchID'] ?? null,
            'UserID' => $user->UserID,
            'quantity' => $data['quantity'],
            'note' => $data['note'] ?? null,
            'date' => $data['date'] ?? Carbon::now()
        ]);

        // Update số lượng lô hàng
        $batch = Batch::findOrFail($data['BatchID']);
        $batch->Quantity -= $data['quantity'];
        $batch->save();

        // Update số lượng sản phẩm
        $product = Product::findOrFail($batch->ProductID);
        $product->Stock_Quantity -= $data['quantity'];
        $product->save();

        return new StockOutResource($stockOut);
    }

    // Cập nhật phiếu xuất
    public function update($id, array $data, $request)
    {
        $stockOut = StockOut::findOrFail($id);

        // Lấy user từ JWT token
        $jwtUser = $request->attributes->get('jwt_user');
        $user = User::where('Email', $jwtUser->sub)
                    ->orWhere('SDT', $jwtUser->sub)
                    ->first();
        
        if (!$user) {
            throw new \Exception('Người dùng không tồn tại');
        }

        // Kiểm tra batch nếu có
        if (!empty($data['BatchID'])) {
            $batch = Batch::find($data['BatchID']);
            if (!$batch) {
                throw new \Exception('Lô hàng không tồn tại');
            }
        }

        // Cập nhật
        $stockOut->update([
            'BatchID' => $data['BatchID'] ?? $stockOut->BatchID,
            'UserID' => $user->UserID,
            'quantity' => $data['quantity'] ?? $stockOut->quantity,
            'note' => $data['note'] ?? $stockOut->note,
            'date' => $data['date'] ?? $stockOut->date
        ]);

        return new StockOutResource($stockOut);
    }

    // Xoá phiếu xuất
    public function delete($id)
    {
        $stockOut = StockOut::findOrFail($id);
        $stockOut->delete();
    }
}
