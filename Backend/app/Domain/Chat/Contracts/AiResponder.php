<?php

namespace App\Domain\Chat\Contracts;

use App\Domain\Chat\DTO\ChatResult;

interface AiResponder
{
    public function respond(string $systemPrompt, string $userPrompt, array $meta = []): ChatResult;

    /**
     * Stream text deltas (chunks) as generator.
     * @return \Generator<string>
     */
    public function stream(string $systemPrompt, string $userPrompt, array $meta = []): \Generator;
}
