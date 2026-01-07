<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\NotificationService;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    protected $service;

    public function __construct(NotificationService $service)
    {
        $this->service = $service;
    }

    // GET /api/notifications
    public function index()
    {
        return $this->service->getAll();
    }

    // GET /api/notifications/user/{id}
    public function getByUser($id)
    {
        return $this->service->getByUserId($id);
    }

    // GET /api/notifications/role/{role}
    public function getByRole($role)
    {
        return $this->service->getByRole($role);
    }

    // POST /api/notifications
    public function store(Request $request)
    {
        return $this->service->create($request->all());
    }

    // DELETE /api/notifications/{id}
    public function destroy($id)
    {
        $this->service->delete($id);
        return response()->noContent();
    }
}
