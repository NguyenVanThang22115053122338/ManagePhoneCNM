<?php
namespace App\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreatePayPalPaymentRequest extends FormRequest
{
    public function rules()
    {
        return [
            'orderId' => 'required|exists:order,OrderID'
        ];
    }
}
