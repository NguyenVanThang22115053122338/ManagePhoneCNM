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
        Order::where('OrderID', $data['OrderID'])->firstOrFail();
        Product::where('ProductID', $data['ProductID'])->firstOrFail();

        return OrderDetail::create([
            'OrderID'   => $data['OrderID'],
            'ProductID' => $data['ProductID'],
            'Quantity'  => $data['Quantity']
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

        if (isset($data['Quantity'])) {
            $detail->Quantity = $data['Quantity'];
        }

        if (isset($data['OrderID'])) {
            Order::where('OrderID', $data['OrderID'])->firstOrFail();
            $detail->OrderID = $data['OrderID'];
        }

        if (isset($data['ProductID'])) {
            Product::where('ProductID', $data['ProductID'])->firstOrFail();
            $detail->ProductID = $data['ProductID'];
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
