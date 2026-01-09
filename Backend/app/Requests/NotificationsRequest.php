<?php
namespace App\Requests;

use Illuminate\Foundation\Http\FormRequest;

class NotificationsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; 
    }

    public function rules(): array
    {
       return [
            'title'           => 'sometimes|string|max:255',
            'content'         => 'sometimes|string',
            'notificationType' => 'sometimes|in:SYSTEM,PROMOTION,PERSONAL,ORDER',
            'sendToAll'       => 'sometimes|boolean'
      
        ];
    }
}
