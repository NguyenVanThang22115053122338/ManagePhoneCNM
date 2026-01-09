<?php

namespace App\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'notificationId'   => $this->NotificationID,
            'title' => $this->Title,
            'content'  => $this->Content,
            'notificationType'  => $this->NotificationType,
            'isRead'  => (bool) ($this->pivot->isRead ?? false)
        ];
    }
}
