<?
namespace App\Resources;

use App\Resources\PaymentResource;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderPaymentResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'payment' => new PaymentResource($this['payment']),
            'order' => [
                'orderId' => $this['order']->OrderID,
                'status' => $this['order']->Status,
                'paymentStatus' => $this['order']->PaymentStatus,
                'details' => $this['order']->orderDetails
            ]
        ];
    }
}
