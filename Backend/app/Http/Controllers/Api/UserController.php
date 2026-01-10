<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\UserService;
use App\Services\JwtService;
use App\Services\CloudinaryService; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Requests\Auth\LoginRequest;
use App\Requests\Auth\RegisterRequest;
use App\Requests\Auth\LoginWithGoogleRequest;
use App\Requests\Auth\VerifyCodeRequest;
use App\Requests\Auth\ResendCodeRequest;
use App\Requests\User\UpdateUserRequest;
use App\Models\Role;
use App\Models\User;

class UserController extends Controller
{
    protected UserService $userService;
    protected JwtService $jwtService;
    protected CloudinaryService $cloudinaryService;

    public function __construct(UserService $userService, JwtService $jwtService,CloudinaryService $cloudinaryService)
    {
        $this->userService = $userService;
        $this->jwtService = $jwtService;
        $this->cloudinaryService = $cloudinaryService;
    }
    //Auth
    public function register(RegisterRequest $req)
    {
        try{
            $result = $this->userService->register($req->all());
            return response()->json($result, 200);
        }catch(\Exception $e){
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function login(LoginRequest $req)
    {
        $input = $req->sdt ?? $req->email;
        $user=$this->userService->findByCredentials($input);

        if (!$user || !$this->userService->verifyPassword($user, $req->passWord)) {
            return response()->json('Sai thông tin đăng nhập', 401);
        }

        if (!$user->is_verified) {
            return response()->json([
                'message' => 'Email chưa được xác thực',
            ], 401);
        }

        $cart = $this->userService->getOrCreateCart($user);
        $token = $this->jwtService->generate($input, [Role::where("RoleID",$user->RoleID)->value('RoleName')]);

        return response()->json([
            'userId'=>$user->UserID,
            'sdt'=>$user->SDT,
            'fullName'=>$user->FullName,
            'email'=>$user->Email,
            'address'=>$user->Address,
            'avatar'=>$user->Avatar,
            'role'=>$user->RoleID,
            'cartId'=>$cart->CartID,
            'is_verified'=>$user->is_verified,
            'token'=>$token
        ]);
    }

    public function loginWithGoogle(LoginWithGoogleRequest $request)
    {
        // VERIFY ID TOKEN WITH GOOGLE
        $response = Http::withOptions([
            'verify' => false
        ])->get('https://oauth2.googleapis.com/tokeninfo', [
            'id_token' => $request->id_token
        ]);

        if (!$response->ok()) {
            return response()->json([
                'message' => 'Google ID Token không hợp lệ'
            ], 401);
        }

        $payload = $response->json();

        // CHECK AUDIENCE
        if ($payload['aud'] !== config('services.google.client_id')) {
            return response()->json([
                'message' => 'Google token sai client_id'
            ], 401);
        }

        $user = $this->userService->handleGoogleLogin([
            'email' => $payload['email'],
            'fullName' => $payload['name'] ?? 'Google User',
            'avatar' => $payload['picture'] ?? null,
            'googleId' => $payload['sub']
        ]);

        $cart = $this->userService->getOrCreateCart($user);
        $token = $this->jwtService->generate($user->Email, [Role::where("RoleID",$user->RoleID)->value('RoleName')]);


        return response()->json([
            'userId'=>$user->UserID,
            'sdt'=>$user->SDT,
            'fullName'=>$user->FullName,
            'email'=>$user->Email,
            'address'=>$user->Address,
            'avatar'=>$user->Avatar,
            'role'=>$user->RoleID,
            'cartId'=>$cart->CartID,
            'is_verified'=>$user->is_verified,
            'token'=>$token
        ]);
    }

    
    public function verifyEmail(VerifyCodeRequest $request)
    {
        try {
            $result = $this->userService->verifyEmailCode(
                $request->Email,
                $request->code
            );
            return response()->json([
                'message' => 'Xác thực Email thành công',
                'user' => $result['user']
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], $e->getCode() ?: 400);
        }
    }

    public function resendCode(ResendCodeRequest $request)
    {
        try {
            $this->userService->resendVerificationCode($request->Email);
            return response()->json(['message' => 'Code sent successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], $e->getCode() ?: 400);
        }
    }

    public function me(Request $request)
    {
        $jwtUser = $request->attributes->get('jwt_user');

        if (!$jwtUser) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $user = $this->userService->findByCredentials($jwtUser->sub);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($user);

    }

    //User
    public function updateUser(UpdateUserRequest $req, $sdt)
    {
        try {
            $data = $req->validated();

            // ✅ Upload ảnh lên Cloudinary (không xóa ảnh cũ)
            if ($req->hasFile('avatar')) {
                $uploadResult = $this->cloudinaryService->uploadImage(
                    $req->file('avatar'),
                    'avatars'
                );

                $data['avatar'] = $uploadResult['url'];
            }

            $result = $this->userService->updateUser($sdt, $data);

            return response()->json($result, 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }


    
    public function getAll()
    {
        return User::all();
    }
}
