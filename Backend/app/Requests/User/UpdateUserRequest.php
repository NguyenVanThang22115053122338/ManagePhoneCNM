<?php

namespace App\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // đã chặn bằng middleware
    }

    public function rules()
    {
        return [
            'fullName' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|max:255|email',
            'address'=> 'sometimes|string|max:255',
            'avatar'   => 'nullable|file|image|mimes:jpg,jpeg,png,webp|max:2048',
        ];
    }
}