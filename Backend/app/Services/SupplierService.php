<?php
namespace App\Services;

use App\Models\Supplier;
use App\Resources\SupplierResource;

class SupplierService {

    public function getAll()
    {
        return SupplierResource::collection(Supplier::all());
    }

    public function getById(int $id)
    {
        $supplier = Supplier::findOrFail($id);
        return new SupplierResource($supplier);
    }

     public function create(array $data)
    {
        if (Supplier::where('supplierName', $data['supplierName'])->exists()) {
            throw new \RuntimeException(
                'Supplier already exists with name: ' . $data['supplierName']
            );
        }

        $supplier = Supplier::create($data);
        return new SupplierResource($supplier);
    }

    public function update(int $id, array $data)
    {
        $supplier = Supplier::findOrFail($id);
        $supplier->update($data);

        return new SupplierResource($supplier);
    }

    public function delete(int $id): void
    {
        $supplier = Supplier::findOrFail($id);
        $supplier->delete();
    }

}