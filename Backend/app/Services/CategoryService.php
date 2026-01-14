<?php

namespace App\Services;

use App\Models\Category;
use App\Resources\CategoryResource;
use Illuminate\Support\Facades\DB;
class CategoryService
{
    public function getAll()
    {
        return CategoryResource::collection(Category::all());
    }

    public function getById(int $id)
    {
        $category = Category::findOrFail($id);
        return new CategoryResource($category);
    }

    public function create(array $data)
    {
        if (Category::where('categoryName', $data['categoryName'])->exists()) {
            throw new \RuntimeException(
                'Category already exists with name: ' . $data['categoryName']
            );
        }

        $category = Category::create($data);
        return new CategoryResource($category);
    }

    public function update(int $id, array $data)
    {
        $category = Category::findOrFail($id);
        $category->update($data);

        return new CategoryResource($category);
    }

    public function delete(int $id): void
    {
        $category = Category::findOrFail($id);
        $category->delete();
    }
    //Lấy danh sách brands theo category
    public function getBrandsByCategory(int $categoryId)
    {
        return DB::table('Product')
            ->select('Brand.brandId', 'Brand.name', 'Brand.country', 'Brand.description')
            ->join('Brand', 'Product.BrandID', '=', 'Brand.brandId')
            ->where('Product.CategoryID', $categoryId)
            ->whereNotNull('Product.BrandID')
            ->distinct()
            ->get();
    }

}
