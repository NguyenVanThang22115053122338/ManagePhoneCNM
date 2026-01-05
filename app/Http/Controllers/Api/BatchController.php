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
            'productID'       => 'nullable|integer',
            'quantity'        => 'required|integer|min:1',
            'priceIn'         => 'required|numeric|min:0',
            'productionDate'  => 'required|date',
            'expiry'          => 'nullable|date',
        ]);

        return $this->service->create($data);
    }

    public function update(Request $request, int $id)
    {
        $data = $request->validate([
            'productID'       => 'nullable|integer',
            'quantity'        => 'required|integer|min:1',
            'priceIn'         => 'required|numeric|min:0',
            'productionDate'  => 'required|date',
            'expiry'          => 'nullable|date',
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
