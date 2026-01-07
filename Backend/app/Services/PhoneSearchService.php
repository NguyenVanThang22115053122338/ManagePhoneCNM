<?php

namespace App\Services;

use App\Models\Product;

class PhoneSearchService
{
    public function search(string $message, int $limit = 8): array
    {
        $text = mb_strtolower($message);

        // Query gốc
        $q = Product::query()
            ->with(['brand', 'specification'])
            ->where('Stock_Quantity', '>', 0);

        /* ======================================================
         * 1️⃣ ƯU TIÊN MATCH THEO TÊN SẢN PHẨM (RẤT QUAN TRỌNG)
         * ====================================================== */
        if (preg_match('/(s\d+\s*ultra|s\d+|iphone\s*\d+|galaxy\s*s\d+)/iu', $message, $m)) {
            $name = trim($m[1]);
            $q->whereRaw('LOWER(name) LIKE ?', ['%' . mb_strtolower($name) . '%']);
        }

        /* =========================
         * 2️⃣ LỌC THEO HÃNG
         * ========================= */
        $brands = [
            'samsung' => 'samsung',
            'iphone'  => 'apple',
            'apple'   => 'apple',
            'xiaomi'  => 'xiaomi',
            'oppo'    => 'oppo',
            'vivo'    => 'vivo',
            'realme'  => 'realme',
        ];

        foreach ($brands as $key => $brandName) {
            if (str_contains($text, $key)) {
                $q->whereHas('brand', function ($b) use ($brandName) {
                    $b->whereRaw(
                        'LOWER(name) LIKE ?',
                        ['%' . strtolower($brandName) . '%']
                    );
                });
                break;
            }
        }

        /* =========================
         * 3️⃣ LỌC THEO GIÁ (LINH HOẠT)
         * ========================= */

        // Case: "dưới X triệu" → lọc CHẶT
        if (preg_match('/(dưới|<)\s*(\d+)\s*(triệu|tr)/iu', $message, $m)) {
            $max = (int) $m[2] * 1_000_000;
            $q->where('price', '<=', $max);
        }
        // Case: "có X triệu" / "X triệu" → cho phép dao động
        elseif (preg_match('/(\d+)\s*(triệu|tr)/iu', $message, $m)) {
            $budget = (int) $m[1] * 1_000_000;

            // Nếu ngân sách >= 20tr → cho vượt 20%
            if ($budget >= 20_000_000) {
                $q->whereBetween('price', [
                    $budget * 0.7,
                    $budget * 1.2
                ]);
            } else {
                // Ngân sách thấp → lọc chặt hơn
                $q->where('price', '<=', $budget);
            }
        }

        /* =========================
         * 4️⃣ NHU CẦU SỬ DỤNG
         * ========================= */
        if (str_contains($text, 'pin')) {
            $q->whereHas('specification', function ($s) {
                $s->whereNotNull('battery');
            });
        }

        if (str_contains($text, 'chơi game') || str_contains($text, 'gaming')) {
            $q->whereHas('specification', function ($s) {
                $s->whereNotNull('ram');
            });
        }

        /* =========================
         * 5️⃣ LẤY KẾT QUẢ
         * ========================= */
        $products = $q
            ->orderBy('price') // ưu tiên giá hợp lý
            ->limit($limit)
            ->get();

        /* =========================
         * 6️⃣ FALLBACK (KHÔNG BAO GIỜ TRẢ RỖNG)
         * ========================= */
        if ($products->isEmpty()) {
            $products = Product::query()
                ->with(['brand', 'specification'])
                ->where('Stock_Quantity', '>', 0)
                ->orderBy('price')
                ->limit(3)
                ->get();
        }

        /* =========================
         * 7️⃣ FORMAT OUTPUT
         * ========================= */
        return $products->map(function ($p) {
            return [
                'id'      => $p->ProductID,
                'name'    => $p->name,
                'price'   => $p->price,
                'stock'   => $p->Stock_Quantity,
                'brand'   => $p->brand?->name,
                'battery' => $p->specification?->battery,
                'ram'     => $p->specification?->ram,
                'storage' => $p->specification?->storage,
                'desc'    => $p->description,
            ];
        })->toArray();
    }
}
