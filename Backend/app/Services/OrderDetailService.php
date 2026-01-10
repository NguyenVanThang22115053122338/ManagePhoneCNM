<?php
namespace App\Services;

use App\Models\Order;
use App\Models\Product;
use App\Models\OrderDetail;

class OrderDetailService
{
    // CREATE
    public function create(array $data): OrderDetail
    {
        Order::where('OrderID', $data['orderID'])->firstOrFail();
        Product::where('ProductID', $data['productID'])->firstOrFail();

        return OrderDetail::create([
            'OrderID'   => $data['orderID'],
            'ProductID' => $data['productID'],
            'Quantity'  => $data['quantity']
        ]);
    }

    // GET BY ID
    public function getById(int $id): OrderDetail
    {
        return OrderDetail::findOrFail($id);
    }

    // GET BY ORDER
    public function getByOrder(int $orderId)
    {
        return OrderDetail::where('OrderID', $orderId)->get();
    }

    // GET ALL
    public function getAll()
    {
        return OrderDetail::all();
    }

    // UPDATE
    public function update(int $id, array $data): OrderDetail
    {
        $detail = $this->getById($id);

        if (isset($data['quantity'])) {
            $detail->Quantity = $data['quantity'];
        }

        if (isset($data['orderID'])) {
            Order::where('OrderID', $data['orderID'])->firstOrFail();
            $detail->OrderID = $data['orderID'];
        }

        if (isset($data['productID'])) {
            Product::where('ProductID', $data['productID'])->firstOrFail();
            $detail->ProductID = $data['productID'];
        }

        $detail->save();
        return $detail;
    }

    // DELETE
    public function delete(int $id): void
    {
        $this->getById($id)->delete();
    }
}
