<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CategoryService;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function __construct(
        private CategoryService $service
    ) {
        // $this->middleware(['jwt', 'role:ADMIN,USER'])->only(['index', 'show']);
        // $this->middleware(['jwt', 'role:ADMIN'])->except(['index', 'show']);
    }

    public function index()
    {
        return $this->service->getAll();
    }

    public function show(int $id)
    {
        return $this->service->getById($id);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'categoryName' => 'required|string',
            'description'  => 'nullable|string',
        ]);

        try {
            return $this->service->create($data);
        } catch (\RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 409);
        }
    }

    public function update(Request $request, int $id)
    {
        $data = $request->validate([
            'categoryName' => 'required|string',
            'description'  => 'nullable|string',
        ]);

        return $this->service->update($id, $data);
    }

    public function destroy(int $id)
    {
        $this->service->delete($id);
        return response()->json(['message' => 'Deleted']);
    }
}
