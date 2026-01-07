<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SupplierService;
use App\Requests\SupplierRequest;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    protected SupplierService $service;

    public function __construct(SupplierService $service)
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

    public function store(SupplierRequest $request)
    {
        $data = $request->validated();
    
        try {
            return $this->service->create($data);
        } catch (\RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 409);
        }
    }

    public function update(SupplierRequest $request, int $id)
    {
        $data = $request->validated();

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
