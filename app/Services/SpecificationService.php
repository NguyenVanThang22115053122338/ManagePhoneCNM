<?php

namespace App\Services;

use App\Models\Specification;
use App\Resources\SpecificationResource;

class SpecificationService
{
    public function getAll()
    {
        return SpecificationResource::collection(Specification::all());
    }

    public function getById(int $id)
    {
        $spec = Specification::findOrFail($id);
        return new SpecificationResource($spec);
    }

    public function create(array $data)
    {
        $spec = Specification::create($data);
        return new SpecificationResource($spec);
    }

    public function update(int $id, array $data)
    {
        $spec = Specification::findOrFail($id);
        $spec->update($data);

        return new SpecificationResource($spec);
    }

    public function delete(int $id): void
    {
        $spec = Specification::findOrFail($id);
        $spec->delete();
    }
}
