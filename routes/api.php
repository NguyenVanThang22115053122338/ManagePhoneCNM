<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\BrandController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\SpecificationController;
use App\Http\Controllers\Api\ImageUploadController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\OrderDetailController;
use App\Http\Controllers\Api\PaymentController;

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES (KHÔNG CẦN LOGIN)
|--------------------------------------------------------------------------
*/

Route::post('/user/register', [UserController::class, 'register']);
Route::post('/user/login', [UserController::class, 'login']);
Route::get('/paypal/return', [PaymentController::class, 'return']);
Route::get('/paypal/cancel', [PaymentController::class, 'cancel']);
Route::post('/user/login-google', [UserController::class, 'loginWithGoogle']);

/*
|--------------------------------------------------------------------------
| AUTHENTICATED ROUTES (JWT)
| USER + ADMIN đều vào được
|--------------------------------------------------------------------------
*/
Route::middleware(['jwt'])->group(function () {

    // ===== USER INFO =====
    Route::get('/user/me', [UserController::class, 'me']);

    // ===== PRODUCT (USER + ADMIN: CHỈ XEM) =====
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{id}', [ProductController::class, 'show']);

    // ===== BRAND (USER + ADMIN: CHỈ XEM) =====
    Route::get('/brands', [BrandController::class, 'index']);
    Route::get('/brands/{id}', [BrandController::class, 'show']);
    Route::get('/brands/search', [BrandController::class, 'search']);
    Route::get('/brands/country/{country}', [BrandController::class, 'byCountry']);

    // ===== CATEGORY (USER + ADMIN: CHỈ XEM) =====
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{id}', [CategoryController::class, 'show']);

    // ===== IMAGE UPLOAD (USER + ADMIN) =====
    Route::post('/images/img-upload', [ImageUploadController::class, 'upload']);

    // ===== NOTIFICATIONS (USER + ADMIN: CHỈ XEM) =====
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/user/{id}', [NotificationController::class, 'getByUser']);
    Route::get('/notifications/role/{role}', [NotificationController::class, 'getByRole']);

    // ===== ORDERS (USER + ADMIN) =====
    Route::post('/order', [OrderController::class, 'store']);
    Route::get('/order', [OrderController::class, 'index']);
    Route::get('/order/{id}', [OrderController::class, 'show']);
    Route::get('/order/user/{userId}', [OrderController::class, 'byUser']);
    Route::put('/order/{id}', [OrderController::class, 'update']);
    Route::delete('/order/{id}', [OrderController::class, 'destroy']);

    // ===== ORDER DETAILS (USER + ADMIN) =====
    Route::post('/order-details', [OrderDetailController::class, 'store']);
    Route::get('/order-details', [OrderDetailController::class, 'index']);
    Route::get('/order-details/{id}', [OrderDetailController::class, 'show']);
    Route::get('/order-details/order/{orderId}', [OrderDetailController::class, 'byOrder']);
    Route::put('/order-details/{id}', [OrderDetailController::class, 'update']);
    Route::delete('/order-details/{id}', [OrderDetailController::class, 'destroy']);

    // ===== PAYPAL PAYMENTS (USER + ADMIN) =====
    Route::post('/paypal/create', [PaymentController::class, 'create']);
    Route::get('/paypal/payment/{orderId}', [PaymentController::class, 'getByOrder']);
    Route::get('/paypal/payment/full/{orderId}', [PaymentController::class, 'getFull']);

    /*
    |--------------------------------------------------------------------------
    | ADMIN ONLY (TOÀN QUYỀN)
    |--------------------------------------------------------------------------
    */
    Route::middleware(['role:ADMIN'])->group(function () {
        // ===== NOTIFICATIONS (CRUD) =====
        Route::post('/notifications', [NotificationController::class, 'store']);
        Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);

        // ===== PRODUCT (CRUD) =====
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{id}', [ProductController::class, 'update']);
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);

        // ===== CATEGORY (CRUD) =====
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{id}', [CategoryController::class, 'update']);
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

        // ===== BRAND (CRUD) =====
        Route::post('/brands', [BrandController::class, 'store']);
        Route::put('/brands/{id}', [BrandController::class, 'update']);
        Route::delete('/brands/{id}', [BrandController::class, 'destroy']);

        // ===== SPECIFICATION (CRUD – nếu vẫn cần) =====
        Route::prefix('specifications')->group(function () {
            Route::get('/', [SpecificationController::class, 'index']);
            Route::get('/{id}', [SpecificationController::class, 'show']);
            Route::post('/', [SpecificationController::class, 'store']);
            Route::put('/{id}', [SpecificationController::class, 'update']);
            Route::delete('/{id}', [SpecificationController::class, 'destroy']);
        });

        // ===== ROLE MANAGEMENT =====
        Route::prefix('roles')->group(function () {
            Route::get('/', [RoleController::class, 'index']);
            Route::get('/{id}', [RoleController::class, 'show']);
            Route::post('/', [RoleController::class, 'store']);
            Route::put('/{id}', [RoleController::class, 'update']);
            Route::delete('/{id}', [RoleController::class, 'destroy']);
        });

        // ===== USER MANAGEMENT =====
        Route::get('/users', [UserController::class, 'getAll']);
    });
});
