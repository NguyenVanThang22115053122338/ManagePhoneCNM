<?php

namespace App\Services;

use App\Models\Batch;
use App\Models\Product;
use App\Http\Resources\BatchResource;
use RuntimeException;

class BatchService
{
    public function getAll()
    {
        return BatchResource::collection(Batch::all());
    }

    public function getById(int $id)
    {
        $batch = Batch::findOrFail($id);
        return new BatchResource($batch);
    }

    public function create(array $data)
    {
        $batch = new Batch();

        $batch->Quantity       = $data['Quantity'];
        $batch->PriceIn        = $data['PriceIn'];
        $batch->Expiry         = $data['Expiry'] ?? null;
        $batch->ProductionDate = $data['ProductionDate'];

        if (!empty($data['ProductID'])) {
            $product = Product::find($data['ProductID']);
            if (!$product) {
                throw new RuntimeException('Sản phẩm không tồn tại');
            }
            $batch->ProductID = $product->ProductID;
        }

        $batch->save();

        return new BatchResource($batch);
    }

    public function update(int $id, array $data)
    {
        $batch = Batch::find($id);
        if (!$batch) {
            throw new RuntimeException('Không tìm thấy lô hàng');
        }

        if (isset($data['Quantity'])) {
            $batch->Quantity = $data['Quantity'];
        }
        if (isset($data['PriceIn'])) {
            $batch->PriceIn = $data['PriceIn'];
        }
        if (isset($data['Expiry'])) {
            $batch->Expiry = $data['Expiry'];
        }
        if (isset($data['ProductionDate'])) {
            $batch->ProductionDate = $data['ProductionDate'];
        }

        if (isset($data['ProductID'])) {
            $product = Product::find($data['ProductID']);
            if (!$product) {
                throw new RuntimeException('Sản phẩm không tồn tại');
            }
            $batch->ProductID = $product->ProductID;
        }

        $batch->save();

        return new BatchResource($batch);
    }

    public function delete(int $id): void
    {
        $batch = Batch::findOrFail($id);
        $batch->delete();
    }
}
