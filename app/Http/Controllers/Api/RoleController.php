<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\RoleService;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function __construct(
        private RoleService $service
    ) {
        // $this->middleware(['auth:sanctum', 'role:ADMIN']);
    }

    public function index()
    {
        return response()->json(
            $this->service->getAll()
        );
    }

    public function show(int $id)
    {
        $role = $this->service->getById($id);

        if (!$role) {
            return response()->json(['message' => 'Not found'], 404);
        }

        return response()->json($role);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'RoleName' => 'required|string|max:50'
        ]);

        return response()->json(
            $this->service->save($data),
            201
        );
    }

    public function update(Request $request, int $id)
    {
        $data = $request->validate([
            'RoleName' => 'required|string|max:50'
        ]);

        return response()->json(
            $this->service->save($data, $id)
        );
    }

    public function destroy(int $id)
    {
        $this->service->delete($id);
        return response()->json(['message' => 'Deleted']);
    }
}
