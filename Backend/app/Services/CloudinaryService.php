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

    public function uploadImage(UploadedFile $file, string $folder): array
    {
        $res = $this->cloudinary->uploadApi()->upload(
            $file->getRealPath(),
            [
                'folder' => $folder,
                'resource_type' => 'image',
                'unique_filename' => true,
                'overwrite' => false,
            ]
        );

        return [
            'url' => $res['secure_url'],
            'public_id' => $res['public_id'],
        ];
    }

    public function uploadVideo(UploadedFile $file, string $folder): array
    {
        $res = $this->cloudinary->uploadApi()->upload(
            $file->getRealPath(),
            [
                'folder' => $folder,
                'resource_type' => 'video',
                'unique_filename' => true,
                'overwrite' => false,
            ]
        );

        return [
            'url' => $res['secure_url'],
            'public_id' => $res['public_id'],
        ];
    }

    public function deleteFile(string $publicId, string $resourceType = 'image'): bool
    {
        $res = $this->cloudinary->uploadApi()->destroy($publicId, [
            'resource_type' => $resourceType,
        ]);

        return ($res['result'] ?? null) === 'ok';
    }
}
