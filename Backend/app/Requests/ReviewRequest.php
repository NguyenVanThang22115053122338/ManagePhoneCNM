<?php
namespace App\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; 
    }

    public function rules(): array
    {
       return [
            'OrderID' => 'required|exists:order,OrderID',
            'ProductID' => 'required|exists:product,ProductID',
            'UserID' => 'required|exists:user,UserID',
            'Rating' => 'required|integer|min:1|max:5',
            'Comment' => 'nullable|string|max:1000',
            'Video' => 'nullable|file|mimes:mp4,avi,mov|max:51200', 
            'Photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120'
        ];
    }
}
