<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SpecificationService;
use Illuminate\Http\Request;

class SpecificationController extends Controller
{
    public function __construct(
        private SpecificationService $service
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
            'screen'  => 'nullable|string',
            'cpu'     => 'nullable|string',
            'ram'     => 'nullable|string',
            'storage' => 'nullable|string',
            'camera'  => 'nullable|string',
            'battery' => 'nullable|string',
            'os'      => 'nullable|string',
        ]);

        return $this->service->create($data);
    }

    public function update(Request $request, int $id)
    {
        $data = $request->validate([
            'screen'  => 'nullable|string',
            'cpu'     => 'nullable|string',
            'ram'     => 'nullable|string',
            'storage' => 'nullable|string',
            'camera'  => 'nullable|string',
            'battery' => 'nullable|string',
            'os'      => 'nullable|string',
        ]);

        return $this->service->update($id, $data);
    }

    public function destroy(int $id)
    {
        $this->service->delete($id);
        return response()->json(['message' => 'Deleted']);
    }
}
