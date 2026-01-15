<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Requests\OrderRequest;
use App\Resources\OrderResource;
use App\Resources\DoanhThuDonHangResource;
use App\Services\OrderService;
use Illuminate\Http\Response;
use Illuminate\Http\Request;
use App\Requests\UpdateOrderStatusRequest;

class OrderController extends Controller
{
    private OrderService $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    // CREATE
    public function store(OrderRequest $request)
    {
        $order = $this->orderService->create($request->validated());  // ✅
        return response(new OrderResource($order), Response::HTTP_CREATED);
    }

    // GET BY ID
    public function show($id)
    {
        return new OrderResource(
            $this->orderService->getById($id)  // ✅
        );
    }

    // GET BY USER
    public function byUser($userId)
    {
        return OrderResource::collection(
            $this->orderService->getByUser($userId)  // ✅
        );
    }

    // GET ALL
    public function index()
    {
        return OrderResource::collection(
            $this->orderService->getAll()  // ✅
        );
    }

    // UPDATE


    public function update(UpdateOrderStatusRequest $request, $id)
{
    $order = $this->orderService->update($id, $request->validated());
    return new OrderResource($order);
}


    // DELETE
    public function destroy($id)
    {
        $this->orderService->delete($id);  // ✅
        return response()->noContent();
    }

    public function checkUserPurchased(int $userId, int $productId)
    {
        $orderId = $this->orderService->getOrderByUserAndProduct($userId, $productId);

        if (!$orderId) {
            return response()->json(['hasPurchased' => false], 404);
        }

        return response()->json([
            'hasPurchased' => true,
            'orderId' => $orderId
        ]);
    }

    public function doanhThu(Request $request)
{
    try {
        $year  = $request->query('year');
        $month = $request->query('month');
        $day   = $request->query('day');

        return response()->json(
            $this->orderService->getDoanhThuDonHang(
                $year ? (int)$year : null,
                $month ? (int)$month : null,
                $day ? (int)$day : null
            )
        );
    } catch (\Throwable $e) {
        return response()->json([
            'message' => 'Statistic error',
            'error'   => $e->getMessage(),
            'file'    => $e->getFile(),
            'line'    => $e->getLine(),
        ], 500);
    }
}




    public function applyDiscount(Request $request, int $orderId)
    {
        $order = $this->orderService->getById($orderId);

        $code = $request->input('code'); // có thể null

        $order = $this->orderService->applyDiscount($order, $code);

        return response()->json([
            'subTotal' => $order->SubTotal,
            'discountAmount' => $order->DiscountAmount,
            'totalAmount' => $order->TotalAmount,
        ]);
    }
}
