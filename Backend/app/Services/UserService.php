<?php

namespace App\Services;

use App\Models\User;
use App\Models\Cart;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\SendCodeVerifyEmail;

class UserService
{
    public function register(array $data)
    {
        if (User::where('SDT',$data['sdt'])->exists()) {
            throw new \Exception('SĐT đã tồn tại');
        }

        $user = User::create([
            'SDT' => $data['sdt'],
            'Password' => bcrypt($data['matKhau']),
            'FullName' => $data['hoVaTen'],
            'Email' => $data['email'],
            'Address' => $data['diaChi'],
            'RoleID' => 1,
            'code' => Str::random(6),
            'code_expires_at' => now()->addMinutes(10),
        ]);

        Mail::to($user->Email)->send(new SendCodeVerifyEmail($user->code));

        Cart::create([
            'UserID'=>$user->UserID,
            'status'=>'ACTIVE'
        ]);

        return $user;
    }

    public function findByCredentials(string $input)
    {
        return User::where('SDT', $input)
            ->orWhere('Email', $input)
            ->first();
    }

    public function verifyPassword(User $user, string $password): bool
    {
        return Hash::check($password, $user->Password);
    }

    public function getOrCreateCart(User $user): Cart
    {
        return Cart::where('UserID', $user->UserID)->first() ?? Cart::create([
            'UserID' => $user->UserID,
            'status' => 'ACTIVE'
        ]);
    }

    public function createOrUpdateGoogleUser(array $googleData): User
    {
        return User::updateOrCreate(
            ['Email' => $googleData['email']],
            [
                'FullName' => $googleData['fullName'],
                'Avatar' => $googleData['avatar'],
                'googleId' => $googleData['googleId'],
                'RoleID' => 1,
                'Password' => Hash::make(Str::random(32)),
                'is_verified' => true,
            ]
        );
    }

    public function verifyEmailCode(string $email, string $code)
    {
        $user = User::where('Email', $email)->first();
        
        if (!$user) {
            throw new \Exception('User not found', 404);
        }

        if ($user->code !== $code) {
            throw new \Exception('Invalid code', 400);
        }

        if ($user->code_expires_at < now()) {
            throw new \Exception('Code expired', 400);
        }
        
        $user->is_verified = true;
        $user->code = null;
        $user->code_expires_at = null;
        $user->save();

        return ['user' => $user];
    }

    public function resendVerificationCode(string $email)
    {
        $user = User::where('Email', $email)->first();

        if (!$user) {
            throw new \Exception('User not found', 404);
        }

        $code = Str::random(6);
        $expiresAt = now()->addMinutes(10);
        $user->code = $code;
        $user->code_expires_at = $expiresAt;
        $user->save();

        Mail::to($user->Email)->send(new SendCodeVerifyEmail($code));
    }
}
