<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CloudinaryService;
use Illuminate\Http\Request;

class ImageUploadController extends Controller
{
    private CloudinaryService $cloudinary;

    public function __construct(CloudinaryService $cloudinary)
    {
        $this->cloudinary = $cloudinary;
    }

    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|image|max:5120'
        ]);

        $url = $this->cloudinary->uploadImage($request->file('file'), 'img-folder');

        return response()->json($url);
    }
}
