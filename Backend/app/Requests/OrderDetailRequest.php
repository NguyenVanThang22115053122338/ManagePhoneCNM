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
            'OrderID'   => 'required|exists:order,OrderID',
            'ProductID' => 'required|exists:product,ProductID',
            'Quantity'  => 'required|integer|min:1'
        ];
    }
}
