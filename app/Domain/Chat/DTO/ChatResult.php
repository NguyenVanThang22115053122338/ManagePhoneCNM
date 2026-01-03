<?php

namespace App\Domain\Chat\DTO;

class ChatResult
{
    public function __construct(
        public readonly string $text,
        public readonly array $raw = [],
        public readonly ?string $responseId = null,
        public readonly ?int $inputTokens = null,
        public readonly ?int $outputTokens = null,
    ) {}
}
