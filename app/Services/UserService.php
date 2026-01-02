<?php

namespace App\Services;

use App\Models\User;
use App\Models\Cart;

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
            'RoleID' => 1
        ]);

        Cart::create([
            'UserID'=>$user->UserID,
            'status'=>'ACTIVE'
        ]);

        return $user;
    }
}
