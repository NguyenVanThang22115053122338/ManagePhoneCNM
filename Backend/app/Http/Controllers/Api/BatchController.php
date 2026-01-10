<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\BatchService;
use Illuminate\Http\Request;
use App\Requests\BatchRequest;

class BatchController extends Controller
{
    protected BatchService $service;

    public function __construct(BatchService $service)
    {
        $this->service = $service;
    }

    public function index(int $perPage = 5)
    {
        return $this->service->getAll($perPage);
    }

    public function show(int $id)
    {
        return $this->service->getById($id);
    }

    public function store(BatchRequest $request)
    {
        $data = $request->validated();

        return $this->service->create($data);
    }

    public function update(BatchRequest $request, int $id)
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
