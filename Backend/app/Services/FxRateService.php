<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class FxRateService
{
    /**
     * Lấy tỷ giá USD -> VND
     * Cache 30 phút để tránh spam API
     */
    public function getUsdVndRate(): float
    {
        return Cache::remember('usd_vnd_rate', now()->addMinutes(30), function () {
            // API miễn phí, ổn định
            $res = Http::get('https://open.er-api.com/v6/latest/USD');

            if (!$res->successful()) {
                // fallback an toàn
                return 25000.0;
            }

            $json = $res->json();

            if (!isset($json['rates']['VND'])) {
                return 25000.0;
            }

            return (float) $json['rates']['VND'];
        });
    }
}
