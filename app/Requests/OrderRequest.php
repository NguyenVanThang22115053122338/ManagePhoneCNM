<?php
namespace App\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // đã chặn bằng middleware
    }

    public function rules(): array
    {
        return [
            'Order_Date'    => 'nullable|date',
            'Status'        => 'nullable|string|max:50',
            'PaymentStatus' => 'nullable|string|max:50',
            'UserID'        => 'required|exists:user,UserID'
        ];
    }
}
