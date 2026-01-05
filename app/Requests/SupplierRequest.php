<?php
namespace App\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SupplierRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; 
    }

    public function rules(): array
    {
       return [
           'supplierName'    => 'required|string'
        ];
    }
}
