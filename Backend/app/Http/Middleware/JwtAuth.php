<?php

namespace App\Http\Middleware;

use Closure;
use App\Services\JwtService;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class JwtAuth
{
    public function handle(Request $request, Closure $next): Response
{
    // ✅ CHO PREFLIGHT ĐI QUA
    if ($request->getMethod() === 'OPTIONS') {
        return response()->json('OK', 200)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    }

    $auth = $request->header('Authorization');

    if (!$auth || !str_starts_with($auth, 'Bearer ')) {
        return response()->json(['message' => 'Unauthenticated'], 401)
            ->header('Access-Control-Allow-Origin', '*');
    }

    try {
        $token = substr($auth, 7);
        $payload = app(\App\Services\JwtService::class)->decode($token);
        $request->attributes->set('jwt_user', $payload);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Invalid token'], 401)
            ->header('Access-Control-Allow-Origin', '*');
    }

    return $next($request);
}

}
