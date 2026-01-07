<?php
namespace App\Services;

use OpenAI;
use App\Models\Chat;
use Illuminate\Support\Facades\Auth;

class ChatService
{
    private ProductContextService $productContextService;

    public function __construct(ProductContextService $productContextService)
    {
        $this->productContextService = $productContextService;
    }

    public function chat(string $question): string
    {
        $context = $this->productContextService->buildContext($question);

        $systemPrompt = <<<PROMPT
        Tôi là trợ lý bán hàng cho cửa hàng điện thoại.
        - Nếu câu hỏi liên quan đến sản phẩm, hãy ưu tiên dùng dữ liệu được cung cấp.
        - Nếu không có dữ liệu phù hợp, hãy trả lời bằng kiến thức chung.
        - Trả lời ngắn gọn, dễ hiểu, bằng tiếng Việt.
        PROMPT;

        $userPrompt = $context
            ? $context . "\n\nCâu hỏi: $question"
            : $question;

        $client = OpenAI::client(config('openai.api_key'));

        $response = $client->chat()->create([
            'model' => config('openai.model'),
            'messages' => [
                ['role' => 'system', 'content' => $systemPrompt],
                ['role' => 'user', 'content' => $userPrompt],
            ],
        ]);

        $data = $response->toArray();

        if (!isset($data['choices'][0]['message']['content'])) {
            logger()->error('OpenAI API error', $data);

            throw new \RuntimeException(
                $data['error']['message'] ?? 'OpenAI response invalid'
            );
        }

        $answer = $data['choices'][0]['message']['content'];


        Chat::create([
            'user_id' => Auth::id(),
            'question' => $question,
            'answer' => $answer,
        ]);

        return $answer;
    }
}
