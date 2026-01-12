<?php
namespace App\Services;

use App\Models\Order;
use Carbon\Carbon;
use App\Resources\OrderResource;
use Illuminate\Support\Facades\DB;
class OrderService
{
    // CREATE
    public function create(array $data): Order
    {
        return Order::create([
            'Order_Date'    =>  Carbon::now(),
            'Status'        => $data['status'] ?? null,
            'PaymentStatus' => $data['paymentStatus'] ?? null,
            'UserID'        => $data['userID']
        ]);
    }

    // GET BY ID
    public function getById(int $id): Order
    {
        return Order::findOrFail($id);
    }

    // GET BY USER
    public function getByUser(int $userId)
    {
        return Order::where('UserID', $userId)->get();
    }

    // GET ALL
    public function getAll()
    {
        return Order::all();
    }

    // UPDATE
    public function update(int $id, array $data): Order
    {
        $order = $this->getById($id);

        if (isset($data['Order_Date'])) {
            $order->Order_Date = $data['Order_Date'];
        }
        if (isset($data['status'])) {
            $order->Status = $data['status'];
        }
        if (isset($data['paymentStatus'])) {
            $order->PaymentStatus = $data['paymentStatus'];
        }

        $order->save();
        return $order;
    }

    // DELETE
    public function delete(int $id): void
    {
        $this->getById($id)->delete();
    }
    // ktra user da mua product chua
    public function getOrderByUserAndProduct(int $userId, int $productId): ?int
    {
        return DB::table('order')
            ->join('orderdetail', 'order.OrderID', '=', 'orderdetail.OrderID')
            ->where('order.UserID', $userId)
            ->where('orderdetail.ProductID', $productId)
            ->value('order.OrderID');
    }
}
