<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Requests\OrderDetailRequest;
use App\Resources\OrderDetailResource;
use App\Services\OrderDetailService;

class OrderDetailController extends Controller
{
    public function __construct(
        private OrderDetailService $service
    ) {}

    // CREATE
    public function store(OrderDetailRequest $request)
    {
        $detail = $this->service->create($request->validated());
        return new OrderDetailResource($detail);
    }

    // GET BY ID
    public function show($id)
    {
        return new OrderDetailResource(
            $this->service->getById($id)
        );
    }

    // GET BY ORDER
    public function byOrder($orderId)
    {
        return OrderDetailResource::collection(
            $this->service->getByOrder($orderId)
        );
    }

    // GET ALL
    public function index()
    {
        return OrderDetailResource::collection(
            $this->service->getAll()
        );
    }

    // UPDATE
    public function update(OrderDetailRequest $request, $id)
    {
        $detail = $this->service->update($id, $request->validated());
        return new OrderDetailResource($detail);
    }

    // DELETE
    public function destroy($id)
    {
        $this->service->delete($id);
        return response()->noContent();
    }
}
