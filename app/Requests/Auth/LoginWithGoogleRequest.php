<?php

namespace App\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class LoginWithGoogleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // đã chặn bằng middleware
    }

    public function rules()
    {
        return [
            'id_token' => 'required|string',
        ];
    }
}