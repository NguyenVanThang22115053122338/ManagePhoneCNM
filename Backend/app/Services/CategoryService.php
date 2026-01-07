<?php

namespace App\Services;

use App\Models\Category;
use App\Resources\CategoryResource;

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
}
