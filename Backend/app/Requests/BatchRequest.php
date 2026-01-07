<?php
namespace App\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BatchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; 
    }

    public function rules(): array
    {
       return [
            'productID'       => 'required|integer|exists:product,ProductID', 
            'quantity'        => 'required|integer|min:1',
            'priceIn'         => 'required|numeric|min:0',
            'productionDate'  => 'required|date',
            'expiry'          => 'nullable|date|after_or_equal:productionDate',
        ];
    }
}
