<?php

namespace App\Infrastructure\OpenAI;

use OpenAI;
use App\Domain\Chat\Contracts\AiResponder;
use App\Domain\Chat\DTO\ChatResult;

class OpenAiChatResponder implements AiResponder
{
    private \OpenAI\Client $client;
    private string $model;

    public function __construct()
    {
        // ✅ Cách tạo client ĐÚNG cho v0.8.x
        $this->client = OpenAI::client(config('openai.api_key'));
        $this->model  = config('openai.model', 'gpt-3.5-turbo');
    }

    public function respond(string $systemPrompt, string $userPrompt, array $meta = []): ChatResult
    {
        $response = $this->client->chat()->create([
            'model' => $this->model,
            'messages' => [
                ['role' => 'system', 'content' => $systemPrompt],
                ['role' => 'user', 'content' => $userPrompt],
            ],
            'temperature' => 0.7,
            'max_tokens' => 300,
        ]);

        $data = $response->toArray();

        return new ChatResult(
            text: $data['choices'][0]['message']['content'] ?? '',
            raw: $data
        );
    }

    public function stream(string $systemPrompt, string $userPrompt, array $meta = []): \Generator
    {
        // ❌ SDK 0.8 KHÔNG STREAM
        yield from [];
    }
}
