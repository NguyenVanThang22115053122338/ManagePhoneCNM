<?php

namespace App\Services;

use Cloudinary\Cloudinary;
use Illuminate\Http\UploadedFile;

class CloudinaryService
{
    protected Cloudinary $cloudinary;

    public function __construct()
    {
        $this->cloudinary = new Cloudinary([
            'cloud' => [
                'cloud_name' => config('cloudinary.cloud_name'),
                'api_key'    => config('cloudinary.api_key'),
                'api_secret' => config('cloudinary.api_secret'),
            ],
        ]);
    }

    public function uploadImage(UploadedFile $file, string $folder): string
    {
        $res = $this->cloudinary->uploadApi()->upload(
            $file->getRealPath(),
            ['folder' => $folder, 'resource_type' => 'image']
        );

        return $res['secure_url'];
    }

    public function uploadVideo(UploadedFile $file, string $folder): string
    {
        $res = $this->cloudinary->uploadApi()->upload(
            $file->getRealPath(),
            ['folder' => $folder, 'resource_type' => 'video']
        );

        return $res['secure_url'];
    }

    public function deleteFile(string $publicId, string $resourceType = 'image')
    {
        return $this->cloudinary->uploadApi()->destroy($publicId, [
            'resource_type' => $resourceType
        ]);
    }
}
