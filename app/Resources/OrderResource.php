<?php
namespace App\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'orderID'       => $this->OrderID,
            'orderDate'     => $this->Order_Date,
            'status'        => $this->Status,
            'paymentStatus' => $this->PaymentStatus,
            'userID'        => $this->UserID,
        ];
    }
}
