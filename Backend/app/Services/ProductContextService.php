<?php

namespace App\Services;

use App\Models\Product;

class ProductContextService
{
    /** @return array{0:string,1:array<int>} */
    public function buildContextWithIds(string $question): array
    {
        $products = Product::query()
            ->where('name', 'like', "%{$question}%")
            ->orWhere('description', 'like', "%{$question}%")
            ->limit(5)
            ->get(['ProductID','name','price','description']);

        if ($products->isEmpty()) {
            return ['', []];
        }

        $context = "Danh sách sản phẩm hiện có:\n";
        $ids = [];

        foreach ($products as $p) {
            $ids[] = (int) $p->ProductID;
            $context .= "- {$p->name}, giá {$p->price}, {$p->description}\n";
        }

        return [$context, $ids];
    }
}
