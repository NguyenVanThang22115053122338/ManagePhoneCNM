<?php

namespace App\Http\Middleware;
use Closure;
use App\Services\JwtService;

class JwtAuth
{
    public function handle($request, Closure $next)
    {
        $auth = $request->header('Authorization');

        if (!$auth || !str_starts_with($auth, 'Bearer ')) {
            return response()->json(['message'=>'Unauthenticated'],401);
        }

        try {
            $token = substr($auth,7);
            $payload = app(JwtService::class)->decode($token);
            $request->attributes->set('jwt_user', $payload);
        } catch (\Exception $e) {
            return response()->json(['message'=>'Invalid token'],401);
        }

        return $next($request);
    }
}
