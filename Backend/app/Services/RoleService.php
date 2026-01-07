<?php

namespace App\Services;

use App\Models\Role;

class RoleService
{
    public function getAll()
    {
        return Role::all();
    }

    public function getById(int $id)
    {
        return Role::find($id);
    }

    public function save(array $data, ?int $id = null)
    {
        if ($id) {
            $role = Role::findOrFail($id);
            $role->update($data);
            return $role;
        }

        return Role::create($data);
    }

    public function delete(int $id): void
    {
        Role::destroy($id);
    }
}
