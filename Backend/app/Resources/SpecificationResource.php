<?php

namespace App\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SpecificationResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'specId'  => $this->specId,
            'screen'  => $this->screen,
            'cpu'     => $this->cpu,
            'ram'     => $this->ram,
            'storage' => $this->storage,
            'camera'  => $this->camera,
            'battery' => $this->battery,
            'os'      => $this->os,
        ];
    }
}
