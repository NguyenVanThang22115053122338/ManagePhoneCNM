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
        if ($this->isMethod('post')) {
            return [
                'productId' => 'required|exists:product,ProductID',
                'productionDate' => 'required|date',
                'quantity' => 'required|integer|min:1',
                'priceIn' => 'required|numeric|min:0',
                'expiry' => 'required|date|after:productionDate',
                'note' => 'nullable|string|max:255',
                'date' => 'nullable|date',
            ];
        }
        
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
            'productId.required' => 'Sản phẩm không được để trống',
            'productId.exists' => 'Sản phẩm không tồn tại',
            'productionDate.required' => 'Ngày sản xuất không được để trống',
            'productionDate.date' => 'Ngày sản xuất không hợp lệ',
            'priceIn.required' => 'Giá nhập không được để trống',
            'priceIn.numeric' => 'Giá nhập phải là số',
            'priceIn.min' => 'Giá nhập phải >= 0',
            'expiry.required' => 'Hạn sử dụng không được để trống',
            'expiry.date' => 'Hạn sử dụng không hợp lệ',
            'expiry.after' => 'Hạn sử dụng phải sau ngày sản xuất',
            'BatchID.exists' => 'Lô hàng không tồn tại',
            'quantity.required' => 'Số lượng không được để trống',
            'quantity.integer' => 'Số lượng phải là số nguyên',
            'quantity.min' => 'Số lượng phải >= 1',
            'date.date' => 'Ngày không hợp lệ'
        ];
    }
}
