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

    // Auth
    public function register(array $data)
    {
        $userByPhone = User::where('SDT', $data['sdt'])->first();

        if (
            User::where('Email', $data['email'])->exists()
        ) {
            throw new \Exception('Email đã tồn tại');
        }

        if ($userByPhone && $userByPhone->is_verified) {
            throw new \Exception('SĐT đã tồn tại');
        }

        if ($userByPhone && !$userByPhone->is_verified) {
            $userByPhone->update([
                'code' => Str::random(6),
                'code_expires_at' => now()->addMinutes(2),
            ]);

            Mail::to($userByPhone->Email)->send(
                new SendCodeVerifyEmail($userByPhone->code)
            );

            return [
                'userId'      => $userByPhone->UserID,
                'is_verified' => false,
                'need_verify' => true,
                'message'     => 'Tài khoản chưa được xác thực. Đã gửi lại mã.',
            ];
        }

        $user = User::create([
            'SDT' => $data['sdt'],
            'Password' => bcrypt($data['matKhau']),
            'FullName' => $data['hoVaTen'],
            'Email' => $data['email'],
            'Address' => $data['diaChi'],
            'RoleID' => 1,
            'is_verified' => false,
            'code' => Str::random(6),
            'code_expires_at' => now()->addMinutes(2),
        ]);

        Mail::to($user->Email)->send(
            new SendCodeVerifyEmail($user->code)
        );

        return [
            'userId'      => $user->UserID,
            'is_verified' => false,
            'need_verify' => true,
            'message'     => 'Vui lòng xác thực email',
        ];
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

    public function handleGoogleLogin(array $googleData): User
    {
        $user = User::where('Email', $googleData['email'])->first();

        if ($user) {

            if (!$user->googleId) {
                $user->googleId = $googleData['googleId'];
                $user->Avatar = $googleData['avatar'] ?? $user->Avatar;
                $user->is_verified = true;
                $user->save();
            }

            return $user;
        }

        return User::create([
            'Email' => $googleData['email'],
            'FullName' => $googleData['fullName'],
            'Avatar' => $googleData['avatar'],
            'googleId' => $googleData['googleId'],
            'Password' => Hash::make(Str::random(32)),
            'RoleID' => 1,
            'is_verified' => true,
        ]);
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
        $expiresAt = now()->addMinutes(2);
        $user->code = $code;
        $user->code_expires_at = $expiresAt;
        $user->save();

        Mail::to($user->Email)->send(new SendCodeVerifyEmail($code));
    }

    //User
    public function updateUser(User $user, array $data)
    {
        $updateData = [];

        if (array_key_exists('fullName', $data)) {
            $updateData['FullName'] = $data['fullName'];
        }

        if (array_key_exists('email', $data)) {
            $exists = User::where('Email', $data['email'])
                ->where('UserID', '!=', $user->UserID)
                ->exists();
            if ($exists) {
                throw new \Exception('Email đã tồn tại');
            }
            $updateData['Email'] = $data['email'];
        }

        if (array_key_exists('address', $data)) {
            $updateData['Address'] = $data['address'];
        }

        if (array_key_exists('avatar', $data)) {
            $updateData['Avatar'] = $data['avatar'];
        }

        if (!empty($updateData)) {
            $user->update($updateData);
        }

        return [
            'user' => $user->fresh(),
            'message' => 'Cập nhật thành công'
        ];
    }


    public function createUser(array $data)
    {
        if (User::where('SDT', $data['sdt'])->exists()) {
            throw new \Exception('SĐT đã tồn tại');
        }

        if (User::where('Email', $data['email'])->exists()) {
            throw new \Exception('Email đã tồn tại');
        }

        $user = User::create([
            'SDT' => $data['sdt'],
            'Password' => bcrypt('123456'),
            'FullName' => $data['hoVaTen'],
            'Email' => $data['email'],
            'Address' => $data['diaChi'] ?? null,
            'Avatar' => $data['avatar'] ?? null,
            'RoleID' => $data['roleId'] ?? 1,
            'is_verified' => 1,
        ]);

        return [
            'user' => $user,
            'message' => 'Tạo tài khoản thành công. Mật khẩu mặc định: 123456'
        ];
    }

    public function changePassword(User $user, string $oldPassword, string $newPassword)
    {
        // Google user chưa set password → cho set luôn
        if (!$user->Password) {
            $user->Password = Hash::make($newPassword);
            $user->save();
            return;
        }

        if (!Hash::check($oldPassword, $user->Password)) {
            throw new \Exception('Mật khẩu cũ không đúng');
        }

        $user->Password = Hash::make($newPassword);
        $user->save();
    }

    public function updatePhone(User $user, string $sdt)
{
    $exists = User::where('SDT', $sdt)
        ->where('UserID', '!=', $user->UserID)
        ->exists();

    if ($exists) {
        throw new \Exception('SĐT đã tồn tại');
    }

    $user->SDT = $sdt;
    $user->save();
}

}
