<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Services\RoleService;
use Illuminate\Http\Request;
use App\Services\UserService;
use App\Services\JwtService;
use App\Models\User;
use App\Models\Cart;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function register(Request $req)
    {
        app(UserService::class)->register($req->all());
        return response()->json('Đăng ký thành công');
    }

    public function login(Request $req)
    {
        $input = $req->sdt ?? $req->email;

        $user = User::where('SDT',$input)
            ->orWhere('Email',$input)
            ->first();

        if (!$user || !Hash::check($req->passWord,$user->Password)) {
            return response()->json('Sai thông tin đăng nhập',401);
        }

        $cart = $user->cart ?? Cart::create([
            'UserID'=>$user->UserID,
            'status'=>'ACTIVE'
        ]);

        $token = app(JwtService::class)->generate(
            $input,
            [$user->role->RoleName]
        );

        return response()->json([
            'userId'=>$user->UserID,
            'sdt'=>$user->SDT,
            'fullName'=>$user->FullName,
            'email'=>$user->Email,
            'address'=>$user->Address,
            'avatar'=>$user->Avatar,
            'role'=>$user->RoleID,
            'cartId'=>$cart->CartID,
            'token'=>$token
        ]);
    }


    public function me(Request $request)
    {
        $jwtUser = $request->attributes->get('jwt_user');

        if (!$jwtUser) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $user = User::where('SDT',$jwtUser->sub)
                ->orWhere('Email',$jwtUser->sub)
                ->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($user);

    }

        public function getAll()
        {
            return User::all();
        }
}
