<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Requests\OrderRequest;
use App\Resources\OrderResource;
use App\Services\OrderService;
use Illuminate\Http\Response;

class OrderController extends Controller
{
    public function __construct(
        private OrderService $service
    ) {}

    // CREATE
    public function store(OrderRequest $request)
    {
        $order = $this->service->create($request->validated());
        return response(new OrderResource($order), Response::HTTP_CREATED);
    }

    // GET BY ID
    public function show($id)
    {
        return new OrderResource(
            $this->service->getById($id)
        );
    }

    // GET BY USER
    public function byUser($userId)
    {
        return OrderResource::collection(
            $this->service->getByUser($userId)
        );
    }

    // GET ALL
    public function index()
    {
        return OrderResource::collection(
            $this->service->getAll()
        );
    }

    // UPDATE
    public function update(OrderRequest $request, $id)
    {
        $order = $this->service->update($id, $request->validated());
        return new OrderResource($order);
    }

    // DELETE
    public function destroy($id)
    {
        $this->service->delete($id);
        return response()->noContent();
    }
}
