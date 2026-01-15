<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Payment;
use App\Services\OrderService;
use Illuminate\Support\Facades\DB;

class PaymentService
{
    /**
     * Tạo PayPal payment và trả approval URL
     */
    public function createPayment(int $orderId): string
    {
        return DB::transaction(function () use ($orderId) {

            $order = Order::with('orderDetails.product')
                ->lockForUpdate()
                ->findOrFail($orderId);

            if ($order->orderDetails->isEmpty()) {
                throw new \RuntimeException('Order không có sản phẩm');
            }

            // 🔥 ENSURE SNAPSHOT (KHÔNG TIN FE)
            if ((float)$order->TotalAmount <= 0) {
                app(OrderService::class)->applyDiscount($order, null);
                $order->refresh();
            }

            if ((float)$order->TotalAmount <= 0) {
                throw new \RuntimeException('Order totalAmount không hợp lệ');
            }

            $totalVnd = (float) $order->TotalAmount;

            $rate = app(FxRateService::class)->getUsdVndRate();
            if (!$rate || $rate <= 0) {
                throw new \RuntimeException('FX rate unavailable');
            }

            $totalUsd = round($totalVnd / $rate, 2);

            $existing = Payment::where('orderId', $orderId)
                ->whereIn('status', ['CREATED', 'APPROVED'])
                ->lockForUpdate()
                ->first();

            if ($existing) {
                if ((float)$existing->amount !== $totalUsd) {
                    $existing->update(['status' => 'CANCELLED']);
                } else {
                    return app(PayPalService::class)
                        ->getApproveUrl($existing->paypalOrderId);
                }
            }

            $paypal = app(PayPalService::class)->createOrder(
                $totalUsd,
                'USD',
                "Thanh toán Order #{$orderId}"
            );

            Payment::create([
                'orderId'       => $orderId,
                'paypalOrderId' => $paypal['id'],
                'amount'        => $totalUsd,
                'currency'      => 'USD',
                'status'        => 'CREATED'
            ]);

            return $paypal['approve_url'];
        });
    }

    /**
     * Capture PayPal payment
     */
    public function completePayment(string $paypalOrderId): Payment
    {
        return DB::transaction(function () use ($paypalOrderId) {

            $payment = Payment::where('paypalOrderId', $paypalOrderId)
                ->lockForUpdate()
                ->firstOrFail();

            if ($payment->status === 'COMPLETED') {
                return $payment;
            }

            // 🔥 Capture PayPal
            $capture = app(PayPalService::class)
                ->captureOrder($paypalOrderId);

            if (($capture['status'] ?? null) !== 'COMPLETED') {
                throw new \RuntimeException('PayPal capture not completed');
            }

            if (empty($capture['capture_id'])) {
                throw new \RuntimeException('Missing PayPal capture id');
            }

            // ✅ Update payment
            $payment->update([
                'paypalCaptureId' => $capture['capture_id'],
                'status' => 'COMPLETED',
            ]);

            // ✅ Update order
            $payment->order()->update([
                'PaymentStatus' => 'PAID'
            ]);

            return $payment;
        });
    }

    /**
     * Cancel payment
     */
    public function cancelPayment(string $paypalOrderId): void
    {
        Payment::where('paypalOrderId', $paypalOrderId)
            ->whereIn('status', ['CREATED', 'APPROVED'])
            ->update(['status' => 'CANCELLED']);
    }

    /**
     * Get payment by order
     */
    public function getByOrderId(int $orderId): Payment
    {
        return Payment::where('orderId', $orderId)->firstOrFail();
    }

    /**
     * Get full payment + order
     */
    public function getFullPayment(int $orderId): array
    {
        return [
            'payment' => $this->getByOrderId($orderId),
            'order' => Order::with('orderDetails.product')->findOrFail($orderId)
        ];
    }
}
