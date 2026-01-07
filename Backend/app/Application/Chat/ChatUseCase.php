<?php

namespace App\Application\Chat;

use App\Domain\Chat\Contracts\AiResponder;
use App\Services\ProductContextService;
use Illuminate\Support\Facades\Cache;

class ChatUseCase
{
    public function __construct(
        private readonly AiResponder $ai,
        private readonly ProductContextService $contextService,
    ) {}

    /**
     * Chat thường (có cache)
     */
    public function ask(string $question, ?int $userId = null): string
    {
        [$systemPrompt, $userPrompt, $productIds] = $this->buildPrompts($question);

        $cacheKey = $this->cacheKey($question, $productIds);
        $cacheTtl = now()->addMinutes(30);

        $resolver = function () use ($systemPrompt, $userPrompt, $userId) {
            $result = $this->ai->respond(
                $systemPrompt,
                $userPrompt,
                ['user_id' => (string) ($userId ?? 'guest')]
            );

            return $result->text;
        };

        // ✅ Nếu cache store hỗ trợ tags (Redis, Memcached)
        if (cacheSupportsTags()) {
            $tags = $this->cacheTags($productIds);

            return Cache::tags($tags)->remember($cacheKey, $cacheTtl, $resolver);
        }

        // 🔁 Fallback cho file / array cache
        return Cache::remember($cacheKey, $cacheTtl, $resolver);
    }

    /**
     * Stream realtime (KHÔNG cache)
     *
     * @return \Generator<string>
     */
    public function stream(string $question, ?int $userId = null): \Generator
    {
        [$systemPrompt, $userPrompt] = $this->buildPrompts($question);

        return $this->ai->stream(
            $systemPrompt,
            $userPrompt,
            ['user_id' => (string) ($userId ?? 'guest')]
        );
    }

    /**
     * Build system + user prompt + productIds
     */
    private function buildPrompts(string $question): array
    {
        [$context, $productIds] = $this->contextService->buildContextWithIds($question);

        $systemPrompt = <<<PROMPT
Bạn là trợ lý bán hàng cho cửa hàng điện thoại.
- Nếu câu hỏi liên quan sản phẩm, ưu tiên dùng dữ liệu được cung cấp.
- Nếu không đủ dữ liệu, nói rõ "mình không thấy sản phẩm khớp" rồi tư vấn chung.
- Trả lời ngắn gọn, dễ hiểu, tiếng Việt.
PROMPT;

        $userPrompt = $context
            ? $context . "\n\nCâu hỏi: {$question}"
            : $question;

        return [$systemPrompt, $userPrompt, $productIds];
    }

    /**
     * Cache key duy nhất theo question + productIds
     */
    private function cacheKey(string $question, array $productIds): string
    {
        sort($productIds);
        $idsHash = sha1(json_encode($productIds));

        return 'ai:chat:' . $idsHash . ':' . sha1($question);
    }

    /**
     * Cache tags (chỉ dùng khi cache store support)
     */
    private function cacheTags(array $productIds): array
    {
        $tags = ['ai', 'ai:chat'];

        foreach ($productIds as $id) {
            $tags[] = 'product:' . $id;
        }

        return $tags;
    }
}
