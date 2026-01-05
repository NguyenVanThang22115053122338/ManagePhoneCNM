<?php

namespace App\Services;

use GuzzleHttp\Client;

class OpenAIService
{
    private Client $http;

    public function __construct()
    {
        $this->http = new Client([
            'base_uri' => 'https://api.openai.com/',
            'timeout'  => 30,
        ]);
    }
    public function answerGeneral(string $message): string
    {
        $payload = [
            'model' => env('OPENAI_MODEL', 'gpt-4o-mini'),
            'messages' => [
                [
                    'role' => 'system',
                    'content' =>
                        'Bạn là chuyên gia về điện thoại di động. ' .
                        'Hãy trả lời kiến thức chung, KHÔNG nhắc đến giá bán cụ thể.'
                ],
                [
                    'role' => 'user',
                    'content' => $message
                ]
            ],
            'temperature' => 0.5,
            'max_tokens' => 300
        ];

        $res = $this->http->post('v1/chat/completions', [
            'headers' => [
                'Authorization' => 'Bearer ' . env('OPENAI_API_KEY'),
                'Content-Type'  => 'application/json',
            ],
            'json' => $payload,
        ]);

        $data = json_decode((string)$res->getBody(), true);

        return $data['choices'][0]['message']['content'];
    }
    public function advise(string $message, array $phones): string
    {
        $systemPrompt = <<<PROMPT
        Bạn là nhân viên tư vấn bán điện thoại.
        QUY TẮC:
        - CHỈ được tư vấn dựa trên danh sách điện thoại được cung cấp.
        - KHÔNG bịa sản phẩm, KHÔNG bịa giá.
        - Nếu không có máy phù hợp, hãy nói rõ và hỏi thêm 1 câu để lọc nhu cầu.
        - Nếu danh sách điện thoại rỗng, KHÔNG được gợi ý mẫu cụ thể.
        - Trả lời tiếng Việt, thân thiện, đúng kiểu bán hàng.
        PROMPT;

        // Giảm nhiễu dữ liệu (optional nhưng tốt)
        $phones = array_map(function ($p) {
            return [
                'name'     => $p['name'],
                'price'    => $p['price'],
                'brand'    => $p['brand'],
                'ram'      => $p['ram'],
                'battery'  => $p['battery'],
                'storage'  => $p['storage'],
            ];
        }, $phones);

        $payload = [
            'model' => env('OPENAI_MODEL', 'gpt-4o-mini'),
            'messages' => [
                [
                    'role' => 'system',
                    'content' => $systemPrompt
                ],
                [
                    'role' => 'user',
                    'content' =>
                        "KHÁCH HỎI:\n{$message}\n\n" .
                        "DANH SÁCH ĐIỆN THOẠI (nguồn dữ liệu duy nhất):\n" .
                        json_encode($phones, JSON_UNESCAPED_UNICODE)
                ]
            ],
            'temperature' => 0.4,
            'max_tokens'  => 300,
        ];

        $res = $this->http->post('v1/chat/completions', [
            'headers' => [
                'Authorization' => 'Bearer ' . env('OPENAI_API_KEY'),
                'Content-Type'  => 'application/json',
            ],
            'json' => $payload,
        ]);

        $data = json_decode((string) $res->getBody(), true);

        return $data['choices'][0]['message']['content']
            ?? 'Hiện mình chưa tìm được máy phù hợp, bạn cho mình thêm thông tin nhé.';
    }
}
