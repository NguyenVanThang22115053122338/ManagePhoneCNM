<?php

namespace App\DTO;

class CartDTO
{
    public ?int $cartId;
    public ?int $userId;
    public ?string $status;
    public array $cartItems;
    public array $productIds;

    public function __construct(array $data = [])
    {
        $this->cartId = $data['cartId'] ?? null;
        $this->userId = $data['userId'] ?? null;
        $this->status = $data['status'] ?? null;
        $this->cartItems = $data['cartItems'] ?? [];
        $this->productIds = $data['productIds'] ?? [];
    }
}
