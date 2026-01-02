<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\BrandService;
use Illuminate\Http\Request;

class BrandController extends Controller
{
    public function __construct(
        private BrandService $service
    ) {
        // $this->middleware('jwt');
    }

    public function index()
    {
        return $this->service->getAll();
    }

    public function show(int $id)
    {
        return $this->service->getById($id);
    }

    public function search(Request $request)
    {
        return $this->service->searchByName($request->query('name'));
    }

    public function byCountry(string $country)
    {
        return $this->service->getByCountry($country);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'country' => 'nullable|string',
            'description' => 'nullable|string'
        ]);

        try {
            return $this->service->create($data);
        } catch (\RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 409); // Conflict
        }
    }

    public function update(Request $request, int $id)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'country' => 'nullable|string',
            'description' => 'nullable|string'
        ]);

        return $this->service->update($id, $data);
    }

    public function destroy(int $id)
    {
        $this->service->delete($id);
        return response()->json(['message' => 'Deleted']);
    }
}
