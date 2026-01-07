<?php

use Illuminate\Support\Facades\Cache;

if (!function_exists('cacheSupportsTags')) {
    function cacheSupportsTags(): bool
    {
        return method_exists(Cache::getStore(), 'tags');
    }
}
