<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;

class PaymentService
{
    public function createPayment(int $orderId): string
    {
        $order = Order::findOrFail($orderId);

        $details = $order->orderDetails;
        if ($details->isEmpty()) {
            throw new \RuntimeException('Order không có sản phẩm');
        }

        $totalVnd = $details->sum(
            fn($d) =>
            $d->product->price * $d->Quantity
        );

        $rate = app(FxRateService::class)->getUsdVndRate();

        if (!$rate || $rate <= 0) {
            throw new \RuntimeException('FX rate unavailable');
        }

        $totalUsd = round($totalVnd / $rate, 2);

        $paypal = app(PayPalService::class)->createOrder(
            $totalUsd,
            "USD",
            "Thanh toán Order #{$orderId}"
        );

        $existing = Payment::where('orderId', $orderId)
            ->whereIn('status', ['CREATED', 'APPROVED'])
            ->first();

        if ($existing) {
            return app(PayPalService::class)->createOrder(
                $totalUsd,
                "USD",
                "Thanh toán Order #{$orderId}"
            )['approve_url'];
        }


        Payment::create([
            'orderId'        => $orderId,
            'paypalOrderId'  => $paypal['id'],
            'amount'         => $totalUsd,
            'currency'       => 'USD',
            'status'         => 'CREATED'
        ]);

        return $paypal['approve_url'];
    }



    public function completePayment(string $paypalOrderId): Payment
    {
        return DB::transaction(function () use ($paypalOrderId) {

            $payment = Payment::where('paypalOrderId', $paypalOrderId)
                ->lockForUpdate()
                ->firstOrFail();

            if ($payment->status === 'COMPLETED') {
                return $payment;
            }

            // 🔥 CAPTURE TẠI ĐÂY
            $capture = app(PayPalService::class)
                ->captureOrder($paypalOrderId);

            if (($capture['status'] ?? null) !== 'COMPLETED') {
                throw new \RuntimeException('PayPal capture not completed');
            }

            if (empty($capture['capture_id'])) {
                throw new \RuntimeException('Missing PayPal capture id');
            }

            $payment->update([
                'paypalCaptureId' => $capture['capture_id'],
                'status' => 'COMPLETED',
            ]);

            $payment->order()->update([
                'PaymentStatus' => 'PAID'
            ]);

            return $payment;
        });
    }


    public function cancelPayment(string $paypalOrderId): void
    {
        Payment::where('paypalOrderId', $paypalOrderId)
            ->update(['status' => 'CANCELLED']);
    }

    public function getByOrderId(int $orderId): Payment
    {
        return Payment::where('orderId', $orderId)->firstOrFail();
    }

    public function getFullPayment(int $orderId): array
    {
        return [
            'payment' => $this->getByOrderId($orderId),
            'order' => Order::with('orderDetails.product')->findOrFail($orderId)
        ];
    }
}
