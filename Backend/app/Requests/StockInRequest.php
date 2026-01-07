<?php

namespace App\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StockInRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'BatchID' => 'nullable|exists:batch,BatchID',
            'quantity' => 'required|integer|min:1',
            'note' => 'nullable|string|max:255',
            'date' => 'nullable|date',
        ];
    }

    public function messages()
    {
        return [
            'BatchID.exists' => 'Lô hàng không tồn tại',
            'quantity.required' => 'Số lượng không được để trống',
            'quantity.integer' => 'Số lượng phải là số nguyên',
            'quantity.min' => 'Số lượng phải >= 1',
            'date.date' => 'Ngày không hợp lệ'
        ];
    }
}
