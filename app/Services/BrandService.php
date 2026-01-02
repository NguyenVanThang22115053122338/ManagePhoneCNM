<?php

namespace App\Services;

use App\Models\Brand;
use App\Resources\BrandResource;

class BrandService
{
    public function getAll()
    {
        return BrandResource::collection(Brand::all());
    }

    public function getById(int $id)
    {
        $brand = Brand::findOrFail($id);
        return new BrandResource($brand);
    }

    public function searchByName(string $name)
    {
        return BrandResource::collection(
            Brand::where('name', 'like', "%$name%")->get()
        );
    }

    public function getByCountry(string $country)
    {
        return BrandResource::collection(
            Brand::where('country', $country)->get()
        );
    }

    public function create(array $data)
    {
        if (Brand::where('name', $data['name'])->exists()) {
            throw new \RuntimeException('Brand already exists with name: '.$data['name']);
        }

        $brand = Brand::create($data);
        return new BrandResource($brand);
    }

    public function update(int $id, array $data)
    {
        $brand = Brand::findOrFail($id);
        $brand->update($data);

        return new BrandResource($brand);
    }

    public function delete(int $id): void
    {
        $brand = Brand::findOrFail($id);
        $brand->delete();
    }
}
