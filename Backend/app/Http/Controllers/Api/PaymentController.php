<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Requests\CreatePayPalPaymentRequest;
use App\Resources\OrderPaymentResource;
use App\Resources\PaymentResource;
use App\Services\PaymentService;

class PaymentController extends Controller
{
    public function __construct(
        private PaymentService $service
    ) {}

    public function create(CreatePayPalPaymentRequest $request)
    {
        $approvalUrl = $this->service->createPayment(
                $request->validated()['orderId']
            );

        return response()->json([
            'approvalUrl' => $approvalUrl
        ]);

    }
    public function getByOrder(int $orderId)
    {
        $payment = $this->service->getByOrderId($orderId);
        return new PaymentResource($payment);
    }

    public function getFull(int $orderId)
    {
        return new OrderPaymentResource(
            $this->service->getFullPayment($orderId)
        );
    }

public function paypalReturn()
{
    $paypalOrderId = request('token');

    if (!$paypalOrderId) {
        return redirect(env('FE_BASE_URL') . '/?payment=failed');
    }

    try {
        $payment = $this->service->completePayment($paypalOrderId);

        return redirect(
            env('FE_BASE_URL')
            . '/?payment=success&orderId=' . $payment->orderId
        );
    } catch (\Throwable $e) {
        logger()->error('PayPal return error', [
            'error' => $e->getMessage(),
            'token' => $paypalOrderId
        ]);

        return redirect(env('FE_BASE_URL') . '/?payment=failed');
    }
}



    public function cancel()
    {
        $this->service->cancelPayment(request('token'));

        return response()->json([
            'status' => 'CANCELLED'
        ]);
    }
}
