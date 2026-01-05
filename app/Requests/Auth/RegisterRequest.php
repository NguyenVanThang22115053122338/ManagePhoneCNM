<?php

namespace App\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // đã chặn bằng middleware
    }

    public function rules()
    {
        return [
            'sdt' => 'required|string|max:14',
            'matKhau' => 'required|string|max:255',
            'hoVaTen' => 'required|string|max:255',
            'email' => 'required|string|max:255|email',
            'diaChi'=> 'required|string|max:255',
        ];
    }
}