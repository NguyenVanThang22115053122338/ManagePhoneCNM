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
           'orderDate'       => 'nullable|date',
            'status'         => 'nullable|string|max:50',
            'paymentStatus'  => 'nullable|string|max:50',
            'userID'         => 'nullable|exists:user,UserID',
            'deliveryAddress'=> 'nullable|string|max:500',
            'deliveryPhone'  => 'nullable|string|max:20'
        ];
    }
}
