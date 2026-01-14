<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use GuzzleHttp\Client;

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

    /**
     * Lấy access token OAuth2
     */
    public function getAccessToken(): string
    {
        $res = Http::asForm()
            ->withBasicAuth($this->clientId, $this->clientSecret)
            ->post($this->baseUrl . '/v1/oauth2/token', [
                'grant_type' => 'client_credentials'
            ]);

        if (!$res->successful()) {
            throw new \RuntimeException("PayPal token error: " . $res->body());
        }

        return $res->json('access_token');
    }

    /**
     * Tạo PayPal Order (lấy approval URL)
     * return: ['id' => '...', 'approve_url' => '...']
     */
    public function createOrder(float $amount, string $currency, string $description): array
    {
        $token = $this->getAccessToken();

        $base = rtrim(env('FE_BASE_URL', 'http://localhost:5173'), '/');
        $returnUrl = $base . '/payment/success';
        $cancelUrl = $base . '/payment/cancel';

        // Nếu bạn muốn dùng APP_BASE_URL riêng:
        $appBaseUrl = env('APP_BASE_URL');
        if ($appBaseUrl) {
            $returnUrl = rtrim($appBaseUrl, '/') . '/api/paypal/return';
            $cancelUrl = rtrim($appBaseUrl, '/') . '/api/paypal/cancel';
        }

        $payload = [
            'intent' => 'CAPTURE',
            'verify' => false,
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
                'return_url' => $returnUrl,
                'cancel_url' => $cancelUrl,
                // optional:
                'user_action' => 'PAY_NOW'
            ]
        ];

        $res = Http::withToken($token)
            ->acceptJson()
            ->post($this->baseUrl . '/v2/checkout/orders', $payload);

        if (!$res->successful()) {
            throw new \RuntimeException("PayPal create order error: " . $res->body());
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
            throw new \RuntimeException("Không lấy được approve link từ PayPal: " . $res->body());
        }

        return [
            'id' => $json['id'],
            'approve_url' => $approveUrl,
        ];
    }

    /**
     * Capture PayPal Order
     * return: ['status' => 'COMPLETED', 'capture_id' => '...']
     */
    public function captureOrder(string $paypalOrderId): array
    {
        $token = $this->getAccessToken();

        $res = Http::withToken($token)
            ->withHeaders([
                'Content-Type' => 'application/json',
            ])
            ->post(
                $this->baseUrl . "/v2/checkout/orders/{$paypalOrderId}/capture",
                new \stdClass() // 🔥 JSON body = {}
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
            $json['purchase_units'][0]['payments']['captures'][0]['id'] ?? null,
            'raw' => $json,
        ];
    }



    public function getOrder(string $paypalOrderId): array
    {
        $token = $this->getAccessToken();

        $res = Http::withToken($token)
            ->acceptJson()
            ->get($this->baseUrl . "/v2/checkout/orders/{$paypalOrderId}");

        if (!$res->successful()) {
            throw new \RuntimeException("PayPal get order error: " . $res->body());
        }

        return $res->json();
    }
}
