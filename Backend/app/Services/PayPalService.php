<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class PayPalService
{
    private string $baseUrl;
    private string $clientId;
    private string $clientSecret;

    public function __construct()
    {
        $mode = config('services.paypal.mode', 'sandbox');

        $this->baseUrl = $mode === 'live'
            ? 'https://api-m.paypal.com'
            : 'https://api-m.sandbox.paypal.com';

        $this->clientId = config('services.paypal.client_id');
        $this->clientSecret = config('services.paypal.client_secret');
    }

    /* =====================================================
       OAUTH TOKEN
       ===================================================== */

    public function getAccessToken(): string
    {
        $res = Http::asForm()
            ->withBasicAuth($this->clientId, $this->clientSecret)
            ->post($this->baseUrl . '/v1/oauth2/token', [
                'grant_type' => 'client_credentials'
            ]);

        if (!$res->successful()) {
            throw new \RuntimeException(
                'PayPal token error: ' . $res->body()
            );
        }

        return $res->json('access_token');
    }

    /* =====================================================
       CREATE ORDER
       ===================================================== */

    /**
     * @return array{id:string, approve_url:string}
     */
    public function createOrder(
        float $amount,
        string $currency,
        string $description
    ): array {
        $token = $this->getAccessToken();

        // 🔥 PayPal PHẢI redirect về BACKEND
        $appBaseUrl = rtrim(env('APP_BASE_URL'), '/');

        $payload = [
            'intent' => 'CAPTURE',
            'purchase_units' => [
                [
                    'description' => $description,
                    'amount' => [
                        'currency_code' => $currency,
                        'value' => number_format($amount, 2, '.', '')
                    ]
                ]
            ],
            'application_context' => [
                'return_url' => $appBaseUrl . '/api/paypal/return',
                'cancel_url' => $appBaseUrl . '/api/paypal/cancel',
                'user_action' => 'PAY_NOW'
            ]
        ];

        $res = Http::withToken($token)
            ->acceptJson()
            ->post($this->baseUrl . '/v2/checkout/orders', $payload);

        if (!$res->successful()) {
            throw new \RuntimeException(
                'PayPal create order error: ' . $res->body()
            );
        }

        $json = $res->json();

        $approveUrl = null;
        foreach (($json['links'] ?? []) as $link) {
            if (($link['rel'] ?? '') === 'approve') {
                $approveUrl = $link['href'] ?? null;
                break;
            }
        }

        if (!$approveUrl) {
            throw new \RuntimeException(
                'Không lấy được approve URL từ PayPal'
            );
        }

        return [
            'id' => $json['id'],
            'approve_url' => $approveUrl,
        ];
    }

    /* =====================================================
       CAPTURE ORDER
       ===================================================== */

    /**
     * @return array{status:?string, capture_id:?string, raw:array}
     */
    public function captureOrder(string $paypalOrderId): array
    {
        $token = $this->getAccessToken();

        $res = Http::withToken($token)
            ->acceptJson()
            ->post(
                $this->baseUrl . "/v2/checkout/orders/{$paypalOrderId}/capture",
                new \stdClass() // body {}
            );

        if (!$res->successful()) {
            throw new \RuntimeException(
                'PayPal capture error: ' . $res->body()
            );
        }

        $json = $res->json();

        return [
            'status' => $json['status'] ?? null,
            'capture_id' =>
                $json['purchase_units'][0]['payments']['captures'][0]['id']
                ?? null,
            'raw' => $json,
        ];
    }

    /* =====================================================
       GET ORDER (USED TO RESUME PAYMENT)
       ===================================================== */

    public function getOrder(string $paypalOrderId): array
    {
        $token = $this->getAccessToken();

        $res = Http::withToken($token)
            ->acceptJson()
            ->get($this->baseUrl . "/v2/checkout/orders/{$paypalOrderId}");

        if (!$res->successful()) {
            throw new \RuntimeException(
                'PayPal get order error: ' . $res->body()
            );
        }

        return $res->json();
    }

    /* =====================================================
       GET APPROVE URL (RESUME PAYMENT)
       ===================================================== */

    public function getApproveUrl(string $paypalOrderId): string
    {
        $order = $this->getOrder($paypalOrderId);

        foreach (($order['links'] ?? []) as $link) {
            if (($link['rel'] ?? '') === 'approve') {
                return $link['href'];
            }
        }

        throw new \RuntimeException(
            'Không tìm thấy approve URL từ PayPal'
        );
    }
}
