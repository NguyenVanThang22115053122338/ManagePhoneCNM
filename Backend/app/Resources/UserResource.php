<?php

namespace App\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'userId'=>$this->UserID,
            'sdt'=>$this->SDT,
            'fullName'=>$this->FullName,
            'email'=>$this->Email,
            'address'=>$this->Address,
            'avatar'=>$this->Avatar,
            'googleId'=>$this->googleId,
            'role'=>$this->RoleID,
            'is_verified'=>$this->is_verified,
        ];
    }
}
