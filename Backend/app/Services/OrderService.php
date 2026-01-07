<?php
namespace App\Services;

use App\Models\Order;
use Carbon\Carbon;

class OrderService
{
    // CREATE
    public function create(array $data): Order
    {
        return Order::create([
            'Order_Date'    => $data['Order_Date'] ?? Carbon::now(),
            'Status'        => $data['Status'] ?? null,
            'PaymentStatus' => $data['PaymentStatus'] ?? null,
            'UserID'        => $data['UserID']
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
        if (isset($data['Status'])) {
            $order->Status = $data['Status'];
        }
        if (isset($data['PaymentStatus'])) {
            $order->PaymentStatus = $data['PaymentStatus'];
        }

        $order->save();
        return $order;
    }

    // DELETE
    public function delete(int $id): void
    {
        $this->getById($id)->delete();
    }
}
