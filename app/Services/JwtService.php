<?php

namespace App\Services;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JwtService
{
    private string $key = '12345678901234567890123456789012';

    public function generate(string $input, array $roles): string
    {
        return JWT::encode([
            'sub' => $input,
            'roles' => $roles,
            'iat' => time(),
            'exp' => time() + 60 * 60 * 10
        ], $this->key, 'HS256');
    }

    public function decode(string $token)
    {
        return JWT::decode($token, new Key($this->key, 'HS256'));
    }
}


 