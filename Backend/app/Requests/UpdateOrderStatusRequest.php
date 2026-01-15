<?php

namespace App\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => 'required|in:PENDING,APPROVED,CANCELLED',
            'deliveryAddress' => 'nullable|string|max:500',
            'deliveryPhone' => 'nullable|string|max:20',
        ];
    }
}
