<?php

namespace App\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class CreateUserRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'sdt' => 'required|string|max:15',
            'hoVaTen' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'diaChi' => 'nullable|string|max:500',
            'roleId' => 'nullable|integer|in:1,2',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ];
    }

}