<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $jwtUser = $request->get('jwt_user');

        if (!$jwtUser || !isset($jwtUser->roles)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // đảm bảo roles là array
        $tokenRoles = (array) $jwtUser->roles;

        if (!array_intersect($roles, $tokenRoles)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return $next($request);
    }
}
