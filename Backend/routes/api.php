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
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CartDetailController;
use App\Http\Controllers\Api\PhoneChatController;
use App\Http\Controllers\Api\ReviewController; 
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\SupplierController;
use App\Http\Controllers\Api\BatchController;
use App\Http\Controllers\Api\StockInController;
use App\Http\Controllers\Api\StockOutController;
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
Route::post('/user/verify-email', [UserController::class, 'verifyEmail']);
Route::post('/user/resend-code', [UserController::class, 'resendCode']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);


Route::post('/ai/phone-chat', [PhoneChatController::class, 'chat']);
/*
|--------------------------------------------------------------------------
| AUTHENTICATED ROUTES (JWT)
| USER + ADMIN đều vào được
|--------------------------------------------------------------------------
*/
Route::middleware(['jwt'])->group(function () {

    // ===== USER INFO =====
    Route::get('/user/me', [UserController::class, 'me']);
    Route::post('/user/{sdt}', [UserController::class, 'updateUser']);

    // ===== PRODUCT (USER + ADMIN: CHỈ XEM) =====


    // ===== BRAND (USER + ADMIN: CHỈ XEM) =====
    Route::get('/brands', [BrandController::class, 'index']);
    Route::get('/brands/{id}', [BrandController::class, 'show']);
    Route::get('/brands/search', [BrandController::class, 'search']);
    Route::get('/brands/country/{country}', [BrandController::class, 'byCountry']);

    // ===== SUPPLIER (USER + ADMIN: CHỈ XEM) =====
    Route::get('/suppliers', [SupplierController::class, 'index']);
    Route::get('/suppliers/{id}', [SupplierController::class, 'show']);

    // ===== Batch (USER + ADMIN: CHỈ XEM) =====
    Route::get('/batch', [BatchController::class, 'index']);
    Route::get('/batch/{id}', [BatchController::class, 'show']);

    //===== Review =====
    Route::get('/reviews/product/{id}', [ReviewController::class, 'getByProduct']);
    Route::post('/reviews', [ReviewController::class, 'createReview']);
    
    // ===== CATEGORY (USER + ADMIN: CHỈ XEM) =====


    // ===== IMAGE UPLOAD (USER + ADMIN) =====
Route::prefix('images')->group(function () {
        // upload 1 ảnh
        Route::post('/img-upload', [ImageUploadController::class, 'uploadSingle']);

        // ✅ upload ảnh theo productId
        Route::post('/{productId}', [ImageUploadController::class, 'uploadProductImages'])
            ->whereNumber('productId');
    });



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
    Route::get('/orders/check/{userId}/{productId}', [OrderController::class, 'checkUserPurchased']);
   

    // ===== ORDER DETAILS (USER + ADMIN) =====
    Route::post('/order-details', [OrderDetailController::class, 'store']);
    Route::get('/order-details', [OrderDetailController::class, 'index']);
    Route::get('/order-details/{id}', [OrderDetailController::class, 'show']);
    Route::get('/order-details/order/{orderId}', [OrderDetailController::class, 'byOrder']);
    Route::put('/order-details/{id}', [OrderDetailController::class, 'update']);
    Route::delete('/order-details/{id}', [OrderDetailController::class, 'destroy']);

    // ===== CART (USER + ADMIN) =====
    Route::get('/carts', [CartController::class, 'index']);
    Route::get('/carts/{userId}', [CartController::class, 'show']);
    Route::post('/carts', [CartController::class, 'store']);
    Route::delete('/carts/{userId}', [CartController::class, 'destroy']);

    // ===== CART DETAILS (USER + ADMIN) =====
    Route::prefix('cart-details')->group(function () {
        Route::get('/', [CartDetailController::class, 'index']);
        Route::get('/{id}', [CartDetailController::class, 'show']);
        Route::get('/cart/{cartId}', [CartDetailController::class, 'getByCart']);

        Route::post('/', [CartDetailController::class, 'store']);
        Route::put('/{id}', [CartDetailController::class, 'update']);

        Route::delete('/{id}', [CartDetailController::class, 'destroy']);
        Route::delete('/cart/{cartId}', [CartDetailController::class, 'clearCart']);
    });
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
  
        Route::get('/doanh-thu', [OrderController::class, 'doanhThu']);

        // ===== NOTIFICATIONS (CRUD) =====
        Route::post('/notifications', [NotificationController::class, 'store']);
        Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);
        Route::put('/notifications/{id}', [NotificationController::class, 'update']);
        
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

        //===== SUPPLIER (CRUD) =====   
        Route::post('/suppliers', [SupplierController::class, 'store']);
        Route::put('/suppliers/{id}', [SupplierController::class, 'update']);
        Route::delete('/suppliers/{id}', [SupplierController::class, 'destroy']);

        //===== BATCH (CRUD) =====
        Route::post('/batch', [BatchController::class, 'store']);
        Route::put('/batch/{id}', [BatchController::class, 'update']);
        Route::delete('/batch/{id}', [BatchController::class, 'destroy']);

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

        // ===== STOCK IN =====
        Route::prefix('stockin')->group(function () {
            Route::get('/', [StockInController::class, 'index']);
            Route::get('/{id}', [StockInController::class, 'show']);
            Route::post('/', [StockInController::class, 'store']);
            Route::put('/{id}', [StockInController::class, 'update']);
            Route::delete('/{id}', [StockInController::class, 'destroy']);
        });

        // ===== STOCK OUT =====
        Route::prefix('stockout')->group(function () {
            Route::get('/', [StockOutController::class, 'index']);
            Route::get('/{id}', [StockOutController::class, 'show']);
            Route::post('/', [StockOutController::class, 'store']);
            Route::put('/{id}', [StockOutController::class, 'update']);
            Route::delete('/{id}', [StockOutController::class, 'destroy']);
        });
    });
});
