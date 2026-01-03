<?php

namespace App\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'              => $this->id,
            'orderId'         => $this->orderId,
            'paypalOrderId'   => $this->paypalOrderId,
            'paypalCaptureId' => $this->paypalCaptureId,
            'status'          => $this->status,
            'amount'          => (float) $this->amount,
            'currency'        => $this->currency,
            'createdAt'       => $this->createdAt,
            'updatedAt'       => $this->updatedAt,
        ];
    }
}
