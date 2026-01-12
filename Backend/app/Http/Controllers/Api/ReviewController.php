<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Resources\ReviewResource;
use App\Models\Review;
use App\Services\ReviewService;
use App\Services\CloudinaryService;
use Illuminate\Http\Request;
use App\Requests\ReviewRequest;

class ReviewController extends Controller
{
    private ReviewService $service;
    private CloudinaryService $cloudinaryService;

    public function __construct(ReviewService $service,CloudinaryService $cloudinaryService)
    {
        $this->service = $service;
        $this->cloudinaryService = $cloudinaryService;
    }

    public function getByProduct(int $productId)
    {
        $reviews = $this->service->getByProduct($productId);

        return ReviewResource::collection($reviews);
    }


public function createReview(ReviewRequest $request): ReviewResource|JsonResponse
{
    try {
        $validated = $request->validated();  // ✅ Lấy data đã validate

        // Upload Photo
        if ($request->hasFile('Photo')) {
            $uploadResult = $this->cloudinaryService->uploadImage(
                $request->file('Photo'),
                'reviews/photos'
            );
            $validated['Photo'] = $uploadResult['url'];
        }

        // Upload Video
        if ($request->hasFile('Video')) {
            $uploadResult = $this->cloudinaryService->uploadVideo(
                $request->file('Video'),
                'reviews/videos'
            );
            $validated['Video'] = $uploadResult['url'];
        }

        $review = $this->service->create($validated);  // ✅

        return new ReviewResource($review);

    } catch (\Exception $e) {
        return response()->json([
            'message' => $e->getMessage()
        ], 400);
    }
}
}