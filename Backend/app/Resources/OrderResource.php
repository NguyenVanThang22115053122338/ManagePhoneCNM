<?php

namespace App\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'orderId' => $this->OrderID,

            // ✅ ngày đặt (fix Invalid Date)
            'orderDate' => $this->Order_Date,

            // ✅ trạng thái
            'status' => $this->Status,
            'paymentStatus' => $this->PaymentStatus,

            // ✅ thông tin user
            'userId' => $this->UserID,
            'userName' => $this->whenLoaded('user', fn() => $this->user->FullName ?? null),
            'userEmail' => $this->whenLoaded('user', fn() => $this->user->Email ?? null),

            // ✅ snapshot tiền
            'subTotal' => (float) $this->SubTotal,
            'discountAmount' => (float) $this->DiscountAmount,
            'totalAmount' => (float) $this->TotalAmount,

            // ✅ danh sách sản phẩm (fix "Không có sản phẩm")
            'products' => $this->whenLoaded('orderDetails', function () {
                return $this->orderDetails->map(function ($d) {
                    return [
                        'productID' => $d->ProductID,
                        'name' => $d->product->Name ?? '',
                        'price' => (float) ($d->product->Price ?? 0),
                        'quantity' => (int) $d->Quantity,
                        'imageUrl' => $d->product->ImageUrl ?? null,
                    ];
                });
            }),
        ];
    }
}
