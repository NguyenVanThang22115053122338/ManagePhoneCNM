<?php

namespace App\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // đã chặn bằng middleware
    }

    public function rules()
    {
        return [
            'sdt' => 'required|string|max:14',
            'passWord' => 'required|string|max:255',
        ];
    }
}