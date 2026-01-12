<?php

namespace App\Services;

use App\Models\Batch;
use App\Models\Product;
use App\Resources\BatchResource;
use RuntimeException;

class BatchService
{
    public function getAll(int $perPage)
    {
        $batch = Batch::orderBy('batchID', 'desc')->paginate($perPage);
        return BatchResource::collection($batch);
    }

    public function getById(int $id)
    {
        return new BatchResource(Batch::findOrFail($id));
    }

   public function create(array $data)
    {
        $product = Product::find($data['productID']);
        if (!$product) throw new RuntimeException('Sản phẩm không tồn tại');

        $batch = new Batch();
        $batch->ProductID = $product->ProductID;
        $batch->Quantity = $data['quantity'];
        $batch->PriceIn = $data['priceIn'];
        $batch->ProductionDate = $data['productionDate'];
        $batch->Expiry = $data['expiry'] ?? null;

        $batch->save();

        return new BatchResource($batch);
    }

    public function update(int $id, array $data)
    {
        $batch = Batch::findOrFail($id);

        $batch->Quantity       = $data['quantity'] ?? $batch->Quantity;
        $batch->PriceIn        = $data['priceIn'] ?? $batch->PriceIn;
        $batch->ProductionDate = $data['productionDate'] ?? $batch->ProductionDate;
        $batch->Expiry         = $data['expiry'] ?? $batch->Expiry;

        if (isset($data['productID'])) {
            $product = Product::find($data['productID']);
            if (!$product) {
                throw new RuntimeException('Sản phẩm không tồn tại');
            }
            $batch->ProductID = $product->ProductID;
        }

        $batch->save();

        return new BatchResource($batch);
    }

    public function delete(int $id)
    {
        Batch::findOrFail($id)->delete();
    }
}
