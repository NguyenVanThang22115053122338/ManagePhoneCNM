<?php
namespace App\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrderDetailRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'orderID'   => 'required|exists:order,OrderID',
            'productID' => 'required|exists:product,ProductID',
            'quantity'  => 'required|integer|min:1'
        ];
    }
}
