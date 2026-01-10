<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use App\Services\CloudinaryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;



class ImageUploadController extends Controller
{
    public function __construct(private CloudinaryService $cloudinary) {}

    // (optional) upload 1 ảnh dùng chung
    public function uploadSingle(Request $request)
    {
        $request->validate([
            'files' => 'required|image|max:5120', // đổi key cho đồng bộ (hoặc giữ "file")
        ]);

        $url = $this->cloudinary->uploadImage($request->file('files'), 'img-folder');

        return response()->json(['url' => $url]);
    }

    // ✅ POST /api/images/{productId}
 public function uploadProductImages(Request $request, int $productId)
{
    if (!$request->hasFile('files')) {
        return response()->json([
            'message' => 'No files uploaded'
        ], 400);
    }

    $files = $request->file('files');
    $savedImages = [];

    DB::beginTransaction();

    try {
        $startIndex = ProductImage::where('product_id', $productId)->count();

        foreach ($files as $i => $file) {

            // 🔥 UPLOAD CLOUDINARY
            $uploaded = $this->cloudinary->uploadImage(
                $file,
                "products/$productId"
            );

            // 🔥 LƯU URL CLOUDINARY
            $image = ProductImage::create([
                'product_id' => $productId,
                'url'        => $uploaded['url'],       // 👈 HTTPS Cloudinary
                'img_index'  => $startIndex + $i,
                // optional:
                // 'public_id' => $uploaded['public_id']
            ]);

            $savedImages[] = $image;
        }

        DB::commit();

        return response()->json($savedImages, 201);

    } catch (\Throwable $e) {
        DB::rollBack();

        Log::error('UPLOAD ERROR', [
            'productId' => $productId,
            'error' => $e->getMessage()
        ]);

        return response()->json([
            'message' => 'Upload failed',
            'error' => $e->getMessage()
        ], 500);
    }
}

}
