<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\BatchService;
use Illuminate\Http\Request;

class BatchController extends Controller
{
    protected BatchService $service;

    public function __construct(BatchService $service)
    {
        $this->service = $service;
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
            'ProductID'       => 'nullable|integer',
            'Quantity'        => 'required|integer|min:1',
            'PriceIn'         => 'required|numeric|min:0',
            'ProductionDate'  => 'required|date',
            'Expiry'          => 'nullable|date',
        ]);

        return $this->service->create($data);
    }

    public function update(Request $request, int $id)
    {
        $data = $request->validate([
            'ProductID'       => 'nullable|integer',
            'Quantity'        => 'nullable|integer|min:1',
            'PriceIn'         => 'nullable|numeric|min:0',
            'ProductionDate'  => 'nullable|date',
            'Expiry'          => 'nullable|date',
        ]);

        return $this->service->update($id, $data);
    }

    public function destroy(int $id)
    {
        $this->service->delete($id);

        return response()->json([
            'message' => 'Deleted'
        ]);
    }
}
