<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Specification;
use Illuminate\Support\Facades\DB;

class ProductService
{
    public function getAll()
    {
        return Product::with(['specification', 'images'])->get();
    }

    public function getById(int $id)
    {
        return Product::with(['specification', 'images'])->findOrFail($id);
    }

    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {

            /*
        |--------------------------------------------------------------------------
        | 1️⃣ CREATE SPECIFICATION TRƯỚC
        |--------------------------------------------------------------------------
        */
            $specId = null;

            if (!empty($data['specification'])) {
                $spec = Specification::create([
                    'screen'   => $data['specification']['screen']   ?? null,
                    'os'       => $data['specification']['os']       ?? null,
                    'cpu'      => $data['specification']['cpu']      ?? null,
                    'ram'      => $data['specification']['ram']      ?? null,
                    'battery'  => $data['specification']['battery']  ?? null,
                    'storage'  => $data['specification']['storage']  ?? null,
                    'camera'   => $data['specification']['camera']   ?? null,
                ]);

                 $specId = $spec->specId; // ⚠️ DB legacy
            }

            /*
        |--------------------------------------------------------------------------
        | 2️⃣ CREATE PRODUCT (GÁN SpecID)
        |--------------------------------------------------------------------------
        */
            $product = Product::create([
                'name'           => $data['name'],
                'price'          => $data['price'],
                'Stock_Quantity' => $data['Stock_Quantity'],
                'description'    => $data['description'] ?? null,
                'BrandID'        => $data['BrandID'],
                'CategoryID'     => $data['CategoryID'],
                'SpecID'         => $specId
            ]);

            /*
        |--------------------------------------------------------------------------
        | 3️⃣ CREATE PRODUCT IMAGES
        |--------------------------------------------------------------------------
        */
            if (!empty($data['product_images'])) {
                foreach ($data['product_images'] as $img) {
                    ProductImage::create([
                        'url'      => $img['url'],
                        'img_index' => $img['img_index'],
                        'product_id' => $product->ProductID
                    ]);
                }
            }

            return $product->load(['specification', 'images']);
        });
    }

    public function update(int $id, array $data)
    {
        $product = Product::findOrFail($id);
        $product->update($data);

        if (isset($data['specification'])) {
            $product->specification()->updateOrCreate(
                ['product_id' => $id],
                $data['specification']
            );
        }

        if (isset($data['product_images'])) {
            $product->images()->delete();
            foreach ($data['product_images'] as $img) {
                $product->images()->create($img);
            }
        }

        return $product->load(['specification', 'images']);
    }

    public function delete(int $id)
    {
        Product::destroy($id);
    }
}
