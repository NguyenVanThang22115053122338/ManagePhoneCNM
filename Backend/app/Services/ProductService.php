<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Specification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;


class ProductService
{
    /**
     * Get all products with optional search filters
     * 
     * @param string|null $keyword - Search in product name
     * @param string|null $categoryId - Filter by category
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAll($keyword = null, $categoryId = null)
    {
        $query = Product::with(['specification', 'images']);

        // Search by keyword in product name
        if (!empty($keyword)) {
            $query->where('name', 'LIKE', '%' . $keyword . '%');
        }

        // Filter by category
        if (!empty($categoryId)) {
            $query->where('CategoryID', $categoryId);
        }

        return $query->get();
    }

    public function getById(int $id)
    {
        return Product::with(['specification', 'images'])->findOrFail($id);
    }

    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {

            $specId = null;

            if (!empty($data['specification'])) {
                $spec = Specification::create($data['specification']);
                $specId = $spec->specId;
            }

            $product = Product::create([
                'name'           => $data['name'],
                'price'          => $data['price'],
                'Stock_Quantity' => $data['stockQuantity'],
                'description'    => $data['description'] ?? null,
                'BrandID'        => $data['brandId'] ?? null,
                'CategoryID'     => $data['categoryId'] ?? null,
                'SupplierID'     => $data['supplierId'] ?? null,
                'SpecID'         => $specId
            ]);

            if (!empty($data['productImages'])) {
                foreach ($data['productImages'] as $img) {
                    $product->images()->create([
                        'url'       => $img['url'],
                        'img_index' => $img['img_index']
                    ]);
                }
            }

            return $product->load(['specification', 'images']);
        });
    }

    public function update(int $id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {

            $product = Product::findOrFail($id);

            $product->update([
                'name'           => $data['name'],
                'price'          => $data['price'],
                'Stock_Quantity' => $data['stockQuantity'],
                'description'    => $data['description'] ?? null,
                'BrandID'        => $data['brandId'] ?? null,
                'CategoryID'     => $data['categoryId'] ?? null,
                'SupplierID'     => $data['supplierId'] ?? null,
            ]);

            // ===== SPEC =====
            if (isset($data['specification'])) {
                if ($product->SpecID) {
                    Specification::where('specId', $product->SpecID)
                        ->update($data['specification']);
                } else {
                    $spec = Specification::create($data['specification']);
                    $product->SpecID = $spec->specId;
                    $product->save();
                }
            }

            // ===== IMAGES (clear + add) =====
            if (isset($data['productImages'])) {
                $product->images()->delete();

                foreach ($data['productImages'] as $img) {
                    $product->images()->create([
                        'url'       => $img['url'],
                        'img_index' => $img['img_index']
                    ]);
                }
            }

            return $product->load(['specification', 'images']);
        });
    }

    public function delete(int $id)
    {
        $product = Product::findOrFail($id);
        $product->delete(); // soft delete
    }
}