<?php
namespace App\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderDetailResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'        => $this->OrderDetailID,
            'orderId'   => $this->OrderID,
            'productId' => $this->ProductID,
            'quantity'  => $this->Quantity
        ];
    }
}
