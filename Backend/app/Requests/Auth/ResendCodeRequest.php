<?php

namespace App\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class ResendCodeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // đã chặn bằng middleware
    }

    public function rules()
    {
        return [
            'Email' => 'required|string|email|max:255',
        ];
    }
}