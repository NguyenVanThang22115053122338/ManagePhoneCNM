<?php

namespace App\Services;

use App\Models\StockIn;
use App\Models\Product;
use App\Models\Batch;
use App\Models\User;
use App\Resources\StockInResource;
use App\Resources\BatchResource;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class StockInService
{
    // Lấy tất cả phiếu nhập
    public function getAll()
    {
        $stockIns = StockIn::all();
        return StockInResource::collection($stockIns);
    }

    // Lấy theo ID
    public function getById($id)
    {
        $stockIn = StockIn::findOrFail($id);
        return new StockInResource($stockIn);
    }

    // Tạo mới phiếu nhập
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

        DB::beginTransaction();

        try {
        // 1. Tạo batch
        $batch = Batch::create([
            'ProductID' => $data['productId'],
            'ProductionDate' => $data['productionDate'],
            'Quantity' => $data['quantity'],
            'PriceIn' => $data['priceIn'],
            'Expiry' => $data['expiry'],
        ]);

        // 2. Tạo stock in gắn với batch
        $stockIn = StockIn::create([
            'BatchID' => $batch->BatchID,
            'UserID' => $user->UserID,
            'quantity' => $batch->Quantity,
            'note' => $data['note'] ?? null,
            'date' => $data['date'] ?? Carbon::now(),
        ]);

         // 3. Cộng tồn kho cho product
        $product = Product::findOrFail($batch->ProductID);
        $product->Stock_Quantity += $stockIn->quantity;
        $product->save();

        // 4. Update giá sản phẩm
        $product->Price = $batch->PriceIn;
        $product->save();
        
        DB::commit();

        return [
            'stockIn' => new StockInResource($stockIn),
            'batch'   => new BatchResource($batch),
            'productStock' => $product->Stock_Quantity
        ];

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    // Cập nhật phiếu nhập
    public function update($id, array $data, $request)
    {
        $stockIn = StockIn::findOrFail($id);

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
        $stockIn->update([
            'BatchID' => $data['BatchID'] ?? $stockIn->BatchID,
            'UserID' => $user->UserID,
            'quantity' => $data['quantity'] ?? $stockIn->quantity,
            'note' => $data['note'] ?? $stockIn->note,
            'date' => $data['date'] ?? $stockIn->date
        ]);

        return new StockInResource($stockIn);
    }

    // Xoá phiếu nhập
    public function delete($id)
    {
        $stockIn = StockIn::findOrFail($id);
        $stockIn->delete();
    }
}
